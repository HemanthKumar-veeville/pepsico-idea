import { useAppSelector } from "../store/hooks";
import IdeaSubmissionForm from "./IdeaSubmissionForm";

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);

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
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Idea Portal</h1>
              <p className="text-sm text-gray-500">
                Share and track your innovative ideas
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
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Submit New Idea
              </h2>
              <p className="text-gray-500">
                Share your innovative ideas with the team. Be clear and specific
                in your description.
              </p>
            </div>

            <IdeaSubmissionForm />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
