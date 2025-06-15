import { useParams, useNavigate } from 'react-router-dom'
import { MainLayout } from '../components/layout/MainLayout'
import { UserCog, Mail, Phone, Building2, GraduationCap, ArrowLeft } from 'lucide-react'
import { mockDoctor } from '../mocks/doctor' // We'll replace this with actual API call later

export default function PublicProfilePage() {
  const { userId } = useParams()
  const navigate = useNavigate()

  // TODO: Replace with actual API call to fetch user data
  const user = mockDoctor // For now, we'll use mock data

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back</span>
        </button>

        {/* Profile Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-6">
            {user.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={`${user.firstName} ${user.lastName}`}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-violet-100 flex items-center justify-center">
                <span className="text-3xl font-semibold text-violet-600">
                  {getInitials(user.firstName, user.lastName)}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {user.title} {user.firstName} {user.lastName}
              </h1>
              <p className="text-lg text-gray-600 mt-1">{user.specialization}</p>
              <p className="text-sm text-gray-500 mt-2">{user.department}</p>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <UserCog className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
              <div>
                <span className="text-sm text-gray-500">License Number</span>
                <p className="text-gray-900">{user.licenseNumber}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Building2 className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
              <div>
                <span className="text-sm text-gray-500">Department</span>
                <p className="text-gray-900">{user.department}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <GraduationCap className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
              <div>
                <span className="text-sm text-gray-500">Specialization</span>
                <p className="text-gray-900">{user.specialization}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 