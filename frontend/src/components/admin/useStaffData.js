import { useEffect, useState } from "react";

const STAFF_API = "http://localhost:5001/api/staff";

const useStaffData = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [staffError, setStaffError] = useState("");

  const fetchStaff = async () => {
    try {
      setLoadingStaff(true);
      setStaffError("");

      const res = await fetch(STAFF_API);
      const data = await res.json();

      setStaffMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
      setStaffError("Failed to load staff.");
    } finally {
      setLoadingStaff(false);
    }
  };

  const deleteStaff = async (id) => {
    const token = localStorage.getItem("adminToken");

    return fetch(`${STAFF_API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const updateStaff = async (id, payload) => {
    const token = localStorage.getItem("adminToken");

    return fetch(`${STAFF_API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  };

  const createStaff = async (payload) => {
  const token = localStorage.getItem("adminToken");

  return fetch(STAFF_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
};

  useEffect(() => {
    fetchStaff();
  }, []);

 return {
  staffMembers,
  loadingStaff,
  staffError,
  fetchStaff,
  deleteStaff,
  updateStaff,
  createStaff,
};
};

export default useStaffData;