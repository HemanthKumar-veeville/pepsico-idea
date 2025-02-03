interface ScrollArrowProps {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}

export const ScrollArrow = ({
  direction,
  onClick,
  disabled,
}: ScrollArrowProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`absolute ${
      direction === "left" ? "left-0" : "right-0"
    } top-1/2 -translate-y-1/2 
    ${disabled ? "opacity-0" : "opacity-100 hover:bg-indigo-100"} 
    z-10 p-2 rounded-full bg-white shadow-lg transition-all duration-200`}
  >
    <svg
      className={`w-5 h-5 text-indigo-600 ${disabled ? "opacity-50" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
      />
    </svg>
  </button>
);
