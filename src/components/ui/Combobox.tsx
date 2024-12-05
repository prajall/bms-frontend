import React, { useState } from 'react';

interface ComboBoxProps {
  id: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  noOptionsText?: string;
}

const ComboBox: React.FC<ComboBoxProps> = ({
  id,
  options,
  value,
  onChange,
  placeholder = "Type or select an option",
  noOptionsText = "No options available",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(0); // Reset highlighted index when typing
  };

  const handleOptionClick = (optionValue: string) => {
    setInputValue(optionValue);
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (filteredOptions[highlightedIndex]) {
        handleOptionClick(filteredOptions[highlightedIndex].value);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        id={id}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul
          className="absolute left-0 right-0 mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-lg shadow-lg z-10"
        >
          {filteredOptions.map((option, index) => (
            <li
              key={option.value}
              className={`px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-200 ${
                index === highlightedIndex ? "bg-gray-300" : ""
              }`}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {isOpen && filteredOptions.length === 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <li className="px-4 py-2 text-gray-400">{noOptionsText}</li>
        </ul>
      )}
    </div>
  );
};

export default ComboBox;
