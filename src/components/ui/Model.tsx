import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode; // Content inside the modal
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full'; // Optional size prop
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  // Map size prop to CSS width classes
  const sizeClasses = {
    sm: 'max-w-sm',    // 24rem
    md: 'max-w-md',    // 28rem
    lg: 'max-w-lg',    // 32rem
    xl: 'max-w-xl',    // 36rem
    '2xl': 'max-w-2xl', // 42rem
    '3xl': 'max-w-3xl', // 48rem
    '4xl': 'max-w-4xl', // 64rem
    '5xl': 'max-w-5xl', // 80rem
    '6xl': 'max-w-6xl', // 96rem
    full: 'max-w-full', // 100%
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`bg-white rounded-lg w-full ${sizeClasses[size]} p-6 max-h-[90vh] overflow-auto`}
      >
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black focus:outline-none"
          >
            &#x2715; {/* Close Icon */}
          </button>
        </div>

        {/* Content Section */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
