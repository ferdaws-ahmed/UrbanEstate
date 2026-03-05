export default function CardWrapper({ children }) {
  return (
    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10
      rounded-3xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)]
      hover:shadow-indigo-500/20 hover:-translate-y-1
      transition-all duration-300">
      {children}
    </div>
  );
}