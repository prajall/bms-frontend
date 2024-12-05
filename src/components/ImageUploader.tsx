import React, { useState } from "react";
import imageCompression from "browser-image-compression";

interface ImageUploaderProps {
  onImageUpload: (image: File) => void;
  onRemove: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, onRemove }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Compress and convert image to WebP
      const compressedBlob = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 200,
        useWebWorker: true,
      });

      const webpImage = new File([compressedBlob], `${Date.now()}.webp`, {
        type: "image/webp",
      });

      setPreviewImage(URL.createObjectURL(webpImage));
      onImageUpload(webpImage);
    }
  };

  return (
    <div className="mb-4">
      {previewImage ? (
        <div className="relative">
          <img src={previewImage} alt="Preview" className="w-20 h-20 rounded object-cover" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
          >
            &times;
          </button>
        </div>
      ) : (
        <>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
          />
        </>
      )}
    </div>
  );
};

export default ImageUploader;
