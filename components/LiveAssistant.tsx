
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { industrialAssistantSystemInstruction } from '../services/geminiService';

// Audio helpers - implemented manually as per guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const LiveAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
    setIsConnecting(false);
  }, []);

  const startSession = async () => {
    setIsConnecting(true);
    try {
      // Use process.env.API_KEY directly in the constructor
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      }
      if (!outputAudioContextRef.current) {
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmData = encode(new Uint8Array(int16.buffer));
              
              // Always use sessionPromise to handle data transfer to avoid race conditions
              sessionPromise.then(session => {
                session.sendRealtimeInput({
                  media: { data: pcmData, mimeType: 'audio/pcm;rate=16000' }
                });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Process model turn parts for audio output
            if (message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
              const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
              const audioCtx = outputAudioContextRef.current!;
              
              // Track start time for gapless audio playback
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
              
              const source = audioCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(audioCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            if (message.serverContent?.outputTranscription) {
               setTranscription(prev => [...prev.slice(-4), `ARES: ${message.serverContent.outputTranscription.text}`]);
            }
          },
          onerror: (e) => {
            console.error("Live API Error:", e);
            stopSession();
          },
          onclose: () => {
            stopSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: industrialAssistantSystemInstruction,
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (error) {
      console.error("Failed to start session:", error);
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    return () => stopSession();
  }, [stopSession]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Industrial Voice Assistant</h2>
        <p className="text-slate-400 max-w-md">Connect with ARES, your dedicated Industrial AI consultant, to optimize your factory operations in real-time.</p>
      </div>

      <div className="relative">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
          isActive ? 'bg-blue-600 scale-110 shadow-[0_0_50px_rgba(37,99,235,0.4)]' : 'bg-slate-800'
        }`}>
          {isActive ? (
            <div className="flex gap-1 items-end h-8">
               {[...Array(5)].map((_, i) => (
                 <div key={i} className="w-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s`, height: `${Math.random() * 100}%` }} />
               ))}
            </div>
          ) : (
            <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </div>
        
        {isConnecting && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={isActive ? stopSession : startSession}
          disabled={isConnecting}
          className={`px-8 py-3 rounded-full font-bold transition-all ${
            isActive 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20' 
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
          }`}
        >
          {isActive ? 'Disconnect Assistant' : isConnecting ? 'Establishing Link...' : 'Consult Engineer'}
        </button>
        
        <p className="text-xs text-slate-500 font-mono">
          {isActive ? 'SECURE_CHANNEL_ACTIVE' : 'IDLE_WAITING_FOR_UPLINK'}
        </p>
      </div>

      {transcription.length > 0 && (
        <div className="w-full max-w-xl bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Live Transcription</h4>
          <div className="space-y-2">
            {transcription.map((line, i) => (
              <p key={i} className="text-sm text-slate-300 animate-fade-in">{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveAssistant;
