import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { validateLoginForm } from "@/utils/loginValidation";
import LoginFormFields from "./LoginForm/LoginFormFields";
import { authenticateUser, getCurrentIpAddress, getIPLocation } from "@/services/loginService";
import { authenticateWithGoogle } from "@/services/googleAuthService";

// Shadcn UI Components for the new Reset Logic
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

const LoginFormComponent: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // NEW Reset States from Salesforce logic
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);
  const [forgotResult, setForgotResult] = useState<{
    status: "success" | "not_found" | "error";
    message: string;
  } | null>(null);

  const [ipVerificationSent, setIpVerificationSent] = useState(false);
  const [locationInfo, setLocationInfo] = useState<{ country: string; city: string } | null>(null);
  const [autoLoginProcessed, setAutoLoginProcessed] = useState(false);

  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [searchParams] = useSearchParams();

  // Auto-login functionality (FULLY RESTORED LOGS)
  useEffect(() => {
    console.log("=== LoginFormComponent useEffect START ===");
    console.log("Current pathname:", window.location.pathname);
    console.log("Current search:", window.location.search);
    console.log("User already logged in:", !!user);
    console.log("Auto-login already processed:", autoLoginProcessed);

    if (autoLoginProcessed || user) {
      console.log("Skipping auto-login - already processed or user logged in");
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const urlEmail = urlParams.get("user");
    const urlPassword = urlParams.get("pass");
    const urlContent = urlParams.get("content");

    console.log("URL Email parameter:", urlEmail);
    console.log("URL Password parameter exists:", !!urlPassword);
    console.log("URL Password length:", urlPassword ? urlPassword.length : 0);
    console.log("URL Content parameter:", urlContent);
    console.log("Full URL:", window.location.href);

    if (urlEmail && urlPassword) {
      console.log("=== AUTO-LOGIN CREDENTIALS DETECTED ===");
      console.log("Email:", urlEmail);
      console.log("Password length:", urlPassword.length);
      console.log("Content destination:", urlContent);

      setAutoLoginProcessed(true);
      setEmail(urlEmail);
      setPassword(urlPassword);

      const getRedirectPath = (content: string | null): string => {
        switch (content) {
          case "updates":
            return "/updates";
          case "documents":
            return "/documents";
          case "dashboard":
            return "/dashboard";
          default:
            return "/dashboard";
        }
      };

      const redirectPath = getRedirectPath(urlContent);
      console.log("Determined redirect path:", redirectPath);

      const newUrl = window.location.pathname;
      console.log("Clearing URL params, new URL will be:", newUrl);
      window.history.replaceState({}, "", newUrl);

      console.log("Starting performAutoLogin with redirect path:", redirectPath);
      performAutoLogin(urlEmail, urlPassword, redirectPath);
    } else {
      console.log("No auto-login credentials found in URL");
      setAutoLoginProcessed(true);
    }

    console.log("=== LoginFormComponent useEffect END ===");
  }, []);

  const performAutoLogin = async (email: string, password: string, redirectPath: string = "/dashboard") => {
    console.log("=== performAutoLogin STARTED ===");
    console.log("Email:", email);
    console.log("Password length:", password.length);
    console.log("Redirect path:", redirectPath);
    console.log("Current user state:", user);

    setIsLoading(true);
    setIpVerificationSent(false);
    setLocationInfo(null);

    try {
      console.log("Calling authenticateUser...");
      const userData = await authenticateUser(email, password);
      console.log("authenticateUser returned:", userData);

      if (userData) {
        console.log("=== AUTO-LOGIN SUCCESS ===");
        console.log("Setting user data:", userData);
        setUser(userData);

        console.log("Showing success toast...");
        toast.success("Auto-login successful! Welcome back.", {
          duration: 3000,
          position: "top-center",
        });

        console.log("Navigating to:", redirectPath);
        navigate(redirectPath, { replace: true });
        console.log("Auto-login process completed successfully");
      } else {
        console.log("=== AUTO-LOGIN FAILED - authenticateUser returned null ===");
        try {
          console.log("Getting IP for verification message...");
          const ip = await getCurrentIpAddress();
          console.log("Current IP:", ip);

          if (ip) {
            const location = await getIPLocation(ip);
            console.log("Location data:", location);
            setIpVerificationSent(true);
            setLocationInfo(location);
            toast.warning("Auto-login failed - IP verification required. Please check your email.", {
              duration: 5000,
              position: "top-center",
            });
          } else {
            toast.error("Auto-login failed. Please enter your credentials manually.", {
              duration: 5000,
              position: "top-center",
            });
          }
        } catch (locationError) {
          console.error("Failed to get location info:", locationError);
          toast.error("Auto-login failed. Please enter your credentials manually.", {
            duration: 5000,
            position: "top-center",
          });
        }
      }
    } catch (error) {
      console.error("=== AUTO-LOGIN ERROR ===", error);
      toast.error("Auto-login failed. Please enter your credentials manually.", {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
      console.log("=== performAutoLogin COMPLETED ===");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, errors } = validateLoginForm(email, password);

    if (!isValid) {
      setErrors(errors);
      toast.error("Please correct the errors in the form");
      return;
    }

    setIsLoading(true);
    setIpVerificationSent(false);
    setLocationInfo(null);

    try {
      const ip = await getCurrentIpAddress();
      const location = await getIPLocation(ip);
      const userData = await authenticateUser(email, password);

      if (userData) {
        setUser(userData);
        toast.success("Login successful");
        navigate("/dashboard");
      } else {
        if (email && password.length >= 6) {
          setIpVerificationSent(true);
          setLocationInfo(location);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setIpVerificationSent(false);
    setLocationInfo(null);
    try {
      const userData = await authenticateWithGoogle();
      if (userData) {
        setUser(userData);
        toast.success("Google login successful");
        navigate("/dashboard");
      } else {
        try {
          const ip = await getCurrentIpAddress();
          const location = await getIPLocation(ip);
          setIpVerificationSent(true);
          setLocationInfo(location);
        } catch (error) {
          console.error("Failed to get location information:", error);
          toast.error("Authentication failed. Please try logging in with your email and password.");
        }
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      // RESTORED: Helpful error messages from your original snippet
      if (error.message && error.message.includes("Authorization Error")) {
        toast.error(
          "Google authentication failed. The OAuth client configuration may be incorrect or your account was not approved.",
        );
      } else if (error.message && error.message.includes("popup_closed")) {
        toast.error("Google login was canceled. Please try again.");
      } else if (error.message && error.message.includes("Email not found")) {
        toast.error(
          "Your Google account email is not registered as an approved investor. Please contact us for access.",
        );
      } else {
        toast.error(`Google login failed: ${error.message || "Unknown error"}`);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Restored: Password Reset function using Salesforce API logic
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsForgotSubmitting(true);
    setForgotResult(null);

    try {
      const response = await fetch(
        "https://worldmotoclash.my.salesforce-sites.com/callforracers/services/apexrest/userLookup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: forgotEmail.trim(),
            source: "investor_portal",
          }),
        },
      );

      const responseData = await response.json();

      if (responseData.status === "SUCCESS") {
        setForgotResult({ status: "success", message: responseData.message });
      } else if (responseData.status === "NOT_FOUND" || responseData.investor == null) {
        setForgotResult({ status: "not_found", message: responseData.message });
      } else {
        setForgotResult({
          status: "error",
          message: responseData.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setForgotResult({ status: "error", message: "Unable to connect to the server. Please try again later." });
    } finally {
      setIsForgotSubmitting(false);
    }
  };

  console.log(
    "Rendering LoginFormComponent. User:",
    user,
    "Loading:",
    isLoading,
    "Auto-processed:",
    autoLoginProcessed,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Investor Portal</h2>
        <p className="text-gray-600">Sign in to access exclusive investment materials</p>
      </div>

      {ipVerificationSent ? (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-amber-800 mb-2">Location Verification Required</h3>
          <p className="text-amber-700 text-sm">
            We detected a login attempt from a new location
            {locationInfo && locationInfo.city !== "Unknown" ? ` (${locationInfo.city}, ${locationInfo.country})` : ""}.
            For your security, we've sent a verification email to your registered email address with details about the
            new location. Please check your inbox and follow the verification instructions.
          </p>
        </div>
      ) : null}

      <LoginFormFields
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        errors={errors}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onForgotPassword={() => setForgotPasswordOpen(true)}
        onGoogleSignIn={handleGoogleSignIn}
        isGoogleLoading={isGoogleLoading}
      />

      <div className="mt-8 text-center text-sm text-gray-600">
        <p>
          Don't have access?{" "}
          <a href="/#contact" className="text-black font-medium hover:underline">
            Contact us
          </a>{" "}
          to request investor credentials.
        </p>
      </div>

      {/* NEW Inline Dialog logic for Resetting Password */}
      <Dialog
        open={forgotPasswordOpen}
        onOpenChange={(open) => {
          setForgotPasswordOpen(open);
          if (!open) {
            setForgotEmail("");
            setForgotResult(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          {forgotResult?.status === "success" ? (
            <div className="text-center space-y-4 py-4">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="text-lg font-semibold">Check Your Email</h3>
              <p className="text-sm text-muted-foreground">{forgotResult.message}</p>
              <p className="text-xs text-muted-foreground">
                Please check your spam folder if you don't see the email within a few minutes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="name@company.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                disabled={isForgotSubmitting}
                required
              />
              {forgotResult && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <p>{forgotResult.message}</p>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isForgotSubmitting}>
                {isForgotSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Reset Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default LoginFormComponent;
