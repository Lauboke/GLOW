import React from "react";
import AdminReviews from "./AdminReviews";

const ReviewsTab = ({
  reviews,
  handleUpdateReviewStatus,
  handleToggleHomeFeature,
  handleEditReview,
  handleDeleteReview,
}) => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 uppercase italic">
          Review Management
        </h2>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
          Moderate feedback and select featured testimonials
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            No reviews found in database.
          </p>
        </div>
      ) : (
        <AdminReviews
  reviews={reviews}
  onUpdateStatus={handleUpdateReviewStatus}
  onToggleHome={handleToggleHomeFeature}
  onEditReview={handleEditReview}
  onDeleteReview={handleDeleteReview}
/>
      )}
    </div>
  );
};

export default ReviewsTab;