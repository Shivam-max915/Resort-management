import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuthStore } from '../services/store';
import { useForm } from '../hooks/useForm';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { formData, handleChange, handleSubmit } = useForm(
    { firstName: '', lastName: '', email: '', phone: '', password: '' },
    async (data) => {
      setIsLoading(true);
      try {
        const response = await authService.register(data);
        const { token, user } = response.data;
        
        setAuth(user, token);
        toast.success('Registration successful!');
        navigate('/customer/dashboard');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Registration failed');
      } finally {
        setIsLoading(false);
      }
    }
  );

  const passwordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^a-zA-Z\d]/.test(password)) strength += 1;
    return Math.min(strength, 3);
  };

  const strength = passwordStrength(formData.password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-dark to-secondary flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary bg-opacity-10 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white bg-opacity-5 rounded-full blur-3xl -ml-48 -mb-48"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-white rounded-2xl card-shadow p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4 p-4 bg-primary bg-opacity-10 rounded-xl">
              <span className="text-5xl">🏨</span>
            </div>
            <h1 className="text-4xl font-bold text-dark mb-2">Create Account</h1>
            <p className="text-gray-600">Join us for an amazing stay</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">First Name</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-4 text-gray-400" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition bg-gray-50 font-medium"
                  required
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Last Name</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-4 text-gray-400" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition bg-gray-50 font-medium"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition bg-gray-50 font-medium"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Phone (Optional)</label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-4 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition bg-gray-50 font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 chars, uppercase, lowercase, numbers"
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition bg-gray-50 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2 space-y-2">
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-2 rounded ${
                          i < strength
                            ? 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-gray-600">
                    Password Strength: <span className={strength === 3 ? 'text-green-600' : strength === 2 ? 'text-blue-600' : 'text-yellow-600'}>
                      {strengthLabels[strength]}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Creating Account...' : (
                <>
                  Create Account <FaArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:text-secondary transition">
              Sign in here
            </Link>
          </p>

          {/* Info Box */}
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
            <p className="text-xs font-semibold text-gray-700 flex items-center gap-2">
              <FaCheckCircle className="text-green-500" /> Secure Registration
            </p>
            <p className="text-xs text-gray-600">
              Your data is encrypted and secured with industry-standard protocols
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-300 text-sm mt-8">
          By registering, you agree to our Terms & Conditions
        </p>
      </div>
    </div>
  );
};

export default Register;
