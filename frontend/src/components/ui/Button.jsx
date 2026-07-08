import { forwardRef } from "react";

const variants = {
  primary: "text-white shadow-lg shadow-[var(--primary-glow)]",
  secondary: "hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-border)]",
  ghost: "hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
  danger: "text-[var(--danger)] border border-[var(--danger)]/20",
  success: "text-[var(--success)] border border-[var(--success)]/20",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
  xl: "px-8 py-4 text-lg rounded-2xl",
};

const Button = forwardRef(({
  children, onClick, disabled, className = "", variant = "primary",
  size = "md", type = "button", icon: Icon, loading: isLoading, style, ...props
}, ref) => {
  const variantStyle = variant === "primary" && !style?.background
    ? { background: "var(--primary-gradient)" }
    : {};
  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      style={{ ...variantStyle, ...style }}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-300
        active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />
      ) : Icon ? (
        <Icon size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = "Button";
export default Button;
