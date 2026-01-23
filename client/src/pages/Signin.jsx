import { ArrowLeft, Lock, Mail, User } from 'lucide-react'
import { useState } from 'react';
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';

function SignIn() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^.{8,}$/;
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    login: ""
  });

  const validateEmail = (email) => {
    if (!emailRegex.test(email)) {
      return "Invalid email address";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!passwordRegex.test(password)) {
      return "Password must be at least 8 characters long";
    }
    return "";
  };
  const [checked, setChecked] = useState(false);
  const isFormInvalid =
    !formData.email ||
    !formData.password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const emailErr = validateEmail(formData.email);
      const passErr = validatePassword(formData.password);

      setErrors({
        email: emailErr,
        password: passErr,
      });

      if (passErr || emailErr) return;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/sign-in`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      )
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success(data.message);

      console.log(data)

      if (emailErr || passErr) return;
      console.log(formData)
    } catch (error) {
      setErrors({ login: error })
      toast.error('someting went wrong');
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden -z-10 flex flex-col items-center justify-center">

      {/* Grid Background – works with Tailwind v4 */}
      <div
        className="absolute inset-0
      bg-[linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)]
      bg-size-[50px_50px]"
      />

      {/* Top Right Blob */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br 
    from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />

      {/* Bottom Left Blob */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-tr 
    from-purple-500/20 to-blue-500/20 rounded-full blur-3xl" />
      {/* Back Button (OUTSIDE the card) */}
      <div className="absolute top-6 left-6 z-20">
        <Link to="/">
          <button className="flex items-center gap-2 text-gray-700 hover:text-black transition">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </button>
        </Link>
      </div>



      <div className="relative z-20 bg-white  border border-gray-300
       shadow-xl rounded-2xl p-5 xl:w-[30%] md:w-[40%] sm:w-[80%] w-[90%]">
        <div className='text-center mb-7'>
          <div className="inline-flex w-12 h-12 rounded-xl bg-linear-to-br from-blue-600 to-purple-600 mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
        </div>
        <form className='flex flex-col w-full space-y-4 px-3' onSubmit={(e) => handleSubmit(e)}>
          <div>
            <div className='relative'>
              <label className='mb-1 block' htmlFor="email">Email Address</label>
              <input className='pl-10 border border-gray-300 outline-none rounded-md py-2 px-2 w-full' type="text" placeholder='you@example.com'
                onChange={(e) => setFormData((data) => ({ ...data, email: e.target.value }))} />
              <Mail className='text-gray-400 absolute bottom-2.5 left-3 h-5 w-5' />
            </div>
            {errors.email && (
              <p className="text-red-500 mt-1">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <div className='relative'>
              <label className='mb-1 block' htmlFor="password">Password</label>
              <input className='pl-10 border border-gray-300 outline-none rounded-md py-2 px-2 w-full'
                onChange={(e) => setFormData((data) => ({ ...data, password: e.target.value }))}
                type="password" placeholder='Enter your password' />
              <Lock className='text-gray-400 absolute bottom-2.5 left-3 h-5 w-5' />
            </div>
            {errors && (
              <p className='text-red-500 mt-1'>{errors.password}</p>
            )}
            <div className='flex justify-end text-blue-600 font-semibold cursor-pointer'>
              Forget Password?
            </div>
          </div>
          <div className='text-center sm:text-start'>
            <input className='h-4 w-4' type="checkbox" checked={checked}
              onChange={(e) => setChecked(e.target.checked)} />
            <span className='ml-3'>Remember me for 30 days</span>
          </div>

          <div className="w-full">
            {/* Submit Button */}
            <p className='text-red-500'>{errors.login}</p>
            <button
              type="submit"
              disabled={isFormInvalid}
              className={`${isFormInvalid && 'opacity-70'} 
              bg-linear-to-br from-blue-600 to-purple-600 
              py-3 text-white rounded-xl cursor-pointer w-full`}>
              Sign In
            </button>

            {/* Separator */}
            <div className='flex flex-col items-center'>
              <div className="flex items-center gap-2 w-full mt-4">
                <div className="bg-gray-200 h-px flex-1" />
                <p className="text-gray-500">Or continue with</p>
                <div className="bg-gray-200 h-px flex-1" />
              </div>
              <button className=" mt-6 flex flex-1 w-1/2 items-center justify-center gap-2 px-4 py-2.5 
              border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                type='button'>

                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>

                <span className="text-gray-700">Google</span>
              </button>
            </div>

          </div>

          <p className='text-center text-gray-600'>Don't have an account?
            <Link to={'/sign-up'}>
              <span className='text-blue-600 hover:text-blue-700 cursor-pointer font-semibold'> Sign Up</span>
            </Link></p>
        </form>
      </div>
    </div>
  )
}

export default SignIn