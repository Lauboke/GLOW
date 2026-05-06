import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import DashboardTab from "../components/admin/DashboardTab";
import StaffTab from "../components/admin/StaffTab";
import ReviewsTab from "../components/admin/ReviewsTab";
import InquiriesTab from "../components/admin/InquiriesTab";
import ClientsTab from "../components/admin/ClientsTab";
import AppointmentsTab from "../components/admin/AppointmentsTab";
import AdminLoadingScreen from "../components/admin/AdminLoadingScreen";
import AdminLoginScreen from "../components/admin/AdminLoginScreen";
import { getAdminBookingStats } from "../components/admin/adminHelpers";
import {
  API_BASE,
  AUTH_API,
  USERS_API,
  CONTACT_API,
  REVIEWS_API,
} from "../components/admin/adminConfig";
import { getAdminToken } from "../components/admin/adminAuth";

import {
  adminLoginRequest,
  fetchBookingsRequest,
  addBookingRequest,
  updateBookingRequest,
  deleteBookingRequest,
  fetchInquiriesRequest,
  sendInquiryReplyRequest,
  fetchReviewsRequest,
  updateReviewRequest,
  fetchClientsRequest,
  deleteUserRequest,
} from "../components/admin/adminApi";

import RevenueTab from "../components/admin/RevenueTab";

import ConfirmModal from "../components/admin/ConfirmModal";

import OwnerProfileTab from "../components/admin/OwnerProfileTab";

import SettingsTab from "../components/admin/SettingsTab";

import ServicesManagerTab from "../components/admin/ServicesManagerTab";

import GiveawaysManagerTab from "../components/admin/GiveawaysManagerTab";

const Admin = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- NEW: Sub-tab state for the Clients page ---
  const [clientTab, setClientTab] = useState("registered"); // 'registered' or 'history'

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [newEntry, setNewEntry] = useState({
    name: "",
    email: "",
    phone: "+254",
    service: "",
    stylist: "",
    paymentMethod: "cash",
    mpesaCode: "",
    price: "",
    date: "",
    time: "",
    completed: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const [inquiries, setInquiries] = useState([]);
  const [replyInputs, setReplyInputs] = useState({});

  // State to hold the actual list of registered users
  const [clientCount, setClientCount] = useState(0);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  const [confirmState, setConfirmState] = useState({
    open: false,
    type: "",
    id: null,
    phone: "",
    message: "",
  });
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const [editReviewState, setEditReviewState] = useState({
  open: false,
  reviewId: null,
  message: "",
  rating: 5,
  staffName: "",
  service: "",
});

  const fetchInquiries = async () => {
    const token = getAdminToken();
    if (!token) return;

    setIsLoading(true);
    try {
      const data = await fetchInquiriesRequest();
      setInquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Inquiry load failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReply = async (id) => {
    const text = replyInputs[id];
    if (!text) return toast.error("Please type a reply first.");

    setIsLoading(true);

    try {
      const res = await sendInquiryReplyRequest(id, text);

      if (res.ok) {
        toast.success("Reply sent to client!");
        setReplyInputs({ ...replyInputs, [id]: "" });
        fetchInquiries();
      } else {
        toast.error("Failed to send reply.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const [reviews, setReviews] = useState([]);

  const fetchAdminReviews = async () => {
    try {
      const data = await fetchReviewsRequest();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Reviews load failed:", err);
    }
  };

  const handleUpdateReviewStatus = async (reviewId, newStatus) => {
    try {
      const res = await updateReviewRequest(reviewId, { status: newStatus });

      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) =>
            r._id === reviewId || r.id === reviewId
              ? { ...r, status: newStatus }
              : r,
          ),
        );
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleToggleHomeFeature = async (reviewId, currentHomeStatus) => {
    try {
      const res = await updateReviewRequest(reviewId, {
        showOnHome: !currentHomeStatus,
      });

      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) =>
            r._id === reviewId ? { ...r, showOnHome: !currentHomeStatus } : r,
          ),
        );
      }
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

const handleEditReview = (review) => {
  setEditReviewState({
    open: true,
    reviewId: review._id || review.id,
    message: review.message || review.text || "",
    rating: review.rating || 5,
    staffName: review.staffName || "",
    service: review.service || "",
  });
};

const handleSaveEditedReview = async () => {
  const trimmedMessage = editReviewState.message.trim();
  const numericRating = Number(editReviewState.rating);

  if (!trimmedMessage) {
    toast.error("Review message cannot be empty.");
    return;
  }

  if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
    toast.error("Rating must be a number between 1 and 5.");
    return;
  }

  try {
    const res = await updateReviewRequest(editReviewState.reviewId, {
      message: trimmedMessage,
      rating: numericRating,
      staffName: editReviewState.staffName,
      service: editReviewState.service,
    });

    if (res.ok) {
      setReviews((prev) =>
        prev.map((r) =>
          (r._id || r.id) === editReviewState.reviewId
            ? {
                ...r,
                message: trimmedMessage,
                rating: numericRating,
                staffName: editReviewState.staffName,
                service: editReviewState.service,
              }
            : r
        )
      );

      setEditReviewState({
        open: false,
        reviewId: null,
        message: "",
        rating: 5,
        staffName: "",
        service: "",
      });

      toast.success("Review updated successfully.");
    } else {
      toast.error("Failed to update review.");
    }
  } catch (err) {
    console.error("Edit review failed:", err);
    toast.error("Failed to update review.");
  }
};

const handleDeleteReview = (reviewId) => {
  setConfirmState({
    open: true,
    type: "review",
    id: reviewId,
    phone: "",
    message: "Are you sure you want to permanently delete this review?",
  });
};


  // --- UPDATED: Fetching the full list of users for the new table ---
  const fetchClientsData = async () => {
    try {
      const data = await fetchClientsRequest();

      if (Array.isArray(data)) {
        setRegisteredUsers(data);
        setClientCount(data.length);
      } else {
        console.error("Backend sent this instead of an array:", data);
      }
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    }
  };

  useEffect(() => {
    const token = getAdminToken();
    if (token) {
      setIsLoggedIn(true);
      fetchBookings();
    }
  }, []);

  const handleAdminLogin = async (e) => {
  e.preventDefault();

  try {
    const { response, data } = await adminLoginRequest(
      emailInput,
      passwordInput,
    );

    if (response.ok && ["admin", "staff"].includes(data.user.role)) {
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userEmail", data.user.email || emailInput);

      setIsLoggedIn(true);
    } else {
      toast.error(data.message || "Access Denied: Staff access required.");
    }
  } catch (error) {
    toast.error("System Error: Backend is not responding.");
  }
};

  const handleUpdatePaymentStatus = async (id, newStatus) => {
    try {
      const res = await updateBookingRequest(id, {
        paymentStatus: newStatus,
      });

      if (res.ok) {
        toast.success("Payment confirmed! Spot is now official. ✨");
        fetchBookings();
      } else {
        toast.error("Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Connection error.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    setEmailInput("");
    setPasswordInput("");
    setBookings([]);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchBookings();
      fetchInquiries();
      fetchAdminReviews();
      fetchClientsData(); // Call the updated fetcher
    }
  }, [isLoggedIn]);

  const fetchBookings = async () => {
    setIsLoading(true);

    try {
      const data = await fetchBookingsRequest();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBooking = async (e) => {
    e.preventDefault();

    try {
      await addBookingRequest(newEntry);

      fetchBookings();
      setNewEntry({
        name: "",
        email: "",
        phone: "+254",
        service: "Nails",
        stylist: "",
        paymentMethod: "cash",
        mpesaCode: "",
        price: "",
        date: "",
        time: "",
        completed: false,
      });
    } catch (err) {
      console.error("Add booking failed:", err);
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    const token = getAdminToken();
    await fetch(`${API_BASE}/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed: !currentStatus }),
    });
    fetchBookings();
  };

  const handleDelete = (id) => {
    setConfirmState({
      open: true,
      type: "booking",
      id,
      phone: "",
      message: "Delete this booking?",
    });
  };

  const handleDeleteUser = (id) => {
    setConfirmState({
      open: true,
      type: "user",
      id,
      phone: "",
      message:
        "Are you sure? This will permanently delete this client's account.",
    });
  };

  const handleDeleteClientHistory = (phone) => {
    setConfirmState({
      open: true,
      type: "history",
      id: null,
      phone,
      message: `Clear all booking history for ${phone}? This cannot be undone.`,
    });
  };

  const handleConfirmAction = async () => {
    try {
      setIsConfirmLoading(true);

      if (confirmState.type === "booking" && confirmState.id) {
        const token = getAdminToken();
        await fetch(`${API_BASE}/delete/${confirmState.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        await fetchBookings();
      }

      if (confirmState.type === "user" && confirmState.id) {
        await deleteUserRequest(confirmState.id);
        await fetchClientsData();
      }


if (confirmState.type === "review" && confirmState.id) {
      const token = getAdminToken();

      const res = await fetch(`${REVIEWS_API}/${confirmState.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to delete review");
      }

      setReviews((prev) =>
        prev.filter((r) => (r._id || r.id) !== confirmState.id)
      );

      toast.success("Review deleted successfully.");
    }

      if (confirmState.type === "history" && confirmState.phone) {
        const token = getAdminToken();
        const clientBookings = safeBookings.filter(
          (b) => b.phone === confirmState.phone,
        );

        for (const b of clientBookings) {
          await fetch(`${API_BASE}/delete/${b._id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        await fetchBookings();
      }

      setConfirmState({
        open: false,
        type: "",
        id: null,
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Action failed.");
    } finally {
      setIsConfirmLoading(false);
    }
  };

  // --- REPORT GENERATOR ---
  const generateReport = () => {
    const completedBookings = safeBookings.filter((b) => b.completed);

    let csvContent = "data:text/csv;charset=utf-8,";

    csvContent += "Date,Client Name,Phone,Service,Price (KES)\n";

    completedBookings.forEach((b) => {
      const row = `${b.date},${b.name},${b.phone},${b.service},${b.price}\n`;
      csvContent += row;
    });

    csvContent += `\n,TOTAL REVENUE,,,${totalRevenue}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Glow_Revenue_Report_${todayDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const {
    todayDate,
    safeBookings,
    totalRevenue,
    todayRevenue,
    todayCount,
    filteredBookings,
    uniqueClients,
  } = getAdminBookingStats(bookings, searchTerm, filter);

  if (!isLoggedIn) {
    return (
      <AdminLoginScreen
        emailInput={emailInput}
        setEmailInput={setEmailInput}
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        handleAdminLogin={handleAdminLogin}
      />
    );
  }

  if (isLoggedIn && isLoading) {
    return <AdminLoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 md:flex">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        closeMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between bg-white px-4 py-4 shadow-sm md:hidden">
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="rounded-xl bg-black p-3 text-white"
          aria-label="Open admin menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <p className="text-xs font-black uppercase tracking-[0.25em] text-pink-500">
          Glow Admin
        </p>

        <div className="w-11" />
      </div>

      <main className="w-full px-4 pt-24 pb-32 md:ml-64 md:flex-1 md:p-10 md:pb-40">
        <AdminHeader activeTab={activeTab} />

        {/* --- TAB CONTENT: DASHBOARD --- */}
        {activeTab === "dashboard" && (
          <DashboardTab
            safeBookings={safeBookings}
            totalRevenue={totalRevenue}
            clientCount={clientCount}
            reviews={reviews}
            setActiveTab={setActiveTab}
            setClientTab={setClientTab}
          />
        )}

        {/* --- TAB CONTENT: APPOINTMENTS --- */}
        {activeTab === "appointments" && (
          <AppointmentsTab
            todayDate={todayDate}
            todayCount={todayCount}
            safeBookings={safeBookings}
            newEntry={newEntry}
            setNewEntry={setNewEntry}
            handleAddBooking={handleAddBooking}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filter={filter}
            setFilter={setFilter}
            filteredBookings={filteredBookings}
            handleUpdatePaymentStatus={handleUpdatePaymentStatus}
            handleToggleComplete={handleToggleComplete}
            handleDelete={handleDelete}
          />
        )}

        {/* --- TAB CONTENT: STAFF --- */}
        {activeTab === "staff" && (
          <StaffTab
            selectedStaff={selectedStaff}
            setSelectedStaff={setSelectedStaff}
            bookings={safeBookings}
          />
        )}

        {/* --- TAB CONTENT: CLIENTS (UPDATED WITH TWO SECTIONS) --- */}
        {activeTab === "clients" && (
          <ClientsTab
            clientTab={clientTab}
            setClientTab={setClientTab}
            clientCount={clientCount}
            registeredUsers={registeredUsers}
            handleDeleteUser={handleDeleteUser}
            uniqueClients={uniqueClients}
            handleDeleteClientHistory={handleDeleteClientHistory}
          />
        )}

        {/* --- TAB CONTENT: INQUIRIES --- */}
        {activeTab === "inquiries" && (
          <InquiriesTab
            inquiries={inquiries}
            replyInputs={replyInputs}
            setReplyInputs={setReplyInputs}
            handleSendReply={handleSendReply}
          />
        )}

        {/* --- TAB CONTENT: REVIEWS MANAGEMENT --- */}
        {activeTab === "reviews" && (
  <ReviewsTab
    reviews={reviews}
    handleUpdateReviewStatus={handleUpdateReviewStatus}
    handleToggleHomeFeature={handleToggleHomeFeature}
    handleEditReview={handleEditReview}
    handleDeleteReview={handleDeleteReview}
  />
)}

        {activeTab === "revenue" && (
          <RevenueTab
            totalRevenue={totalRevenue}
            todayRevenue={todayRevenue}
            safeBookings={safeBookings}
            generateReport={generateReport}
          />
        )}

        {activeTab === "profile" && <OwnerProfileTab />}

        {activeTab === "settings" && <SettingsTab />}

        {activeTab === "services" && <ServicesManagerTab />}

        {activeTab === "giveaways" && <GiveawaysManagerTab />}

        <ConfirmModal
          isOpen={confirmState.open}
          title="Please Confirm"
          message={confirmState.message}
          confirmText="Confirm"
          cancelText="Cancel"
          onConfirm={handleConfirmAction}
          onClose={() =>
            setConfirmState({
              open: false,
              type: "",
              id: null,
              phone: "",
              message: "",
            })
          }
          isLoading={isConfirmLoading}
        />

{editReviewState.open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div className="w-full max-w-2xl rounded-[2rem] bg-white p-8 shadow-2xl border border-gray-100">
      <div className="mb-6">
        <h3 className="text-2xl font-black text-gray-900 uppercase italic">
          Edit Review
        </h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">
          Update the review details below
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
            Review Message
          </label>
          <textarea
            rows="5"
            value={editReviewState.message}
            onChange={(e) =>
              setEditReviewState((prev) => ({
                ...prev,
                message: e.target.value,
              }))
            }
            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-700 outline-none focus:border-pink-300 focus:bg-white transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Rating
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={editReviewState.rating}
              onChange={(e) =>
                setEditReviewState((prev) => ({
                  ...prev,
                  rating: e.target.value,
                }))
              }
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-700 outline-none focus:border-pink-300 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Staff
            </label>
            <input
              type="text"
              value={editReviewState.staffName}
              onChange={(e) =>
                setEditReviewState((prev) => ({
                  ...prev,
                  staffName: e.target.value,
                }))
              }
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-700 outline-none focus:border-pink-300 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Service
            </label>
            <input
              type="text"
              value={editReviewState.service}
              onChange={(e) =>
                setEditReviewState((prev) => ({
                  ...prev,
                  service: e.target.value,
                }))
              }
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-700 outline-none focus:border-pink-300 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={() =>
            setEditReviewState({
              open: false,
              reviewId: null,
              message: "",
              rating: 5,
              staffName: "",
              service: "",
            })
          }
          className="px-6 py-3 border border-gray-200 text-gray-500 text-[10px] font-black uppercase rounded-xl hover:bg-gray-50 cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSaveEditedReview}
          className="px-6 py-3 bg-gray-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-pink-500 cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}

      </main>
    </div>
  );
};

export default Admin;
