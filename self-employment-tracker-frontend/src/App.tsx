import './App.css'
import { Routes, Route, BrowserRouter } from "react-router-dom"
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import Menu from './pages/MenuPage'
import SearchLoggedJobsPage from './pages/SearchLoggedJobsPage'
import ViewLoggedJobsPage from './pages/ViewLoggedJobsPage'
import InputJobsPage from './pages/InputJobsPage'
import TrendPage from './pages/TrendPage'
import SignUpPage from './pages/SignUpPage'
import ProtectedRoute from './protectedRoute'
import { AuthProvider } from './authProvider'
import SetPageTitle from './titleProvider'
import LoggedJobInfoPage from './pages/ViewLoggedJobPage'
import ExportPage from './pages/ExportPage'
import TutorialPage from './pages/TutorialPage'

function App() {


  return (
    <AuthProvider>
      <BrowserRouter>
        <SetPageTitle />
        <Routes>

          <Route path="/login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />

          {/* Protected Routes */}
          <Route path="/settings" element={
            <ProtectedRoute><SettingsPage /></ProtectedRoute>
          } />
          <Route path="/menu" element={
            <ProtectedRoute><Menu /></ProtectedRoute>
          } />
          <Route path="/logged/search" element={
            <ProtectedRoute><SearchLoggedJobsPage /></ProtectedRoute>
          } />
          <Route path="/logged/view" element={
            <ProtectedRoute><ViewLoggedJobsPage /></ProtectedRoute>
          } />
          <Route path="/logged/moreInfo/:jobID" element={
            <ProtectedRoute><LoggedJobInfoPage /></ProtectedRoute>
          } />
          <Route path="/log" element={
            <ProtectedRoute><InputJobsPage /></ProtectedRoute>
          } />
          <Route path="/trends" element={
            <ProtectedRoute><TrendPage /></ProtectedRoute>
          } />
          <Route path="/export" element={
            <ProtectedRoute><ExportPage /></ProtectedRoute>
          } />
          <Route path="/tutorial" element={<ProtectedRoute><TutorialPage /></ProtectedRoute>} />


          <Route path="/" element={<LoginPage />} />

        </Routes>
      </BrowserRouter >
    </AuthProvider >
  )
}

export default App
