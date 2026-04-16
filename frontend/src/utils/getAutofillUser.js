export const getAutofillUser = async () => {
  const token = localStorage.getItem("userToken");

  if (!token) return null;

  try {
    const res = await fetch("http://localhost:5001/api/profile/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return null;

    const data = await res.json();

    return {
      name: data?.profile?.name || "",
      email: data?.profile?.email || "",
      phone: data?.profile?.phone || "",
    };
  } catch (error) {
    console.error("Autofill user fetch failed:", error);
    return null;
  }
};