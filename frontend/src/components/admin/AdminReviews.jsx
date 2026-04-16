import React, { useState } from "react";

const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8 text-yellow-400"
  >
    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321 1.01l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.386a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.56a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557L3.04 10.407a.562.562 0 01.321-1.01l5.518-.442a.563.563 0 00.475-.345l2.125-5.11z" />
  </svg>
);

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// const EditIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="1.8"
//     className="w-4 h-4"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M16.862 4.487a2.25 2.25 0 113.182 3.182L8.25 19.463 4 20l.537-4.25L16.862 4.487z"
//     />
//   </svg>
// );

// const TrashIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="1.8"
//     className="w-4 h-4"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 0v11a1 1 0 001 1h6a1 1 0 001-1V7"
//     />
//   </svg>
// );

const AdminReviews = ({
  reviews = [],
  onUpdateStatus,
  onToggleHome,
  onEditReview,
  onDeleteReview,
}) => {
  const [filterStaff, setFilterStaff] = useState("All");
  const [filterService, setFilterService] = useState("All");
  const [viewStatus, setViewStatus] = useState("pending");

  // 1. DYNAMIC LISTS
  const staffList = [
    "All",
    ...new Set(reviews.map((r) => r.staffName).filter(Boolean)),
  ];
  const serviceList = [
    "All",
    ...new Set(reviews.map((r) => r.service).filter(Boolean)),
  ];

  // 2. FILTER LOGIC (Fixes the "0 Awaiting Action" and visibility issues)
  const filteredReviews = reviews.filter((r) => {
    const rStatus = r.status || "pending"; // Default to pending if status is missing
    const matchesStatus = rStatus === viewStatus;
    const matchesStaff = filterStaff === "All" || r.staffName === filterStaff;
    const matchesService =
      filterService === "All" || r.service === filterService;
    return matchesStatus && matchesStaff && matchesService;
  });

  const averageRating =
    reviews.filter((r) => r.status === "approved").length > 0
      ? (
          reviews
            .filter((r) => r.status === "approved")
            .reduce((sum, r) => sum + r.rating, 0) /
          reviews.filter((r) => r.status === "approved").length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="animate-in fade-in duration-500">
      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Average Rating
          </p>
          <div className="flex items-center gap-3 mt-1">
            <StarIcon />
            <h3 className="text-3xl font-black text-gray-900">
              {averageRating}
            </h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Total Feedback
          </p>
          <h3 className="text-3xl font-black text-gray-900 mt-1">
            {reviews.length}
          </h3>
        </div>
        <div className="bg-pink-500 p-8 rounded-[2rem] shadow-lg">
          <p className="text-[10px] font-black text-pink-100 uppercase tracking-widest">
            Awaiting Action
          </p>
          <h3 className="text-3xl font-black text-white mt-1">
            {
              reviews.filter((r) => (r.status || "pending") === "pending")
                .length
            }
          </h3>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm mb-8 flex flex-wrap gap-8 items-end">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
            Review Queue
          </label>
          <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            {["pending", "approved", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setViewStatus(s)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all cursor-pointer ${viewStatus === s ? "bg-white text-pink-500 shadow-sm" : "text-gray-400"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase">
                Client
              </th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase">
                Rating & Message
              </th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase">
                Context
              </th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredReviews.map((r) => (
              <tr
                key={r._id || r.id}
                className="hover:bg-gray-50/30 transition-colors"
              >
                <td className="p-6">
                  <p className="text-sm font-black text-gray-900">{r.name}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString()
                      : "Pending"}
                  </p>
                </td>
                <td className="p-6 max-w-md">
                  {r.photoUrl && (
                    <div className="mb-3">
                      <img
                        src={r.photoUrl}
                        alt={r.name}
                        className="w-20 h-20 rounded-xl object-cover border border-gray-200 shadow-sm"
                      />
                    </div>
                  )}

                  <div
                    className={`inline-flex px-2 py-1 rounded text-[10px] font-black mb-2 ${r.rating <= 2 ? "bg-red-50 text-red-500" : "bg-yellow-50 text-yellow-600"}`}
                  >
                    {"★".repeat(r.rating)} {r.rating}.0
                  </div>

                  <p className="text-xs text-gray-600 italic">
                    "{r.message || r.text}"
                  </p>
                </td>
                <td className="p-6">
                  <p className="text-[10px] font-black text-gray-400 uppercase">
                    Staff:{" "}
                    <span className="text-gray-900">
                      {r.staffName || "N/A"}
                    </span>
                  </p>
                  <p className="text-[10px] font-black text-gray-400 uppercase">
                    Service:{" "}
                    <span className="text-gray-900">{r.service || "N/A"}</span>
                  </p>
                </td>
                <td className="p-6">
  <div className="flex justify-center gap-2 flex-wrap">
    {r.photoUrl && (
      <button
        onClick={() => window.open(r.photoUrl, "_blank")}
        className="inline-flex items-center gap-1 px-4 py-2 border border-gray-200 text-gray-700 text-[9px] font-black uppercase rounded-xl hover:bg-gray-50 cursor-pointer"
      >
        <EyeIcon />
        View Photo
      </button>
    )}

    {viewStatus === "pending" && (
      <>
        <button
          onClick={() => onUpdateStatus(r._id || r.id, "approved")}
          className="px-4 py-2 bg-gray-900 text-white text-[9px] font-black uppercase rounded-xl hover:bg-pink-500 cursor-pointer"
        >
          Approve
        </button>
        <button
          onClick={() => onUpdateStatus(r._id || r.id, "rejected")}
          className="px-4 py-2 border border-gray-100 text-gray-400 text-[9px] font-black uppercase rounded-xl hover:text-red-500 cursor-pointer"
        >
          Reject
        </button>
      </>
    )}

    {viewStatus === "approved" && (
  <>
    <button
      onClick={() => onEditReview(r)}
      className="px-4 py-2 bg-gray-900 text-white text-[9px] font-black uppercase rounded-xl hover:bg-pink-500 cursor-pointer"
    >
      Edit
    </button>

    <button
      onClick={() => onDeleteReview(r._id || r.id)}
      className="px-4 py-2 border border-red-100 text-red-500 text-[9px] font-black uppercase rounded-xl hover:bg-red-50 cursor-pointer"
    >
      Delete
    </button>
  </>
)}
  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReviews;
