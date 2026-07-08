import { forwardRef } from "react";

const Input = forwardRef(({ value, onChange, placeholder, className = "", icon: Icon, ...props }, ref) => {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
          <Icon size={18} />
        </div>
      )}
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 bg-[var(--input-bg)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] border border-[var(--input-border)] focus:border-[var(--input-focus)] focus:ring-2 focus:ring-[var(--primary-glow)] ${Icon ? "pl-11" : ""} ${className}`}
        {...props}
      />
    </div>
  );
});

Input.displayName = "Input";
export default Input;
