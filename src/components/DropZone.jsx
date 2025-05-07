import { useState } from 'react';
import { CameraIcon, CloudUploadIcon } from '@heroicons/react/24/outline';

export function DropZone({ onImageUpload, loading }) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    document.getElementById('fileInput').click();
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
        dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 dark:border-gray-600'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center justify-center space-x-4">
            <CloudUploadIcon className="h-12 w-12 text-gray-400" />
            <CameraIcon className="h-12 w-12 text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
            Drag & Drop or Click to Upload
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Support for JPG, PNG, GIF. Max size: 10MB
          </p>
        </div>
        <input
          type="file"
          id="fileInput"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
