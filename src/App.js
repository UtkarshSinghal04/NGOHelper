import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import NGOPortal from './pages/NGOPortal';
import AdminLogin from './pages/AdminLogin';
import ReportSubmission from './pages/ReportSubmission';
import BulkUpload from './pages/BulkUpload';
import AdminDashboard from './pages/AdminDashboard';
import Contact from './pages/Contact';
import AdminPortal from './pages/AdminPortal';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* ------------------ Public routes ------------------ */}
            <Route path="/" element={<HomePage />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* ------------------ NGO Portal Layout ------------------ */}
            <Route path="/ngo-portal" element={<NGOPortal />}>
              {/* Default redirect to reports */}
              <Route index element={<Navigate to="reports" replace />} />
              <Route path="reports" element={<ReportSubmission />} />
              <Route path="bulk-upload" element={<BulkUpload />} />
              <Route path="contact" element={<Contact />} />
            </Route>

            {/* ------------------ Admin Portal Layout ------------------ */}
            <Route
              path="/admin-portal"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPortal />
                </ProtectedRoute>
              }
            >
              {/* Default redirect to dashboard */}
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              {/* Add more admin pages below if needed */}
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
