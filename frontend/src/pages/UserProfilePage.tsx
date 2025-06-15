import { MainLayout } from '../components/layout/MainLayout'
import { mockDoctor } from '../mocks/doctor'
import { UserCog, Mail, Phone, Building2, GraduationCap } from 'lucide-react'

export default function UserProfilePage() {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-6">
            {mockDoctor.profileImage ? (
              <img 
                src={mockDoctor.profileImage} 
                alt={`${mockDoctor.firstName} ${mockDoctor.lastName}`}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-violet-100 flex items-center justify-center">
                <span className="text-3xl font-semibold text-violet-600">
                  {getInitials(mockDoctor.firstName, mockDoctor.lastName)}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {mockDoctor.title} {mockDoctor.firstName} {mockDoctor.lastName}
              </h1>
              <p className="text-lg text-gray-600 mt-1">{mockDoctor.specialization}</p>
              <p className="text-sm text-gray-500 mt-2">{mockDoctor.department}</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <UserCog className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
              <div>
                <span className="text-sm text-gray-500">License Number</span>
                <p className="text-gray-900">{mockDoctor.licenseNumber}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
              <div>
                <span className="text-sm text-gray-500">Email</span>
                <p className="text-gray-900">{mockDoctor.email}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
              <div>
                <span className="text-sm text-gray-500">Contact Number</span>
                <p className="text-gray-900">{mockDoctor.contactNumber}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Building2 className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
              <div>
                <span className="text-sm text-gray-500">Department</span>
                <p className="text-gray-900">{mockDoctor.department}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <GraduationCap className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
              <div>
                <span className="text-sm text-gray-500">Specialization</span>
                <p className="text-gray-900">{mockDoctor.specialization}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 