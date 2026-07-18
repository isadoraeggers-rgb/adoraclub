import { Playfair_Display, Alex_Brush } from "next/font/google";
import clsx from "clsx";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  style: ["normal"],
});

const script = Alex_Brush({
  subsets: ["latin"],
  weight: "400",
});

export function AdoraLogo({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const color = tone === "light" ? "text-[#f5f0af]" : "text-[#41525f]";
  return (
    <div className={clsx("flex select-none flex-col items-center leading-none", className)}>
      <span
        className={clsx(playfair.className, color)}
        style={{ fontSize: "1em", letterSpacing: "0.02em" }}
      >
        Adora
      </span>
      <span
        className={clsx(script.className, color, "-mt-[0.22em]")}
        style={{ fontSize: "0.95em" }}
      >
        Club
      </span>
    </div>
  );
}
