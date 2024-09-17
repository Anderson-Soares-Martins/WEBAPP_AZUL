import React, { useRef, useState } from "react";

type Props = {
  onUpload: (files: File[]) => void;
};

export function DragAndDrop({ onUpload }: Props) {
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <div
      className={`flex justify-center items-center w-2/3 h-48 border-2 border-dashed rounded-lg p-5 transition-colors duration-300 ${
        isDragActive ? "bg-sky-50 border-sky-400" : "border-gray-300"
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        multiple
      />
      <p
        className={`text-sm transition-colors duration-300 ${
          isDragActive ? "text-sky-800" : "text-gray-400"
        }`}
      >
        {isDragActive
          ? "Solte o arquivo aqui"
          : "Arraste e solte o arquivo aqui ou clique para selecionar"}
      </p>
    </div>
  );
}
