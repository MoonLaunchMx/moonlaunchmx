export default function Icono({
  d,
  size = 24,
  color = "currentColor",
  grosor = 2.2,
}: {
  d: string;
  size?: number;
  color?: string;
  grosor?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={grosor}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}
