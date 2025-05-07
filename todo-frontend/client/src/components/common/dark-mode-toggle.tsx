import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Light mode icon (shown in dark mode) */}
      <Sun className="h-5 w-5 text-yellow-300 hidden dark:block" />
      
      {/* Dark mode icon (shown in light mode) */}
      <Moon className="h-5 w-5 text-gray-700 block dark:hidden" />
    </Button>
  );
}
