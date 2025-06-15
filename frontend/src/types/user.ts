export type UserRole = 'doctor' | 'nurse' | 'admin' | 'patient'

export interface BaseUser {
  id: number
  email: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Doctor extends BaseUser {
  role: 'doctor'
  firstName: string
  lastName: string
  specialization: string
  licenseNumber: string
  contactNumber: string
  department: string
  profileImage?: string
  title: string
  biography?: string
  availability?: DoctorAvailability
}

export interface DoctorAvailability {
  workingDays: WorkingDay[]
  timeZone: string
}

export interface WorkingDay {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  startTime: string // Format: "HH:mm"
  endTime: string // Format: "HH:mm"
  isAvailable: boolean
}

// API Response Types
export interface LoginResponse {
  user: Doctor
  token: string
  refreshToken: string
}

export interface RegisterDoctorRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  specialization: string
  licenseNumber: string
  contactNumber: string
  department: string
  title: string
  biography?: string
}

export interface UpdateDoctorRequest {
  firstName?: string
  lastName?: string
  specialization?: string
  contactNumber?: string
  department?: string
  profileImage?: string
  title?: string
  biography?: string
  availability?: DoctorAvailability
}

// Form Types
export interface DoctorFormData extends Omit<RegisterDoctorRequest, 'password'> {
  confirmPassword?: string
  password?: string
}

// State Types
export interface AuthState {
  user: Doctor | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
} 