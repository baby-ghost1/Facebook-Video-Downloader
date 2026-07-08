const Loader = ({ text, className = "" }) => {
  return (
    <div className={`flex items-center gap-3 text-sm ${className}`}>
      <span className="relative flex h-4 w-4">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40"
          style={{ background: "var(--primary)" }}
        />
        <span
          className="relative inline-flex rounded-full h-4 w-4"
          style={{ background: "var(--primary)" }}
        />
      </span>
      {text && <span className="text-[var(--text-secondary)] font-medium">{text}</span>}
    </div>
  );
};

export default Loader;
