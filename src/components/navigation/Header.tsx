import { useTheme } from "@/context/ThemeContext";
import { ThemeToggle } from "../ThemeToggle";

export function Header() {
  const { theme } = useTheme();

  return (
    <header className="z-50 flex w-full items-center justify-center bg-background/80 py-4 backdrop-blur border-b-2 border-muted">
      <div className="flex flex-row w-full justify-between items-center space-x-20 px-10">
        <div className="flex flex-col items-center">
          <p className="text-xs font-semibold">Versão</p>
          <p className="text-xs font-semibold">1.0.0</p>
        </div>

        <a className="font-bold text-primary hover:underline" href="/">
          <img
            src="/logo.webp"
            alt="Logo"
            className="h-12"
            style={{
              filter:
                theme === "dark"
                  ? "invert(1) grayscale(1) brightness(2)"
                  : "none"
            }}
          />
        </a>

        <ThemeToggle />
      </div>
    </header>
  );
}
