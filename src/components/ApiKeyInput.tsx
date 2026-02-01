import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeyChange: (geminiKey: string, nanoBananaKey: string) => void;
}

export function ApiKeyInput({ onApiKeyChange }: ApiKeyInputProps) {
  const [geminiKey, setGeminiKey] = useState('');
  const [nanoBananaKey, setNanoBananaKey] = useState('');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showNanoBananaKey, setShowNanoBananaKey] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // 로컬 스토리지에서 API 키 로드
  useEffect(() => {
    const savedGeminiKey = localStorage.getItem('gemini_api_key') || '';
    const savedNanoBananaKey = localStorage.getItem('nano_banana_api_key') || '';
    setGeminiKey(savedGeminiKey);
    setNanoBananaKey(savedNanoBananaKey);
    onApiKeyChange(savedGeminiKey, savedNanoBananaKey);
  }, []);

  const handleGeminiKeyChange = (value: string) => {
    setGeminiKey(value);
    localStorage.setItem('gemini_api_key', value);
    onApiKeyChange(value, nanoBananaKey);
  };

  const handleNanoBananaKeyChange = (value: string) => {
    setNanoBananaKey(value);
    localStorage.setItem('nano_banana_api_key', value);
    onApiKeyChange(geminiKey, value);
  };

  const hasGeminiKey = geminiKey.length > 0;
  const _hasNanoBananaKey = nanoBananaKey.length > 0;
  void _hasNanoBananaKey; // for future use

  return (
    <div className="w-full">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 rounded-xl
                   bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
      >
        <div className="flex items-center gap-2">
          <Key size={18} className="text-indigo-400" />
          <span className="text-sm font-medium text-gray-300">API 키 설정</span>
        </div>
        <div className="flex items-center gap-2">
          {hasGeminiKey ? (
            <span className="flex items-center gap-1 text-xs text-green-400">
              <Check size={14} />
              Gemini
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-yellow-400">
              <AlertCircle size={14} />
              필요
            </span>
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-3 p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
          {/* Gemini API Key */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Gemini API 키 (필수)
            </label>
            <div className="relative">
              <input
                type={showGeminiKey ? 'text' : 'password'}
                value={geminiKey}
                onChange={(e) => handleGeminiKeyChange(e.target.value)}
                placeholder="AIza..."
                className="w-full py-2.5 px-4 pr-10 rounded-lg
                         bg-white/5 border border-white/10
                         text-white placeholder-gray-500 text-sm
                         focus:outline-none focus:border-indigo-500/50"
              />
              <button
                onClick={() => setShowGeminiKey(!showGeminiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showGeminiKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1 text-xs text-indigo-400 hover:underline"
            >
              API 키 발급받기 →
            </a>
          </div>

          {/* Nano Banana API Key */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Nano Banana API 키 (선택 - 백업용)
            </label>
            <div className="relative">
              <input
                type={showNanoBananaKey ? 'text' : 'password'}
                value={nanoBananaKey}
                onChange={(e) => handleNanoBananaKeyChange(e.target.value)}
                placeholder="nb-..."
                className="w-full py-2.5 px-4 pr-10 rounded-lg
                         bg-white/5 border border-white/10
                         text-white placeholder-gray-500 text-sm
                         focus:outline-none focus:border-indigo-500/50"
              />
              <button
                onClick={() => setShowNanoBananaKey(!showNanoBananaKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showNanoBananaKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Gemini 할당량 초과 시 자동으로 사용됩니다
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
