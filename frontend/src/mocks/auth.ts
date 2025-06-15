import type { LoginResponse, RegisterDoctorRequest, UpdateDoctorRequest } from '../types/user'
import { mockDoctor } from './doctor'

// Mock JWT token (this is just for testing, not a real JWT)
const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sZSI6ImRvY3RvciIsImlhdCI6MTUxNjIzOTAyMn0.mock'
const mockRefreshToken = 'mock.refresh.token'

// Mock successful login response
export const mockLoginResponse: LoginResponse = {
  user: mockDoctor,
  token: mockToken,
  refreshToken: mockRefreshToken
}

// Mock registration request
export const mockRegisterRequest: RegisterDoctorRequest = {
  email: 'dr.new@medstagram.com',
  password: 'Password123!',
  firstName: 'New',
  lastName: 'Doctor',
  specialization: 'Family Medicine',
  licenseNumber: '456789',
  contactNumber: '+63 945 678 9012',
  department: 'Family Medicine',
  title: 'Dr.',
  biography: 'New doctor joining the team.'
}

// Mock update request
export const mockUpdateRequest: UpdateDoctorRequest = {
  firstName: 'Marty',
  lastName: 'Franco',
  contactNumber: '+63 912 345 6789',
  department: 'Internal Medicine',
  title: 'Dr.',
  biography: 'Updated biography with more details about experience and expertise.'
}

// Mock error responses
export const mockAuthErrors = {
  invalidCredentials: {
    status: 401,
    message: 'Invalid email or password'
  },
  emailExists: {
    status: 409,
    message: 'Email already exists'
  },
  invalidToken: {
    status: 401,
    message: 'Invalid or expired token'
  },
  serverError: {
    status: 500,
    message: 'Internal server error'
  }
}

// Mock loading states
export const mockLoadingStates = {
  initial: false,
  loading: true,
  success: false,
  error: null
}

// Mock authentication state
export const mockAuthState = {
  user: mockDoctor,
  token: mockToken,
  refreshToken: mockRefreshToken,
  isAuthenticated: true,
  isLoading: false,
  error: null
} 