// template.tsx her gezinmede yeniden mount olur → sayfa içeriği yumuşakça belirir
// (header/footer layout'ta olduğu için sabit kalır).
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
