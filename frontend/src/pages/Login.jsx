import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuthStore } from '../services/store';
import { useForm } from '../hooks/useForm';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { formData, handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    async (data) => {
      setIsLoading(true);
      try {
        const response = await authService.login(data.email, data.password);
        const { token, user } = response.data;
        
        // CRITICAL: Validate role is present before storing
        if (!user || !user.role) {
          toast.error('Invalid user data - missing role');
          return;
        }
        
        setAuth(user, token);
        toast.success('Login successful!');
        
        // CRITICAL: Redirect ONLY after successful login based on role
        if (user.role === 'admin') navigate('/admin/dashboard');
        else if (user.role === 'staff') navigate('/staff/dashboard');
        else navigate('/customer/dashboard');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Login failed');
      } finally {
        setIsLoading(false);
      }
    }
  );

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
            <h1 className="text-4xl font-bold text-dark mb-2">Luxury Resort</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-4 text-gray-400 text-lg" />
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

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-4 text-gray-400 text-lg" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition bg-gray-50 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition text-lg"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Signing in...' : (
                <>
                  Sign In <FaArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-bold hover:text-secondary transition">
              Create one now
            </Link>
          </p>

          {/* Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-4">For demo purposes, try:</p>
            <div className="space-y-2 text-xs text-gray-600 bg-gray-50 p-4 rounded-lg">
              <p><span className="font-semibold">Admin:</span> admin@resort.com</p>
              <p><span className="font-semibold">Customer:</span> guest@email.com</p>
              <p><span className="font-semibold">Password:</span> Test@123</p>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-300 text-sm mt-8">
          Secure login | Session expires on browser close
        </p>
      </div>
    </div>
  );
};

export default Login;
