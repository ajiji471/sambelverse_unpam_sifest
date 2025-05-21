import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";
import Navbar from "./Navbar";
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const Pembayaran = () => {
  const { userId } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false); // loading saat bayar

  useEffect(() => {
    const fetchTagihan = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/tagihan/getDataTagihan.php?user_id=${userId}`
        );
        if (response.data.status === "success") {
          setData(response.data.data);
        } else {
          console.error(response.data.message);
          setData(null);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchTagihan();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data) {
      alert("Data tagihan belum tersedia.");
      return;
    }

    setPayLoading(true);
    try {
      const response = await axios.post(`${API_URL}/paymentGateway.php`, {
        total: data.total,
        name: data.name,
        email: data.email,
        phone: data.whatsapp,
        userId: data.id, // sesuaikan dengan key yang benar dari backend
      });

      const snapToken = response.data.token;
      console.log("Snap Token:", snapToken);

      window.snap.pay(snapToken, {
        onSuccess: function (result) {
          console.log("Pembayaran sukses", result);
          alert("Pembayaran berhasil!");
          setPayLoading(false);
        },
        onPending: function (result) {
          console.log("Menunggu pembayaran", result);
          alert("Pembayaran masih tertunda.");
          setPayLoading(false);
        },
        onError: function (result) {
          console.error("Terjadi kesalahan", result);
          alert("Terjadi error saat pembayaran.");
          setPayLoading(false);
        },
        onClose: function () {
          console.log("Modal ditutup sebelum selesai");
          alert("Kamu menutup popup tanpa menyelesaikan pembayaran.");
          setPayLoading(false);
        }
      });
    } catch (error) {
      console.error("Gagal mendapatkan Snap Token:", error.response?.data || error.message);
      alert("Terjadi kesalahan saat memulai pembayaran.");
      setPayLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Memuat data...</div>;
  if (!data) return <div className="text-center py-10 text-red-500">Data tidak ditemukan.</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Halaman Pembayaran</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Nama</label>
            <input
              type="text"
              value={data.name}
              disabled
              className="w-full border-gray-300 rounded-md px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Email</label>
            <input
              type="text"
              value={data.email}
              disabled
              className="w-full border-gray-300 rounded-md px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">WhatsApp</label>
            <input
              type="text"
              value={data.whatsapp}
              disabled
              className="w-full border-gray-300 rounded-md px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Total Tagihan</label>
            <input
              type="text"
              value={`Rp ${parseFloat(data.total).toLocaleString("id-ID")}`}
              disabled
              className="w-full border-gray-300 rounded-md px-3 py-2 bg-gray-100 font-semibold text-red-600"
            />
          </div>
          <button
            type="submit"
            disabled={payLoading}
            className={`w-full py-2 px-4 rounded-md transition text-white ${
              payLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {payLoading ? "Memproses Pembayaran..." : "Bayar"}
          </button>
        </form>
      <Link to="/" className='text-blue-500'> Kembali ke Halaman</Link>
      </div>
    </>
  );
};

export default Pembayaran;
