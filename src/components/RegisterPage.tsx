import { useState, type FormEvent, type JSX } from "react";
import { apiFetch } from "./utils/api";
import { useNavigate } from "react-router-dom";

const ErrorIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </svg>
);

// --- Types ---
interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
}

export default function RegisterPage(): JSX.Element {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // OWASP Strength Logic
  const getStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 15) score++;
    if (pass.length >= 20) score++;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++; //have number and Big Letter
    if (/[^A-Za-z0-9]/.test(pass)) score++; // special
    return score;
  };

  const requirements = [
    {
      label: "15-64 characters",
      met: formData.password.length >= 15 && formData.password.length <= 64,
    },
    {
      label: "Includes symbols or spaces",
      met:
        /[^A-Za-z0-9]/.test(formData.password) || /\s/.test(formData.password),
    },
    {
      label: "Big letter and number",
      met:
        (/[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password)) ||
        /\s/.test(formData.password),
    },
  ];

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!formData.name) errs.name = "Name is required";
    if (!formData.email.match(/\S+@\S+\.\S+/)) errs.email = "Invalid email";
    if (formData.password.length < 8) errs.password = "Password too short";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (formData.password !== formData.confirmPassword) {
    setErrors({ general: "Passwords must match" });
    return;
  }

    setIsLoading(true);
    try {
        const { confirmPassword, ...payload } = formData;
      const res = await apiFetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) throw new Error("Email already exists");
      if (!res.ok) throw new Error("Registration failed");

      window.location.href = "/login"; // Redirect on success
    } catch (err: any) {
      setErrors({ general: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Full Name
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg outline-indigo-500"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full p-3 border rounded-lg outline-indigo-500"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg outline-indigo-500"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            {/* OWASP Policy UI */}
            <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="space-y-2">
                {requirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div
                      className={`w-2 h-2 rounded-full ${req.met ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    <span
                      className={req.met ? "text-green-700" : "text-gray-500"}
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex gap-1 h-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-full flex-1 rounded-full ${i < getStrength(formData.password) ? "bg-green-500" : "bg-gray-200"}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Password Confirmation
              </label>
              <input
                type="password" // Corrected from "email"
                className="w-full p-3 border rounded-lg outline-indigo-500"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>

            {formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <ErrorIcon /> {/* Use your existing ErrorIcon component */}
                  Passwords do not match
                </p>
              )}

            {formData.confirmPassword &&
              formData.password === formData.confirmPassword && (
                <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
                  ✓ Passwords match
                </p>
              )}
          </div>

          {errors.general && (
            <p className="text-red-500 text-xs">{errors.general}</p>
          )}

          <button
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all"
          >
            {isLoading ? "Creating Account..." : "Register"}
          </button>
          <p className="text-center text-xs text-gray-400 mt-6">
            Already have account?{" "}
            <button
              type="button"
              className="text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
