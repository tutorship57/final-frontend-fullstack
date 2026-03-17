import { useState, type FormEvent} from "react";
// ─── Types ───────────────────────────────────────────────────────────────────

interface FormErrors {
  email?: string;
  password?: string;
}

type FocusedField = "email" | "password" | "";

// ─── Sub-components ──────────────────────────────────────────────────────────

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
  </svg>
);

interface EyeIconProps {
  open: boolean;
}

const EyeIcon: React.FC<EyeIconProps> = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const Spinner: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
  </svg>
);

const ErrorIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </svg>
);

// ─── Main component ───────────────────────────────────────────────────────────


export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [focused, setFocused] = useState<FocusedField>("");

  // ── Validation ──────────────────────────────────────────────────────────────

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email";
    if (!password) errs.password = "Password is required";
    else if (password.length < 8) errs.password = "Minimum 8 characters";
    return errs;
  };

    const loginWithGoogle = () => {
        window.location.href = `http://localhost:3000/api/auth/oauth/google`;
    };
  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsLoading(true);
    // Replace with your auth logic (e.g. signIn(email, password))
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleGoogleSSO = (): void => {
    setGoogleLoading(true);
    // Replace with your OAuth redirect (e.g. signInWithGoogle())
    window.location.href = `http://localhost:3000/api/auth/oauth/google`;
    setTimeout(() => setGoogleLoading(false), 2000);
  };

  const clearFieldError = (field: keyof FormErrors): void => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const inputClass = (field: keyof FormErrors): string =>
    [
      "w-full h-11 px-3 text-sm rounded-lg border transition-all duration-150",
      "outline-none bg-white text-gray-900 placeholder-gray-400",
      errors[field]
        ? "border-red-400 focus:ring-2 focus:ring-red-100"
        : focused === field
        ? "border-indigo-400 ring-2 ring-indigo-100"
        : "border-gray-200 hover:border-gray-300",
    ].join(" ");

  const isBusy = isLoading || googleLoading;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">

      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />

      <div className="relative w-full max-w-sm">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">

          {/* Logo + heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 mb-4 shadow-lg shadow-indigo-200">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
          </div>

          {/* Google SSO */}
          <button
            type="button"
            onClick={handleGoogleSSO}
            disabled={isBusy}
            aria-label="Continue with Google"
            className="w-full h-11 flex items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.99] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {googleLoading ? <Spinner className="w-4 h-4 text-gray-400" /> : <GoogleIcon />}
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Email / password form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={inputClass("email")}
              />
              {errors.email && (
                <p id="email-error" role="alert" className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <ErrorIcon />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-medium text-gray-600">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={`${inputClass("password")} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {errors.password && (
                <p id="password-error" role="alert" className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <ErrorIcon />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isBusy}
              className="w-full h-11 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-semibold transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-indigo-200 mt-2"
            >
              {isLoading ? (
                <>
                  <Spinner className="w-4 h-4" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Don&apos;t have an account?{" "}
            <button type="button" className="text-indigo-500 hover:text-indigo-700 font-medium transition-colors">
              Create one
            </button>
          </p>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-gray-400 mt-4">
          By signing in, you agree to our{" "}
          <span className="underline cursor-pointer hover:text-gray-600">Terms</span> and{" "}
          <span className="underline cursor-pointer hover:text-gray-600">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}