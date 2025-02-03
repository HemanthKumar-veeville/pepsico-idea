import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axiosInstance from "../api/axios";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginUser } from "../store/slices/authSlice";

// Add type for Google initialization config
interface GoogleInitConfig {
  client_id: string;
  callback: (response: { credential: string }) => void;
}

// Add type for button config
interface GoogleButtonConfig {
  theme: "outline" | "filled_blue" | "filled_black";
  size: "large" | "medium" | "small";
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleInitConfig) => void;
          renderButton: (
            element: HTMLElement,
            config: GoogleButtonConfig
          ) => void;
        };
      };
    };
  }
}

interface GoogleUser {
  sub: string;
  email: string;
  name: string;
}

interface AuthResponse {
  token: string;
  user: {
    google_id: string;
    email: string;
    name: string;
    department_ids?: string[];
  };
}

const GoogleSignIn = () => {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log(isAuthenticated, user);
    if (isAuthenticated && user) {
      const hasDepartments =
        Array.isArray(user.department_ids) && user.department_ids.length > 0;
      navigate(hasDepartments ? "/internal-dashboard" : "/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const initializeGoogle = () => {
      if (!window.google) {
        console.error("Google API not loaded");
        return;
      }

      const config: GoogleInitConfig = {
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      };

      const buttonConfig: GoogleButtonConfig = {
        theme: "outline",
        size: "large",
      };

      window.google.accounts.id.initialize(config);

      const buttonElement = document.getElementById("googleSignInDiv");
      if (!buttonElement) {
        console.error("Google sign-in button element not found");
        return;
      }

      window.google.accounts.id.renderButton(buttonElement, buttonConfig);
    };

    initializeGoogle();
  }, []);

  const handleCredentialResponse = async (response: { credential: string }) => {
    try {
      const decodedUser = jwtDecode<GoogleUser>(response.credential);

      const userData = {
        google_id: decodedUser.sub,
        email: decodedUser.email,
        name: decodedUser.name,
      };

      const { data } = await axiosInstance.post<AuthResponse>(
        "/users",
        userData
      );

      dispatch(loginUser({ token: data.token, user: data.user }));
      toast.success("Successfully signed in!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Authentication failed";
      setError(errorMessage);
      toast.error("Authentication failed");
      console.error("Sign-in error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Sign in to your account
        </h2>
        <div id="googleSignInDiv" className="flex justify-center"></div>
        {error && (
          <p className="text-sm text-center text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default GoogleSignIn;
