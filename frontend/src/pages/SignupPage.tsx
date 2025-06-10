import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Select } from '../components/ui/Select';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  role: z.enum(['doctor', 'nurse', 'admin', 'patient']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;
type Role = SignupFormData['role'];

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const roleValue = watch('role');

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual signup logic
      console.log('Signup data:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Navigate to login page after successful signup
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center pb-8 pt-4">
          <div className="flex items-center justify-center space-x-5">
            <img
              src="/medstagram_small.png"
              alt="Medstagram Logo"
              className="h-12 w-12 rounded-lg"
            />
            <h1 className="text-3xl font-bold text-gray-900">medstagram</h1>
          </div>
        </div>

        <form className="space-y-10" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  {...register('firstName')}
                  className="mt-1 text-sm block w-full px-3 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-gray-500 transition-colors duration-200"
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  {...register('lastName')}
                  className="mt-1 text-sm block w-full px-3 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-gray-500 transition-colors duration-200"
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="mt-1 text-sm block w-full px-3 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-gray-500 transition-colors duration-200"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="mt-1 text-sm block w-full px-3 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-gray-500 transition-colors duration-200"
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                className="mt-1 text-sm block w-full px-3 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-gray-500 transition-colors duration-200"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <div className="mt-1">
                <Select
                  value={roleValue}
                  onChange={(value) => setValue('role', value as Role)}
                  options={[
                    { value: 'doctor', label: 'Doctor' },
                    { value: 'nurse', label: 'Nurse' },
                    { value: 'admin', label: 'Administrator' },
                    { value: 'patient', label: 'Patient' },
                  ]}
                  placeholder="Select your role"
                  error={errors.role?.message}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-medium text-violet-600 hover:text-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 