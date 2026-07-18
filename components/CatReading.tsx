import Image from "next/image";

export function CatReading({
  className,
  variant = "card",
}: {
  className?: string;
  variant?: "card" | "icon";
}) {
  const src = variant === "card" ? "/cat-reading.svg" : "/cat-icon.svg";
  return (
    <Image
      src={src}
      alt="Gatinho lendo um livro"
      width={500}
      height={500}
      className={className}
      priority
    />
  );
}
