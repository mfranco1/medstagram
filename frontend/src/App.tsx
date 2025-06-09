import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SoapPage from './pages/SoapPage'
import SignupPage from './pages/SignupPage'
import Dashboard from './pages/Dashboard'
import PatientsPage from './pages/PatientsPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/soap/:patientId" element={<SoapPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
