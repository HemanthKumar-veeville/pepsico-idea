import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { store } from "./store/store";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchCurrentUser } from "./store/slices/authSlice";
import GoogleSignIn from "./components/GoogleSignIn";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/Dashboard";
import InternalDashboard from "./components/InternalDashboard";
import AdminRoute from "./components/AdminRoute";
// Import your Dashboard component here

function AppContent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Only fetch user data if we have a token and are not already authenticated
    const token = localStorage.getItem("token");
    if (token && !isAuthenticated) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<GoogleSignIn />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/internal-dashboard"
          element={
            <PrivateRoute>
              <AdminRoute>
                <InternalDashboard />
              </AdminRoute>
            </PrivateRoute>
          }
        />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
