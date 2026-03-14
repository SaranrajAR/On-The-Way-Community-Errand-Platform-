import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { LoaderIcon } from 'react-hot-toast';
import { Link } from 'react-router';
import { User, Mail, Lock, Phone, UserPlus } from 'lucide-react'; // Added icons

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: ""
  });
  
  const { signup, isSigningUp } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form with data:");
    signup(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="w-full max-w-md space-y-8 bg-base-100 p-8 rounded-2xl shadow-xl">
        
        {/* Header Section */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <UserPlus size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-base-content/60 mt-2">Join our community today</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Full Name</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                <User size={18} />
              </div>
              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                className="input input-bordered w-full pl-10 focus:input-primary transition-all"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Mobile */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Mobile Number</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                <Phone size={18} />
              </div>
              <input
                type="text"
                name="mobile"
                placeholder="+1 234 567 890"
                className="input input-bordered w-full pl-10 focus:input-primary transition-all"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
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
                name="email"
                placeholder="you@example.com"
                className="input input-bordered w-full pl-10 focus:input-primary transition-all"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
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
                name="password"
                placeholder="••••••••"
                className="input input-bordered w-full pl-10 focus:input-primary transition-all"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="btn btn-primary w-full shadow-md"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <div className="flex items-center gap-2">
                  <LoaderIcon className="animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-base-content/60">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;