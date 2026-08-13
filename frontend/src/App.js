import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import AdminPage from './components/Admin/AdminPage';
import UserHomePage from './components/pages/UserHomePage';
import ListLand from './components/User/ListLand';
import AboutUs from './components/pages/AboutUs';
import { AuthContext } from './context/AuthContext';
import UserDashboard from './components/User/UserDashboard';
import MyLandListings from './components/User/MyLandListings';
import EditLand from './components/User/EditLand';
import SearchResults from './components/pages/SearchResults';
import OngoingBidDetailPage from './components/User/OngoingBidDetailPage';
import ListProduct from './components/User/ListProduct';
import ProductDetailPage from './components/User/ProductDetailPage';
import EditProfile from './components/User/EditProfile';
import { connectSocket } from './utils/socket';
import OwnerChatDashboard from '../src/components/Chat/OwnerChatDashboard'
import MyBidsPage from "./components/User/MyBidsPage";
import UpcomingAuctionDetailPage from '../src/components/User/UpcomingAuctionDetailPage'
import MyWinsPage from '../src/components/User/MyWins';


function App() {
  const { user } = useContext(AuthContext);

  // Connect socket once on app mount (if token exists)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('uId');
    if (token && userId) {
      connectSocket(token, userId);
    }
  }, []);

  // Protected route for role-based access
  const ProtectedRoute = ({ children, role }) => {
    if (!user) return <Navigate to="/login" />;
    if (role && (Array.isArray(role) ? !role.includes(user.role) : user.role !== role)) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Redirect root path based on user role */}
        <Route
          path="/"
          element={
            user ? (
              user.role === 'Admin' ? <Navigate to="/admin" /> : <Navigate to="/user" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/ongoing-bid/:id" element={<OngoingBidDetailPage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/owner/chat-inbox" element={<OwnerChatDashboard />} />
        <Route path="/my-bids" element={<MyBidsPage />} />
        <Route path="/upcoming-auction/:id" element={<UpcomingAuctionDetailPage />} />
        <Route path="/my-wins" element={<MyWinsPage />} />


        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="Admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute role="User">
              <UserHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="User">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-listings"
          element={
            <ProtectedRoute role="User">
              <MyLandListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-land"
          element={
            <ProtectedRoute role="User">
              <ListLand />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-product"
          element={
            <ProtectedRoute role="User">
              <ListProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-land/:id"
          element={
            <ProtectedRoute role="User">
              <EditLand />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route (404) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
