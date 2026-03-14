import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { LoaderIcon } from 'react-hot-toast';
import { Link } from 'react-router';
import { Mail, Lock, LogIn } from 'lucide-react'; // Added icons for a professional look

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore(); // Renamed isSigningUp to isLoggingIn if applicable, but kept logic

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="w-full max-w-md space-y-8 bg-base-100 p-8 rounded-2xl shadow-xl">
        
        {/* Header Section */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <LogIn size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-base-content/60 mt-2">Please enter your details to login</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email Address</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full pl-10 focus:input-primary transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full pl-10 focus:input-primary transition-all"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full shadow-lg"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <div className="flex items-center gap-2">
                <LoaderIcon className="animate-spin" />
                <span>Logging in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer Section */}
        <div className="text-center">
          <p className="text-base-content/60">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="link link-primary font-medium">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;