import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, hint, icon, className, id, ...props }, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full">
      {label && <label htmlFor={inputId} className="block text-sm text-ink-300 mb-1.5">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500">{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-navy-800 border rounded-md py-2.5 text-sm text-ink-100 placeholder:text-ink-500 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50',
            icon ? 'pl-10 pr-3.5' : 'px-3.5',
            error ? 'border-danger/60' : 'border-white/10',
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-danger mt-1.5">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-500 mt-1.5">{hint}</p>}
    </div>
  );
});
Input.displayName = 'Input';
export default Input;
