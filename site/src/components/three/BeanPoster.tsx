/** Versão estática e leve do grão escaneado (render do mesmo modelo 3D).
    Aparece antes do 3D carregar e em aparelhos sem WebGL ou fracos. */
export function BeanPoster({ className = "" }: { className?: string }) {
  return (
    <img
      src="/models/grao-poster.webp"
      width={460}
      height={670}
      alt="Grão de café torrado"
      decoding="async"
      className={`object-contain ${className}`}
    />
  );
}
