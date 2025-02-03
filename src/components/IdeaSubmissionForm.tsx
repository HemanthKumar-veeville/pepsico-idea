import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { ScrollArrow } from "./ScrollArrow";
import axiosInstance from "../api/axios";

interface IdeaFormData {
  title: string;
  description: string;
  files: File[];
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const steps = [
  {
    id: 1,
    name: "Title",
    description: "Give your idea a clear name",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: 2,
    name: "Description",
    description: "Explain your idea in detail",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h7"
        />
      </svg>
    ),
  },
  {
    id: 3,
    name: "Supporting Files",
    description: "Add relevant files",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
        />
      </svg>
    ),
  },
];

const IdeaSubmissionForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<IdeaFormData>({
    title: "",
    description: "",
    files: [],
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) return;

      const newFiles = Array.from(e.target.files).filter((file) => {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`File ${file.name} is too large. Maximum size is 100MB`);
          return false;
        }
        return true;
      });

      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...newFiles],
      }));
    },
    []
  );

  const removeFile = useCallback((indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToRemove),
    }));
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  const scroll = useCallback((direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 300;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [handleScroll, formData.files]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submissionData = {
        title: formData.title,
        description: formData.description,
        files: formData.files,
      };
      console.log({ submissionData });
      const response = await axiosInstance.post("/ideas", submissionData);
      console.log({ response });
      toast.success("Idea submitted successfully!");
      setFormData({ title: "", description: "", files: [] });
    } catch (error) {
      console.error("Error submitting idea:", error);
      toast.error("Failed to submit idea");
    }
  };

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return formData.title.trim().length > 0;
      case 2:
        return formData.description.trim().length > 0;
      case 3:
        return true; // Files are optional
      default:
        return false;
    }
  }, [currentStep, formData]);

  const handleStepClick = (step: number) => {
    if (step < currentStep || canProceed()) {
      setCurrentStep(step);
    }
  };

  const renderFilePreview = (file: File) => {
    // Image preview
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

    // Video preview
    if (file.type.startsWith("video/")) {
      return (
        <div className="relative w-full h-full">
          <video
            src={URL.createObjectURL(file)}
            className="h-full w-full object-cover rounded"
            controls
          />
        </div>
      );
    }

    // PDF preview
    if (file.type === "application/pdf") {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-red-50 rounded p-2">
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
          <span className="text-xs text-red-600 mt-1">PDF</span>
        </div>
      );
    }

    // Word documents
    if (
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-blue-50 rounded p-2">
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
          <span className="text-xs text-blue-600 mt-1">DOC</span>
        </div>
      );
    }

    // Excel files
    if (
      file.type === "application/vnd.ms-excel" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-green-50 rounded p-2">
          <svg
            className="h-8 w-8 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs text-green-600 mt-1">XLS</span>
        </div>
      );
    }

    // PowerPoint files
    if (
      file.type === "application/vnd.ms-powerpoint" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-orange-50 rounded p-2">
          <svg
            className="h-8 w-8 text-orange-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            />
          </svg>
          <span className="text-xs text-orange-600 mt-1">PPT</span>
        </div>
      );
    }

    // Text files
    if (file.type === "text/plain") {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-gray-50 rounded p-2">
          <svg
            className="h-8 w-8 text-gray-500"
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
          <span className="text-xs text-gray-600 mt-1">TXT</span>
        </div>
      );
    }

    // Default file preview
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-gray-50 rounded p-2">
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
        <span className="text-xs text-gray-500 mt-1">
          {file.type.split("/")[1]?.toUpperCase() || "FILE"}
        </span>
      </div>
    );
  };

  // Replace the existing file preview section with this new version
  const renderFilePreviewSection = () => (
    <div className="relative">
      <ScrollArrow
        direction="left"
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
      />
      <ScrollArrow
        direction="right"
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
      />
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto space-x-4 py-4 px-2 scrollbar-hide relative"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {formData.files.map((file, index) => (
          <div
            key={index}
            className="flex-none relative w-48 h-48 group border rounded-xl hover:border-indigo-500 transition-all duration-200 hover:shadow-md bg-white"
          >
            <div className="h-full w-full p-3">
              {renderFilePreview(file)}
              <p className="text-sm text-gray-600 truncate mt-2">{file.name}</p>
            </div>
            <button
              type="button"
              onClick={() => removeFile(index)}
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
        ))}

        {/* Upload button at the end of the row */}
        <div className="flex-none w-48 h-48">
          <label className="h-full w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 transition-colors cursor-pointer bg-white">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="sr-only"
                />
                <span className="relative text-indigo-600 hover:text-indigo-500">
                  Upload files
                </span>
              </div>
              <p className="text-xs text-gray-500">Up to 100MB</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderStepper = () => (
    <nav aria-label="Progress" className="mb-12">
      <ol className="flex items-center justify-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={`${
              stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : ""
            } relative`}
          >
            <div className="flex flex-col items-center group">
              <button
                onClick={() => handleStepClick(step.id)}
                className={`${
                  step.id === currentStep
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : step.id < currentStep
                    ? "border-indigo-600 bg-white text-indigo-600"
                    : "border-gray-300 bg-white text-gray-500"
                } h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  (step.id < currentStep || canProceed()) &&
                  "hover:scale-110 cursor-pointer hover:shadow-md"
                }`}
              >
                {step.id < currentStep ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  step.icon
                )}
              </button>
              <div
                className={`text-sm font-medium mt-3 ${
                  step.id === currentStep ? "text-indigo-600" : "text-gray-500"
                } group-hover:text-indigo-600 transition-colors`}
              >
                {step.name}
              </div>
              <div className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">
                {step.description}
              </div>
            </div>
            {stepIdx !== steps.length - 1 && (
              <div
                className={`absolute top-5 h-0.5 w-[calc(100%-2rem)] ml-24 ${
                  step.id < currentStep ? "bg-indigo-600" : "bg-gray-300"
                } transition-colors`}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-indigo-200 transition-colors duration-200">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors text-base px-4 py-3"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter a clear and descriptive title"
            />
            <p className="mt-2 text-sm text-gray-500">
              A good title should be concise and descriptive
            </p>
          </div>
        );
      case 2:
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-indigo-200 transition-colors duration-200">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              required
              className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors text-base px-4 py-3"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your idea in detail..."
            />
          </div>
        );
      case 3:
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-indigo-200 transition-colors duration-200">
            {renderFilePreviewSection()}
          </div>
        );
      default:
        return null;
    }
  };

  const renderNavigation = () => (
    <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
      {currentStep > 1 && (
        <button
          type="button"
          onClick={() => setCurrentStep((prev) => prev - 1)}
          className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      )}
      {currentStep < steps.length ? (
        <button
          type="button"
          onClick={() => setCurrentStep((prev) => prev + 1)}
          disabled={!canProceed()}
          className={`ml-auto flex items-center px-6 py-3 rounded-lg text-base font-medium text-white ${
            canProceed()
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-300 cursor-not-allowed"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200`}
        >
          Continue
          <svg
            className="w-5 h-5 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      ) : (
        <button
          type="submit"
          className="ml-auto flex items-center px-8 py-3 rounded-lg text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02]"
        >
          Submit Idea
          <svg
            className="w-5 h-5 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {renderStepper()}
      {renderCurrentStep()}
      {renderNavigation()}
    </form>
  );
};

export default IdeaSubmissionForm;
