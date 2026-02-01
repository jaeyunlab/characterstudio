import { Sparkles } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PromptInput({ value, onChange, disabled = false }: PromptInputProps) {
  return (
    <div className="w-full">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
        <Sparkles size={16} className="text-indigo-400" />
        추가 프롬프트 (선택사항)
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="예: 파스텔 톤으로 그려주세요, 배경을 우주로 해주세요..."
        className={`
          w-full h-24 px-4 py-3 rounded-xl
          bg-white/5 border border-white/10
          text-white placeholder-gray-500
          focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20
          resize-none transition-all
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      />
      <p className="text-xs text-gray-500 mt-2">
        입력하지 않으면 다양한 포즈와 표정으로 자동 생성됩니다
      </p>
    </div>
  );
}
