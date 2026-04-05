interface LoadingButtonProps {
  loading: boolean;
  onClick: () => void;
  loadingText: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export default function LoadingButton({
  loading,
  onClick,
  loadingText,
  children,
  disabled = false,
  className = '',
}: LoadingButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`w-full px-6 py-3 rounded-[10px] text-[15px] font-bold border-none mt-1 transition-all duration-200 ${
        loading
          ? 'bg-bg-input text-text-muted cursor-not-allowed'
          : 'bg-linear-to-br from-brand to-brand-hover text-white cursor-pointer shadow-[0_0_20px_rgba(59,130,246,.25)] hover:opacity-85'
      } ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}


