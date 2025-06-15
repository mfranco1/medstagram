import type { LoginResponse, RegisterDoctorRequest, UpdateDoctorRequest } from '../types/user'
import { mockDoctor, mockDoctors } from './doctor'
import { mockLoginResponse, mockAuthErrors, mockLoadingStates } from './auth'

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API responses
export const mockApiResponses = {
  login: {
    success: mockLoginResponse,
    error: mockAuthErrors.invalidCredentials
  },
  register: {
    success: { message: 'Registration successful' },
    error: mockAuthErrors.emailExists
  },
  updateProfile: {
    success: { message: 'Profile updated successfully' },
    error: mockAuthErrors.serverError
  }
}

// Mock API handlers
export const mockApi = {
  // Login
  login: async (email: string, password: string): Promise<LoginResponse> => {
    await delay(1000) // Simulate network delay
    
    if (email === mockDoctor.email && password === 'Password123!') {
      return mockLoginResponse
    }
    
    throw mockAuthErrors.invalidCredentials
  },

  // Register
  register: async (data: RegisterDoctorRequest): Promise<{ message: string }> => {
    await delay(1000)
    
    if (mockDoctors.some(doctor => doctor.email === data.email)) {
      throw mockAuthErrors.emailExists
    }
    
    return { message: 'Registration successful' }
  },

  // Update Profile
  updateProfile: async (data: UpdateDoctorRequest): Promise<{ message: string }> => {
    await delay(1000)
    
    // Simulate random server error (10% chance)
    if (Math.random() < 0.1) {
      throw mockAuthErrors.serverError
    }
    
    return { message: 'Profile updated successfully' }
  },

  // Get Profile
  getProfile: async (): Promise<typeof mockDoctor> => {
    await delay(500)
    return mockDoctor
  },

  // Logout
  logout: async (): Promise<{ message: string }> => {
    await delay(500)
    return { message: 'Logged out successfully' }
  }
}

// Mock API error handler
export const handleApiError = (error: any) => {
  if (error.status === 401) {
    // Handle unauthorized error (e.g., redirect to login)
    console.error('Unauthorized:', error.message)
  } else if (error.status === 409) {
    // Handle conflict error (e.g., email already exists)
    console.error('Conflict:', error.message)
  } else {
    // Handle other errors
    console.error('API Error:', error.message)
  }
  throw error
} 