import { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { 
  Bell,
  User,
  Calendar,
  ClipboardList,
  BarChart,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

// Placeholder data - will be replaced with API calls later
const stats = [
  { name: 'Total Patients', value: '2,543', change: '+12%', changeType: 'increase' },
  { name: 'Today\'s Appointments', value: '24', change: '+3', changeType: 'increase' },
  { name: 'Pending Tasks', value: '8', change: '-2', changeType: 'decrease' },
  { name: 'Active Cases', value: '156', change: '+5%', changeType: 'increase' },
];

const recentActivities = [
  { id: 1, type: 'appointment', title: 'New appointment scheduled', time: '5 minutes ago' },
  { id: 2, type: 'lab', title: 'Lab results received', time: '1 hour ago' },
  { id: 3, type: 'note', title: 'New SOAP note added', time: '2 hours ago' },
  { id: 4, type: 'patient', title: 'New patient registered', time: '3 hours ago' },
];

const upcomingAppointments = [
  { id: 1, patient: 'John Doe', time: '09:00 AM', type: 'Follow-up' },
  { id: 2, patient: 'Jane Smith', time: '10:30 AM', type: 'Initial Consultation' },
  { id: 3, patient: 'Robert Johnson', time: '02:00 PM', type: 'Check-up' },
];

export default function Dashboard() {
  const [notifications, setNotifications] = useState(3);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-500 truncate">{stat.name}</div>
                    <div className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</div>
                  </div>
                  <div className={`px-2 py-1 text-sm rounded-full flex items-center ${
                    stat.changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {stat.changeType === 'increase' ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Activities */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recent Activities
              </h2>
              <div className="mt-4 space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Upcoming Appointments
              </h2>
              <div className="mt-4 space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{appointment.patient}</p>
                      <p className="text-sm text-gray-500">{appointment.type}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 