const variants = {
  primary: 'bg-[#1e5eff] text-white hover:bg-[#164bd1] disabled:bg-[#aeb8ca]',
  dark: 'bg-[#172033] text-white hover:bg-[#26324a] disabled:bg-[#aeb8ca]',
  secondary: 'border border-[#d9e0ec] bg-white text-[#172033] hover:bg-[#f1f4f9] disabled:bg-[#f1f4f9]',
};

export function Button({ children, className = '', variant = 'primary', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
