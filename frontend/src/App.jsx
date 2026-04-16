import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import BookingPage from "./pages/BookingPage";
import GalleryPage from "./pages/GalleryPage";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import GlowAI from "./components/GlowAI";
import Contact from "./pages/Contact"; 
import Reviews from "./pages/Reviews";
import Login from "./components/Login";
import HelpFAQ from "./pages/HelpFAQ"; 
import Profile from "./pages/Profile";

const App = () => {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");
  return (
    <>
      {!isAdminPage && <Navbar />}
      <GlowAI />
      <Toaster 
        position="top-center"
        toastOptions={{
          className: '',
          style: {
            fontFamily: 'sans-serif',
            fontSize: '12px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            borderRadius: '2rem',
            padding: '16px 24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
          success: {
            style: { background: '#fdf2f8', color: '#db2777', border: '1px solid #fce7f3' },
            iconTheme: { primary: '#db2777', secondary: '#fdf2f8' },
          },
          error: {
            style: { background: '#fff', color: '#111827', border: '1px solid #f3f4f6' },
            iconTheme: { primary: '#111827', secondary: '#fff' },
          },
        }}
      />
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/login" element={<Login />} />
        <Route path="/faq" element={<HelpFAQ />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
};

export default App;
