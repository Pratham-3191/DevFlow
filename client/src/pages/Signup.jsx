import { ArrowLeft, User, Mail, Lock, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';

function Signup() {
    const setAuth = useAuthStore((state) => state.setAuth)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{8,}$/;
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        signup: ''
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
        !checked ||
        !formData.name ||
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

            if (emailErr || passErr) return;

            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/sign-up`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            let data = await res.json();
            if (!res.ok) {
                toast.error(data.message);
                return;
            }

            setAuth(data.user, data.accessToken, data.refreshToken);
            toast.success(data.message);
            console.log(data)
        } catch (error) {
            toast.error("Something went wrong!");
            setErrors({ signup: error })
        }
    }

    return (
        <div className=' flex flex-row'>
            {/* left-side */}
            <div className='h-screen w-full bg-gray-50 
            flex flex-col items-center justify-center'>
                <div className=' flex flex-col items-start gap-7 md:w-2/3 w-10/12'>
                    <Link to={'/'}>
                        <button className='flex flex-row items-center gap-2 text-gray-600 cursor-pointer'>
                            <ArrowLeft className='h-4 w-4' />
                            <span>Back to Home</span>
                        </button>
                    </Link>
                    <div>
                        <h1 className='text-2xl font-semibold'>Create Your Account</h1>
                        <p className='mt-3 text-gray-600'>Join thousands of developers already using DevPortal</p>
                    </div>
                    <form className='flex flex-col w-full space-y-6' onSubmit={(e) => handleSubmit(e)}>
                        <div className='relative'>
                            <label className='mb-1 block' htmlFor="name">Full Name</label>
                            <input className=' pl-10 border border-gray-300 outline-none rounded-md py-2 px-2 w-full'
                                onChange={(e) => setFormData((data) => ({ ...data, name: e.target.value }))}
                                type="text" placeholder='John Doe' />
                            <User className='text-gray-400 absolute bottom-2.5 left-3 h-5 w-5' />
                        </div>
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
                                    type="password" placeholder='Min. 8 Characters' />
                                <Lock className='text-gray-400 absolute bottom-2.5 left-3 h-5 w-5' />
                            </div>
                            {errors && (
                                <p className='text-red-500 mt-1'>{errors.password}</p>
                            )}
                        </div>
                        <div className='text-center sm:text-start'>
                            <input className='h-4 w-4' type="checkbox" checked={checked}
                                onChange={(e) => setChecked(e.target.checked)} />
                            <span className='ml-3'>I agree to the Terms of Service and Privacy Policy</span>
                        </div>
                        <div className='text-red-500 flex flex-col '>{errors.signup}
                            <button type='submit'
                                disabled={isFormInvalid}
                                className={` ${isFormInvalid && 'opacity-70'} bg-linear-to-br from-blue-600 to-purple-600 py-3 text-white rounded-xl cursor-pointer`}>
                                Create Account
                            </button>
                        </div>
                        <p className='text-center text-gray-600'>Already have an account?
                            <Link to={'/sign-in'}>
                                <span className='text-blue-600 hover:text-blue-700 cursor-pointer'> Sign In</span>
                            </Link></p>
                    </form>
                </div>
            </div>


            {/* right-side */}
            <div className='text-white text-center h-screen w-full hidden
             bg-linear-to-br from-blue-600 to-purple-600 lg:grid place-items-center'>
                <div className='w-2/3'>
                    <h1 className='text-xl mb-5 font-semibold'>Welcome to the Future of Development</h1>
                    <p className='text-blue-100'>
                        Join our community of developers and start building amazing products today.</p>
                    <div className='flex flex-wrap justify-center gap-5 mt-10'>
                        <div className='bg-white/10 backdrop-blur-sm py-4 px-12 rounded-2xl'>
                            <p>50K+</p>
                            <p>Users</p>
                        </div>
                        <div className='bg-white/10 backdrop-blur-sm py-4 px-12 rounded-2xl'>
                            <p>100K+</p>
                            <p>Projects</p>
                        </div>
                        <div className='bg-white/10 backdrop-blur-sm py-4 px-12 rounded-2xl'>
                            <p>99.9%</p>
                            <p>Uptime</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup