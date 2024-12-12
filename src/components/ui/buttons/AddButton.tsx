import React from "react";
import { Plus } from "lucide-react";

interface AddButtonProps {
  title: string;
  onClick: () => void;
  size?: "small" | "medium" | "large";
}

const AddButton: React.FC<AddButtonProps> = ({
  title,
  onClick,
  size = "medium",
}) => {
  const sizeClasses = {
    small: "py-1 px-2 text-sm",
    medium: "py-[6px] px-4 text-sm", // Default size
    large: "py-2 px-6 text-lg",
  };
  return (
    <button
      onClick={onClick}
      className={`min-w-fit inline-flex items-center bg-primary text-white py-1 rounded-lg px-3 hover:bg-primary/90 active:bg-primary border-transparent text-lg font-medium ${sizeClasses[size]}`}
    >
      <Plus
        className={`mr-2 ${
          size === "small"
            ? "w-3 h-3"
            : size === "large"
            ? "w-6 h-6"
            : "w-4 h-4"
        }`}
      />
      {title}
    </button>
  );
};

export default AddButton;
