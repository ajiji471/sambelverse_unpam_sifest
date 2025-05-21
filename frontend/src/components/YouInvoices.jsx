import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; // Mengambil userId dari AuthContext
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;



const YouInvoices = () => {
  const { userId } = useAuth(); // Ambil userId dari AuthContext
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    axios
      .get(`${API_URL}/id_invoices.php?user_id=${userId}`)
      .then((response) => {
        console.log("Invoice data:", response.data); // Debugging
        setInvoices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching invoices:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4">Riwayat Transaksi</h2>

      {loading ? (
        <p className="text-gray-500">Loading invoices...</p>
      ) : invoices.length === 0 ? (
        <p className="text-gray-500">Tidak Ada Transaksi</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-white shadow-lg rounded-lg p-5 border border-gray-200"
            >
              <h3 className="text-sm font-semibold">Transaksi {invoice.purchase_date}</h3>
              <p className="text-sm text-gray-500">Pesanan: {invoice.pesanan} | {invoice.kategori}</p>
              <p className="text-sm text-gray-500">Total: Rp {invoice.total_tagihan.toLocaleString("id-ID")}</p>
              <p
                className={`text-sm font-bold ${
                  invoice.keterangan === "lunas" ? "text-green-600" : "text-red-600"
                }`}
              >
                Status: {invoice.keterangan}
              </p>
             
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YouInvoices;
