import {
  API_BASE,
  AUTH_API,
  USERS_API,
  CONTACT_API,
  REVIEWS_API,
} from "./adminConfig";
import { getAdminToken } from "./adminAuth";

export const adminLoginRequest = async (email, password) => {
  const response = await fetch(`${AUTH_API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  return { response, data };
};

export const fetchBookingsRequest = async () => {
  const token = getAdminToken();

  const res = await fetch(`${API_BASE}/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.json();
};

export const addBookingRequest = async (newEntry) => {
  const token = getAdminToken();

  const res = await fetch(`${API_BASE}/reserve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newEntry),
  });

  return res.json();
};

export const updateBookingRequest = async (id, payload) => {
  const token = getAdminToken();

  const res = await fetch(`${API_BASE}/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return res;
};

export const deleteBookingRequest = async (id) => {
  const token = getAdminToken();

  return fetch(`${API_BASE}/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchInquiriesRequest = async () => {
  const token = getAdminToken();

  const res = await fetch(`${CONTACT_API}/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.json();
};

export const sendInquiryReplyRequest = async (id, replyText) => {
  const token = getAdminToken();

  return fetch(`${CONTACT_API}/reply/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ replyText }),
  });
};

export const fetchReviewsRequest = async () => {
  const res = await fetch(REVIEWS_API);
  return res.json();
};

export const updateReviewRequest = async (reviewId, payload) => {
  return fetch(`${REVIEWS_API}/${reviewId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const fetchClientsRequest = async () => {
  const token = getAdminToken();

  const res = await fetch(USERS_API, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.json();
};

export const deleteUserRequest = async (id) => {
  const token = getAdminToken();

  return fetch(`${USERS_API}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};