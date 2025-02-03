import { memo } from "react";
import { getFileTypeConfig } from "./FileIcons";

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

export const FilePreview = memo(({ file, onRemove }: FilePreviewProps) => {
  const { icon, bgColor, textColor } = getFileTypeConfig(file);

  const renderPreview = () => {
    if (file.type.startsWith("image/")) {
      return (
        <div className="relative w-full h-full">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="h-full w-full object-cover rounded"
          />
        </div>
      );
    }

    return (
      <div
        className={`flex flex-col items-center justify-center h-full w-full ${bgColor} rounded p-2`}
      >
        {icon}
        <span className={`text-xs ${textColor} mt-1`}>
          {file.type.split("/")[1]?.toUpperCase() || "FILE"}
        </span>
      </div>
    );
  };

  return (
    <div className="flex-none relative w-48 h-48 group border rounded-xl hover:border-indigo-500 transition-all duration-200 hover:shadow-md bg-white">
      <div className="h-full w-full p-3">
        {renderPreview()}
        <p className="text-sm text-gray-600 truncate mt-2">{file.name}</p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50"
      >
        <svg
          className="h-4 w-4 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
});
