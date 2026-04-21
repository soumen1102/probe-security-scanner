import React, { useState, useEffect } from 'react';
import { RefreshCw, Volume2, Loader2, Keyboard, KeyboardOff } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";

interface CaptchaProps {
  onVerify: (isValid: boolean) => void;
}

// Manual base64 decoding as per guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// PCM Audio decoding utility as per guidelines
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
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

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'.split('');

export const Captcha: React.FC<CaptchaProps> = ({ onVerify }) => {
  const [code, setCode] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
    setUserInput('');
    setIsError(false);
    onVerify(false);
  };

  useEffect(() => {
    generateCode();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | string) => {
    const val = typeof e === 'string' ? e.toUpperCase() : e.target.value.toUpperCase();
    setUserInput(val);
    if (val === code) {
      onVerify(true);
      setIsError(false);
    } else {
      onVerify(false);
    }
  };

  const handleKeyClick = (char: string) => {
    if (userInput.length < 6) {
      handleChange(userInput + char);
    }
  };

  const handleBackspace = () => {
    handleChange(userInput.slice(0, -1));
  };

  const handleBlur = () => {
    if (userInput !== code && userInput.length > 0) {
      setIsError(true);
    }
  };

  const playAudioCaptcha = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const apiKey = (globalThis as any).process?.env?.API_KEY || process.env.GEMINI_API_KEY || "";
      const ai = new GoogleGenAI({ apiKey });
      const spelledCode = code.split('').join(' ');
      const prompt = `Say clearly: ${spelledCode}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const audioPart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      const base64Audio = audioPart?.inlineData?.data;
      
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const rawBytes = decode(base64Audio);
        const audioBuffer = await decodeAudioData(rawBytes, audioCtx, 24000, 1);
        
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        source.onended = () => {
          setIsSpeaking(false);
          audioCtx.close();
        };
        source.start(0);
      } else {
        setIsSpeaking(false);
      }
    } catch (err) {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-3 shadow-inner">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verification Node</label>
        <div className="flex gap-1">
          <button 
            type="button"
            onClick={() => setShowKeyboard(!showKeyboard)}
            className={`p-1.5 rounded transition-colors ${showKeyboard ? 'bg-blue-500 text-white' : 'hover:bg-slate-800 text-blue-400'}`}
            title="Virtual Keyboard"
          >
            {showKeyboard ? <KeyboardOff size={14} /> : <Keyboard size={14} />}
          </button>
          <button 
            type="button"
            onClick={playAudioCaptcha}
            disabled={isSpeaking}
            className="p-1.5 hover:bg-slate-800 rounded transition-colors text-blue-400 disabled:opacity-50"
            title="Listen to code"
          >
            {isSpeaking ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
          </button>
          <button 
            type="button"
            onClick={generateCode}
            className="p-1.5 hover:bg-slate-800 rounded transition-colors"
            title="Refresh Captcha"
          >
            <RefreshCw size={14} className="text-blue-400" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex gap-3 items-center">
          <div className="bg-gradient-to-br from-slate-800 to-slate-950 px-4 py-2 rounded-lg border border-slate-700 select-none shadow-xl">
            <span className="text-xl sm:text-2xl font-mono font-bold tracking-[0.3em] text-blue-400 italic blur-[0.5px]">
              {code}
            </span>
          </div>
          
          <div className="flex-1">
            <input
              type="text"
              placeholder="TYPE CODE..."
              value={userInput}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              className={`w-full bg-slate-950 border ${isError ? 'border-red-500' : 'border-slate-800'} rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all uppercase font-mono`}
            />
          </div>
        </div>

        {showKeyboard && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-8 sm:grid-cols-10 gap-1 p-2 bg-slate-950 rounded-lg border border-slate-800">
              {CHARS.map((char) => (
                <button
                  key={char}
                  type="button"
                  onClick={() => handleKeyClick(char)}
                  className="p-1.5 text-[10px] font-black bg-slate-800 hover:bg-blue-500 rounded text-slate-300 hover:text-white transition-all active:scale-90"
                >
                  {char}
                </button>
              ))}
              <button
                type="button"
                onClick={handleBackspace}
                className="col-span-2 p-1.5 text-[10px] font-black bg-slate-700 hover:bg-red-500 rounded text-slate-300 hover:text-white transition-all active:scale-95"
              >
                DEL
              </button>
            </div>
          </div>
        )}
      </div>

      {isError && (
        <p className="text-[9px] text-red-500 font-black uppercase tracking-widest">Verification mismatch. Re-verify perimeters.</p>
      )}
    </div>
  );
};