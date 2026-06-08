import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import CheckInPage from './pages/CheckInPage';
import RankingsPage from './pages/RankingsPage';
import ProfilePage from './pages/ProfilePage';
import UserCheckInPage from './pages/UserCheckInPage';
import StreakPage from './pages/StreakPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/auth" replace />;
    }
    return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={
            <ProtectedRoute>
                <Layout>
                    <HomePage />
                </Layout>
            </ProtectedRoute>
        } />
        <Route path="/checkin" element={
            <ProtectedRoute>
                <Layout>
                    <CheckInPage />
                </Layout>
            </ProtectedRoute>
        } />
        <Route path="/streak" element={
            <ProtectedRoute>
                <Layout>
                    <StreakPage />
                </Layout>
            </ProtectedRoute>
        } />
        <Route path="/rankings" element={
            <ProtectedRoute>
                <Layout>
                    <RankingsPage />
                </Layout>
            </ProtectedRoute>
        } />
        <Route path="/profile" element={
            <ProtectedRoute>
                <Layout>
                    <ProfilePage />
                </Layout>
            </ProtectedRoute>
        } />
        <Route path="/user/:userId" element={
            <ProtectedRoute>
                <Layout>
                    <UserCheckInPage />
                </Layout>
            </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
