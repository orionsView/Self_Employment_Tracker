
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage';
import Menu from './pages/MenuPage';
import LoggedDataPage from './pages/LoggedJobsPage';

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<h1>Home</h1>} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/logged" element={<LoggedDataPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
