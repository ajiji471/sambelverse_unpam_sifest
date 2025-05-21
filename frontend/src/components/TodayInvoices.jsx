import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const TodayInvoices = () => {
  const formatDate = (dateStr) => {
    const bulanIndonesia = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const date = new Date(dateStr);
    return `${date.getDate()} ${bulanIndonesia[date.getMonth()]} ${date.getFullYear()}`;
  };

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [invoices, setInvoices] = useState([]);
  const [userNames, setUserNames] = useState({});

  useEffect(() => {
    fetchInvoices();
  }, [date]);

  const fetchInvoices = async () => {
    let url = `${API_URL}/list-invoice.php?date=${date}`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
        fetchUserNames(data);
      } else {
        console.error("Error fetching invoices");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchUserNames = async (invoices) => {
    const userIds = [...new Set(invoices.map((invoice) => invoice.user_id))];
    const newUserNames = { ...userNames };
    for (const userId of userIds) {
      if (!newUserNames[userId]) {
        try {
          const response = await fetch(`${API_URL}/getUserName.php?id=${userId}`);
          const data = await response.json();
          newUserNames[userId] = data.success ? data.name : "Unknown";
        } catch (error) {
          console.error("Error fetching user name:", error);
          newUserNames[userId] = "Error";
        }
      }
    }
    setUserNames(newUserNames);
  };

  const renderCards = (data, title) => (
    <div className="mb-8">
      <h2 className="text-m font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.length > 0 ? (
          data.map((invoice) => (
            <div key={invoice.id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
              <h3 className="font-bold text-sm">{userNames[invoice.user_id] || "Loading..."}</h3>
              <p className="text-gray-600 mt-2">{invoice.pesanan}</p>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">Tidak ada data ditemukan</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4 text-center">List Pesanan: {formatDate(date)}</h1>
      <div className="flex flex-wrap gap-4 mb-8">
        <label className="flex flex-col">
          <span className="text-sm font-medium mb-1">Telusuri:</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </label>
      </div>
      {renderCards(invoices.filter((i) => i.kategori === "siang"), "Siang")}
      {renderCards(invoices.filter((i) => i.kategori === "sore"), "Sore")}
    </div>
  );
};

export default TodayInvoices;
