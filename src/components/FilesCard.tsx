import { useTheme } from "@/context/ThemeContext";
import { X } from "lucide-react";

interface Props {
  fileName: string;
  onDelete: () => void;
}

export function FileCard({ fileName, onDelete }: Props) {
  const { theme } = useTheme();

  return (
    <div
      className={`mt-2 w-2/3 border-2 rounded-lg p-4 ${
        theme === "dark"
          ? "bg-gray-800 border-gray-600"
          : "bg-white border-sky-200"
      }`}
    >
      <div className="flex justify-between items-center">
        <p>{fileName}</p>
        <button
          onClick={onDelete}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );
}
