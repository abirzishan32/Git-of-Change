import { LoaderCircle } from 'lucide-react';
import { buttonClasses } from './button-styles';

export function Button({
  variant,
  size,
  className,
  isLoading = false,
  disabled,
  type = 'button',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
