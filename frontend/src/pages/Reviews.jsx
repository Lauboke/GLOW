import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { getAutofillUser } from "../utils/getAutofillUser";

const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21s6-5.686 6-11a6 6 0 10-12 0c0 5.314 6 11 6 11z"
    />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M22 16.92v3a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.86 19.86 0 012.08 4.18 2 2 0 014.06 2h3a2 2 0 012 1.72c.12.9.33 1.78.63 2.62a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.46-1.18a2 2 0 012.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0122 16.92z"
    />
  </svg>
);

const QuestionIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    className="w-5 h-5"
  >
    <circle cx="12" cy="12" r="9" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.75 9a2.25 2.25 0 114.5 0c0 1.5-2.25 2-2.25 3.5"
    />
    <circle cx="12" cy="17" r="0.75" fill="currentColor" stroke="none" />
  </svg>
);

const CameraIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7a2 2 0 012-2h2.2a2 2 0 001.6-.8l.6-.8A2 2 0 0111 3h2a2 2 0 011.6.8l.6.8a2 2 0 001.6.8H19a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
    />
    <circle cx="12" cy="12" r="3.5" />
  </svg>
);

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: "",
    email: "",
    message: "",
    rating: 0,
    staffName: "",
    service: "",
  });
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [status, setStatus] = useState("idle");
  const fileInputRef = useRef(null);

  const [staffOptions, setStaffOptions] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);

  // AUTOFILL
  useEffect(() => {
    let isMounted = true;

    const autofillUser = async () => {
      const user = await getAutofillUser();

      if (!isMounted || !user) return;

      setNewReview((prev) => ({
        ...prev,
        name: prev.name || user.name,
        email: prev.email || user.email,
      }));
    };

    autofillUser();

    return () => {
      isMounted = false;
    };
  }, []);

  // FETCH APPROVED REVIEWS ONLY
  useEffect(() => {
    const fetchApprovedReviews = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/reviews");
        const data = await res.json();
        const approvedOnly = data.filter(
          (r) => r.status?.toLowerCase() === "approved",
        );
        setReviews(approvedOnly);
      } catch (err) {
        console.error("Reviews load failed:", err);
      }
    };

    fetchApprovedReviews();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedPhoto(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  useEffect(() => {
    const fetchStaffOptions = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/staff");
        const data = await res.json();

        if (Array.isArray(data)) {
          setStaffOptions(data);
        }
      } catch (err) {
        console.error("Failed to load staff options:", err);
      }
    };

    fetchStaffOptions();
  }, []);

  useEffect(() => {
    if (!staffOptions.length) {
      setServiceOptions([]);
      return;
    }

    if (newReview.staffName) {
      const selectedStaff = staffOptions.find(
        (staff) => staff.name === newReview.staffName,
      );

      setServiceOptions(selectedStaff?.services || []);
    } else {
      const allServices = [
        ...new Set(staffOptions.flatMap((staff) => staff.services || [])),
      ];
      setServiceOptions(allServices);
    }
  }, [staffOptions, newReview.staffName]);

  const clearSelectedPhoto = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedPhoto(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newReview.name || !newReview.message || newReview.rating === 0) {
      toast("Please provide your name, a rating, and a message.");
      return;
    }

    setStatus("submitting");

    try {
      const payload = new FormData();
      payload.append("name", newReview.name);
      payload.append("email", newReview.email);
      payload.append("message", newReview.message);
      payload.append("rating", String(newReview.rating));
      payload.append("staffName", newReview.staffName);
      payload.append("service", newReview.service);
      payload.append("status", "pending");

      if (selectedPhoto) {
        payload.append("photo", selectedPhoto);
      }

      const res = await fetch("http://localhost:5001/api/reviews", {
        method: "POST",
        body: payload,
      });

      if (res.ok) {
        setStatus("success");

        setTimeout(() => {
          setNewReview({
            name: "",
            email: "",
            message: "",
            rating: 0,
            staffName: "",
            service: "",
          });
          clearSelectedPhoto();
          setStatus("idle");
        }, 3000);
      } else {
        toast.error("Could not submit review.");
        setStatus("idle");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      toast.error("Submission failed.");
      setStatus("idle");
    }
  };

  const renderStars = (rating, interactive = false) => {
    return (
      <div className="flex gap-1 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() =>
              interactive && setNewReview({ ...newReview, rating: star })
            }
            className={`text-2xl transition-all duration-200 ${
              star <= rating ? "text-[#facc15]" : "text-gray-200"
            } ${interactive ? "cursor-pointer hover:scale-125" : "cursor-default"}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#fdfafb] min-h-screen p-8 lg:p-12 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            What Our{" "}
            <span className="text-pink-400 font-serif italic font-medium">
              Clients Say
            </span>
          </h2>
          <p className="text-sm font-bold text-gray-400 tracking-widest max-w-3xl mx-auto leading-7 text-center">
            Read what our happy clients have to say.
            <br />
            Your feedback inspires us to keep glowing! Please leave a review!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white p-8 rounded-[2rem] shadow-sm border border-pink-50/50 flex flex-col items-center text-center"
              >
                {review.photoUrl ? (
                  <img
                    src={review.photoUrl}
                    alt={review.name}
                    className="w-20 h-20 rounded-full object-cover mb-4 shadow-sm border-4 border-white"
                  />
                ) : (
                  <div className="w-20 h-20 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center text-3xl font-black mb-4 shadow-sm border-4 border-white">
                    {review.name.charAt(0)}
                  </div>
                )}

                <h3 className="text-lg font-black text-gray-900 mb-2">
                  {review.name}
                </h3>
                <div className="mb-4">{renderStars(review.rating)}</div>

                <p className="mt-3 text-[15px] text-gray-500 leading-7 italic font-medium max-w-[26ch] mx-auto">
                  “{review.message || review.text}”
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-400 font-bold uppercase tracking-widest text-xs">
              No approved reviews yet. Be the first!
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-pink-50/50 relative overflow-hidden">
            {status === "success" && (
              <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center text-center p-10 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-pink-500 text-white rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg">
                  ✓
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-2">
                  Submitted!
                </h3>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                  It will appear once approved by our team.
                </p>
              </div>
            )}

            <h3 className="text-3xl font-black text-gray-900 mb-2">
              Leave a{" "}
              <span className="text-pink-400 font-serif italic font-medium">
                Review
              </span>
            </h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">
              Your feedback helps us grow.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-4 mb-6 bg-pink-50/30 p-4 rounded-xl border border-pink-50">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500">
                  <QuestionIcon />
                </div>
                <div>{renderStars(newReview.rating, true)}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  type="text"
                  placeholder="Your Name"
                  value={newReview.name}
                  onChange={(e) =>
                    setNewReview({ ...newReview, name: e.target.value })
                  }
                  readOnly={!!localStorage.getItem("userToken")}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-pink-300 focus:bg-white transition-all"
                />
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={newReview.email}
                  onChange={(e) =>
                    setNewReview({ ...newReview, email: e.target.value })
                  }
                  readOnly={!!localStorage.getItem("userToken")}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-pink-300 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select
                  required
                  value={newReview.staffName}
                  onChange={(e) =>
                    setNewReview({
                      ...newReview,
                      staffName: e.target.value,
                      service: "",
                    })
                  }
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-pink-300 focus:bg-white transition-all"
                >
                  <option value="">Select Stylist</option>
                  {staffOptions.map((staff) => (
                    <option key={staff._id} value={staff.name}>
                      {staff.name}
                    </option>
                  ))}
                </select>
                <select
                  required
                  value={newReview.service}
                  onChange={(e) =>
                    setNewReview({ ...newReview, service: e.target.value })
                  }
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-pink-300 focus:bg-white transition-all"
                >
                  <option value="">Select Service</option>
                  {serviceOptions.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                required
                placeholder="How was your experience?"
                rows="4"
                value={newReview.message}
                onChange={(e) =>
                  setNewReview({ ...newReview, message: e.target.value })
                }
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-pink-300 focus:bg-white transition-all resize-none"
              ></textarea>

              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-pink-500 transition-all cursor-pointer"
                  >
                    <CameraIcon />
                    Upload Glow Photo
                  </button>

                  {selectedPhoto && (
                    <button
                      type="button"
                      onClick={clearSelectedPhoto}
                      className="px-5 py-3 rounded-xl bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all cursor-pointer"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                {previewUrl && (
                  <div className="rounded-2xl overflow-hidden border border-pink-100 bg-pink-50/30 p-3">
                    <img
                      src={previewUrl}
                      alt="Review preview"
                      className="w-full h-56 object-contain rounded-xl bg-white"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className={`w-full lg:w-auto px-10 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md mt-4 float-right text-white ${
                  status === "submitting"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-pink-400 hover:bg-pink-500 cursor-pointer"
                }`}
              >
                {status === "submitting" ? "Sending..." : "Submit Review"}
              </button>
              <div className="clear-both"></div>
            </form>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-pink-50/50 overflow-hidden flex flex-col group">
            <div className="h-80 w-full relative overflow-hidden bg-pink-50">
  <img
    src="/images/background.png"
    alt="Glow Beauty"
    className="w-full h-full object-cover object-center scale-98"
  />
  <div className="absolute inset-0 bg-white/10"></div>
</div>

            <div className="p-10 flex-grow flex flex-col justify-start">
              <h3 className="text-3xl font-black text-gray-900 mb-4">
                Visit Our{" "}
                <span className="text-pink-400 font-serif italic font-medium">
                  Salon
                </span>
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Relax and rejuvenate at our studio in Egerton Njoro, Nakuru.
              </p>

              <div className="space-y-4 text-sm font-bold text-gray-600">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center shadow-sm">
                    <MapPinIcon />
                  </span>
                  <span>Egerton Njoro, Nakuru</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center shadow-sm">
                    <PhoneIcon />
                  </span>
                  <span>+254714749302</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
