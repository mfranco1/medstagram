import type { Doctor, DoctorAvailability, WorkingDay } from '../types/user'

const workingDays: WorkingDay[] = [
  { day: 'monday', startTime: '08:00', endTime: '17:00', isAvailable: true },
  { day: 'tuesday', startTime: '08:00', endTime: '17:00', isAvailable: true },
  { day: 'wednesday', startTime: '08:00', endTime: '17:00', isAvailable: true },
  { day: 'thursday', startTime: '08:00', endTime: '17:00', isAvailable: true },
  { day: 'friday', startTime: '08:00', endTime: '17:00', isAvailable: true },
  { day: 'saturday', startTime: '09:00', endTime: '13:00', isAvailable: true },
  { day: 'sunday', startTime: '00:00', endTime: '00:00', isAvailable: false }
]

const availability: DoctorAvailability = {
  workingDays,
  timeZone: 'Asia/Manila'
}

export const mockDoctor: Doctor = {
  id: 1,
  email: 'dr.franco@medstagram.com',
  role: 'doctor',
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-03-15T00:00:00Z',
  firstName: 'Marty',
  lastName: 'Franco',
  specialization: 'Internal Medicine',
  licenseNumber: '123456',
  contactNumber: '+63 912 345 6789',
  department: 'Internal Medicine',
  profileImage: 'https://i.pravatar.cc/300?img=1',
  title: 'Dr.',
  biography: 'Dr. Marty Franco is a board-certified internist with over 10 years of experience in treating complex medical conditions. He specializes in preventive care and chronic disease management.',
  availability
}

// Additional mock doctors for testing
export const mockDoctors: Doctor[] = [
  mockDoctor,
  {
    ...mockDoctor,
    id: 2,
    email: 'dr.garcia@medstagram.com',
    firstName: 'Juan',
    lastName: 'Garcia',
    specialization: 'Cardiology',
    licenseNumber: '234567',
    contactNumber: '+63 923 456 7890',
    department: 'Cardiology',
    profileImage: 'https://i.pravatar.cc/300?img=2',
    biography: 'Dr. Juan Garcia is a cardiologist with expertise in interventional cardiology and heart failure management.'
  },
  {
    ...mockDoctor,
    id: 3,
    email: 'dr.cruz@medstagram.com',
    firstName: 'Ana',
    lastName: 'Cruz',
    specialization: 'Pediatrics',
    licenseNumber: '345678',
    contactNumber: '+63 934 567 8901',
    department: 'Pediatrics',
    profileImage: 'https://i.pravatar.cc/300?img=3',
    biography: 'Dr. Ana Cruz is a pediatrician dedicated to providing comprehensive care for children from birth through adolescence.'
  }
] 