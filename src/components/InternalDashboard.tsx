import { useAppSelector } from "../store/hooks";
import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../api/axios";

interface Idea {
  id: string;
  user_id: string;
  title: string;
  description: string;
  supporting_documents: string[];
  content: string | null;
  submission_date: string;
  status: string;
  department_id: string;
  department_name: string;
  validation_result: string | null;
  createdAt: string;
  updatedAt: string;
  UserId: string | null;
  DepartmentId: string | null;
  User: null;
  Department: null;
}

interface ApiResponse {
  success: boolean;
  data: Idea[];
}

const InternalDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDepartments, setOpenDepartments] = useState<Set<string>>(
    new Set(["Others"])
  );

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await axiosInstance.get<ApiResponse>("/ideas");
        setIdeas(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching ideas:", err);
        setError("Failed to load ideas. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  // Group ideas by department
  const groupedIdeas = useMemo(() => {
    return ideas.reduce((acc, idea) => {
      const dept = idea.department_name || "Uncategorized";
      if (!acc[dept]) {
        acc[dept] = [];
      }
      acc[dept].push(idea);
      return acc;
    }, {} as Record<string, Idea[]>);
  }, [ideas]);

  const toggleDepartment = (department: string) => {
    setOpenDepartments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(department)) {
        newSet.delete(department);
      } else {
        newSet.add(department);
      }
      return newSet;
    });
  };

  const getStatusBadgeClass = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status.toLowerCase()) {
      case "approved":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Section */}
        <header className="flex justify-between items-center bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Internal Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Manage and review department ideas
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm text-gray-500">Welcome back</p>
              <h2 className="text-lg font-semibold text-gray-900">
                {user?.name}
              </h2>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="bg-white backdrop-blur-lg rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Department Overview
              </h2>
              <p className="text-gray-500">Ideas organized by department</p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading ideas...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 rounded-lg p-6 text-center">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Ideas List */}
            {!loading && !error && Object.keys(groupedIdeas).length === 0 && (
              <div className="bg-indigo-50 rounded-lg p-6 text-center">
                <p className="text-indigo-600">
                  No ideas have been submitted yet.
                </p>
              </div>
            )}

            {!loading && !error && Object.keys(groupedIdeas).length > 0 && (
              <div className="space-y-4">
                {Object.entries(groupedIdeas).map(
                  ([department, departmentIdeas]) => (
                    <div
                      key={department}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleDepartment(department)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-all duration-300 ease-in-out"
                      >
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {department}
                          </h3>
                          <span className="px-2 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full">
                            {departmentIdeas.length}{" "}
                            {departmentIdeas.length === 1 ? "idea" : "ideas"}
                          </span>
                        </div>
                        <svg
                          className={`w-5 h-5 transform transition-transform duration-300 ease-in-out ${
                            openDepartments.has(department) ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          openDepartments.has(department)
                            ? "max-h-[2000px] opacity-100"
                            : "max-h-0 opacity-0"
                        } overflow-hidden`}
                      >
                        <div className="divide-y divide-gray-200">
                          {departmentIdeas.map((idea) => (
                            <div
                              key={idea.id}
                              className="p-6 hover:bg-gray-50 transition-all duration-300 ease-in-out"
                            >
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="text-lg font-semibold text-gray-900 transition-colors duration-300">
                                    {idea.title}
                                  </h4>
                                  <div className="flex items-center space-x-4 mt-1">
                                    <span className="text-sm text-gray-500">
                                      Submitted on{" "}
                                      {formatDate(idea.submission_date)}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      ID: {idea.user_id.slice(0, 8)}...
                                    </span>
                                  </div>
                                </div>
                                <span
                                  className={`${getStatusBadgeClass(
                                    idea.status
                                  )} transition-all duration-300 ease-in-out transform hover:scale-105`}
                                >
                                  {idea.status}
                                </span>
                              </div>

                              <p className="text-gray-600 mb-4">
                                {idea.description || "No description provided"}
                              </p>

                              {idea.supporting_documents.length > 0 && (
                                <div className="mt-4 transition-opacity duration-300 ease-in-out">
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                                    Supporting Documents:
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {idea.supporting_documents.map(
                                      (doc, index) => (
                                        <a
                                          key={index}
                                          href={doc}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                                        >
                                          <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                            />
                                          </svg>
                                          <span>Document {index + 1}</span>
                                        </a>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                              <div className="mt-4 text-sm text-gray-500">
                                <p>
                                  Last updated: {formatDate(idea.updatedAt)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default InternalDashboard;
