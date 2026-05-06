import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API_BASE = "http://localhost:5001";

const ServicesManagerTab = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

 const [formData, setFormData] = useState({
  title: "",
  category: "Hair",
  price: "",
  imageUrl: "",
  description: "",
  isActive: true,
  isFeatured: false,
});

const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState("");

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/services/admin`);
      const data = await response.json();

      if (response.ok) {
        setServices(data.data || []);
      } else {
        toast.error(data.message || "Failed to load services.");
      }
    } catch (error) {
      toast.error("Could not connect to backend.");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    toast.error("Please select a valid image file.");
    return;
  }

  setImageFile(file);
  setImagePreview(URL.createObjectURL(file));
};

  const handleCreateService = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const submitData = new FormData();

    submitData.append("title", formData.title);
    submitData.append("category", formData.category);
    submitData.append("price", formData.price);
    submitData.append("description", formData.description);
    submitData.append("isActive", formData.isActive);
    submitData.append("isFeatured", formData.isFeatured);

    // File upload method
    if (imageFile) {
      submitData.append("image", imageFile);
    }

    // Optional backup: still allows pasted Cloudinary URL
    if (formData.imageUrl) {
      submitData.append("imageUrl", formData.imageUrl);
    }

    const response = await fetch(`${API_BASE}/api/services/admin`, {
      method: "POST",
      body: submitData,
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message || "Failed to create service.");
      return;
    }

    toast.success("Service added successfully.");

    setFormData({
      title: "",
      category: "Hair",
      price: "",
      imageUrl: "",
      description: "",
      isActive: true,
      isFeatured: false,
    });

    setImageFile(null);
    setImagePreview("");

    fetchServices();
  } catch (error) {
    toast.error("Server error. Service was not added.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-black uppercase italic text-gray-900 md:text-3xl">
            Services Manager
          </h2>
          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.22em] text-gray-400 md:text-xs md:tracking-widest">
            Add gallery looks, service photos, prices and categories
          </p>
        </div>

        <form
          onSubmit={handleCreateService}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <input
            type="text"
            placeholder="Service Title"
            className="settings-input"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />

          <select
            className="settings-input"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            required
          >
            <option value="Hair">Hair</option>
            <option value="Nails">Nails</option>
            <option value="Skin">Skin</option>
            <option value="Makeup">Makeup</option>
            <option value="Lashes">Lashes</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="number"
            placeholder="Price e.g. 4500"
            className="settings-input"
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
            required
          />

          <div className="md:col-span-2">
  <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-pink-400">
    Service Image
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="w-full rounded-[1.4rem] border border-dashed border-pink-200 bg-pink-50/40 p-4 text-sm font-bold text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-black file:px-5 file:py-2 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:text-white hover:file:bg-pink-500"
  />

  <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
    Upload from phone/laptop. Image will be stored in Cloudinary automatically.
  </p>

  {imagePreview && (
    <div className="mt-4 overflow-hidden rounded-[2rem] border border-gray-100 bg-gray-50">
      <img
        src={imagePreview}
        alt="Preview"
        className="h-64 w-full object-cover"
      />
    </div>
  )}

  <input
    type="text"
    placeholder="Optional: paste Cloudinary URL instead"
    className="settings-input mt-4"
    value={formData.imageUrl}
    onChange={(e) => handleChange("imageUrl", e.target.value)}
  />
</div>

          <textarea
            placeholder="Short Description"
            className="settings-input min-h-[110px] resize-none md:col-span-2"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />

          <div className="flex flex-col gap-3 rounded-[1.4rem] bg-gray-50 p-4 md:col-span-2">
            <label className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-600">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleChange("isActive", e.target.checked)}
              />
              Active on website
            </label>

            <label className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-600">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => handleChange("isFeatured", e.target.checked)}
              />
              Featured service
            </label>
          </div>

          <div className="md:col-span-2 md:flex md:justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-black px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-pink-500 disabled:opacity-60 md:w-auto"
            >
              {isLoading ? "Adding..." : "Add Service"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm md:p-8">
        <h3 className="mb-6 text-xl font-black uppercase italic text-gray-900">
          Current Services
        </h3>

        {services.length === 0 ? (
          <p className="text-sm font-bold text-gray-400">
            No services added yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <div
                key={service._id}
                className="overflow-hidden rounded-[2rem] border border-gray-100 bg-gray-50"
              >
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="h-56 w-full object-cover"
                />

                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-pink-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-pink-500">
                      {service.category}
                    </span>

                    <span className="text-xs font-black text-gray-500">
                      KES {service.price}
                    </span>
                  </div>

                  <h4 className="text-sm font-black uppercase tracking-wide text-gray-900">
                    {service.title}
                  </h4>

                  {service.description && (
                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      {service.description}
                    </p>
                  )}

                  <div className="mt-4 flex gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                        service.isActive
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {service.isActive ? "Active" : "Hidden"}
                    </span>

                    {service.isFeatured && (
                      <span className="rounded-full bg-black px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesManagerTab;