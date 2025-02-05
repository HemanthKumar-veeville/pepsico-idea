export const FileIcons = {
  PDF: (
    <svg
      className="h-8 w-8 text-red-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  ),
  DOC: (
    <svg
      className="h-8 w-8 text-blue-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  IMAGE: (
    <svg
      className="h-8 w-8 text-purple-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  VIDEO: (
    <svg
      className="h-8 w-8 text-pink-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  ),
  DEFAULT: (
    <svg
      className="h-8 w-8 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
};

export const getFileTypeConfig = (
  file: File
): { icon: JSX.Element; bgColor: string; textColor: string } => {
  if (file.type.startsWith("image/")) {
    return {
      icon: FileIcons.IMAGE,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    };
  }
  if (file.type.startsWith("video/")) {
    return {
      icon: FileIcons.VIDEO,
      bgColor: "bg-pink-50",
      textColor: "text-pink-600",
    };
  }
  if (file.type === "application/pdf") {
    return {
      icon: FileIcons.PDF,
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    };
  }
  if (
    file.type === "application/msword" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return {
      icon: FileIcons.DOC,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    };
  }
  return {
    icon: FileIcons.DEFAULT,
    bgColor: "bg-gray-50",
    textColor: "text-gray-600",
  };
};
