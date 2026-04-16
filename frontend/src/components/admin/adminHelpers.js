export const getAdminBookingStats = (bookings, searchTerm, filter) => {
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const todayDate = new Date().toISOString().split("T")[0];

  const totalRevenue = safeBookings
    .filter((b) => b.completed)
    .reduce((sum, b) => sum + (Number(b.price) || 0), 0);

  const todayRevenue = safeBookings
    .filter((b) => b.completed && b.date === todayDate)
    .reduce((sum, b) => sum + (Number(b.price) || 0), 0);

  const todayCount = safeBookings.filter((b) => b.date === todayDate).length;

  const filteredBookings = safeBookings.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm);

    if (filter === "pending") return !b.completed && matchesSearch;
    if (filter === "completed") return b.completed && matchesSearch;
    return matchesSearch;
  });

  const clientDatabase = safeBookings.reduce((acc, curr) => {
    const clientKey = curr.phone;

    if (!acc[clientKey]) {
      acc[clientKey] = {
        name: curr.name,
        email: curr.email || "Walk-in",
        phone: curr.phone,
        totalVisits: 0,
        totalSpent: 0,
        lastVisit: curr.date,
      };
    }

    acc[clientKey].totalVisits += 1;

    if (curr.completed) {
      acc[clientKey].totalSpent += Number(curr.price) || 0;
    }

    if (new Date(curr.date) > new Date(acc[clientKey].lastVisit)) {
      acc[clientKey].lastVisit = curr.date;
    }

    return acc;
  }, {});

  const uniqueClients = Object.values(clientDatabase);

  return {
    todayDate,
    safeBookings,
    totalRevenue,
    todayRevenue,
    todayCount,
    filteredBookings,
    uniqueClients,
  };
};