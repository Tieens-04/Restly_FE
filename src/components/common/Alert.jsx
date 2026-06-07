export function Alert({ children, tone = 'error' }) {
  const styles = {
    error: 'border-[#f4b4ae] bg-[#fce8e6] text-[#a83531]',
    warning: 'border-[#f2d18d] bg-[#fff4db] text-[#8a5a00]',
    info: 'border-[#bdd0ff] bg-[#eaf0ff] text-[#1e5eff]',
  };

  return (
    <div className={`rounded-md border p-4 text-sm leading-6 ${styles[tone] || styles.error}`}>
      {children}
    </div>
  );
}
