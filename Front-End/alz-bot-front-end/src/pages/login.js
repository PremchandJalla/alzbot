import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Image from 'next/image';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(credentials);
    if (credentials.username === 'patientUser') {
      router.push('/');
    } else if (credentials.username === 'adminUser') {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Introduction */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 p-12 text-white flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-6">Alzheimer's Care Companion</h1>
          <p className="text-xl mb-8">
            Empowering patients and caregivers with intelligent support and monitoring.
          </p>
        </div>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="text-white/80">Always here when you need assistance</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Smart Analytics</h3>
              <p className="text-white/80">Track progress and patterns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
            <p className="mt-2 text-indigo-600">Please sign in to your account</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-900">Username</label>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-900 placeholder-slate-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-900">Password</label>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-900 placeholder-slate-500"
                  required
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
              >
                Sign In
              </button>
            </div>
            <div className="text-center text-sm text-slate-900">
              <p>Demo Credentials:</p>
              <p>Patient: patientUser / patientPass</p>
              <p>Caregiver: adminUser / adminPass</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 