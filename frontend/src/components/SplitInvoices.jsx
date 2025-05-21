import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const SplitInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [keterangan, setKeterangan] = useState('');
  const [deposits, setDeposits] = useState({});

  const fetchInvoices = async () => {
    let url = `${API_URL}/list-invoice.php?`;
    if (date) url += `date=${date}&`;
    if (keterangan) url += `keterangan=${keterangan}&`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);

        // Memuat deposit untuk setiap user_id
        data.forEach((invoice) => {
          fetchDeposit(invoice.user_id);
        });
      } else {
        console.error('Error fetching invoices');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchDeposit = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/deposit.php?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setDeposits((prevDeposits) => ({
            ...prevDeposits,
            [userId]: data.deposit,
          }));
        } else {
          setDeposits((prevDeposits) => ({
            ...prevDeposits,
            [userId]: 'N/A',
          }));
        }
      } else {
        console.error('Error fetching deposit');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [date, keterangan]);

  // Filter invoices into two categories
  const siangInvoices = invoices.filter((invoice) => invoice.kategori === 'siang');
  const soreInvoices = invoices.filter((invoice) => invoice.kategori === 'sore');

  const renderTable = (data, title) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse w-full text-left border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">User ID</th>
              <th className="border border-gray-300 px-4 py-2">Pesanan</th>
              <th className="border border-gray-300 px-4 py-2">Kategori</th>
              <th className="border border-gray-300 px-4 py-2">Total Tagihan</th>
              <th className="border border-gray-300 px-4 py-2">Tanggal Pembelian</th>
              <th className="border border-gray-300 px-4 py-2">Deposit ID</th>
              <th className="border border-gray-300 px-4 py-2">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-blue-50">
                  <td className="border border-gray-300 px-4 py-2">{invoice.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{invoice.user_id}</td>
                  <td className="border border-gray-300 px-4 py-2">{invoice.pesanan}</td>
                  <td className="border border-gray-300 px-4 py-2">{invoice.kategori}</td>
                  <td className="border border-gray-300 px-4 py-2">{invoice.total_tagihan}</td>
                  <td className="border border-gray-300 px-4 py-2">{invoice.purchase_date}</td>
                  <td className="border border-gray-300 px-4 py-2">{deposits[invoice.user_id] || 'Loading...'}</td>
                  <td className="border border-gray-300 px-4 py-2">{invoice.keterangan}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="border border-gray-300 px-4 py-2 text-center">Tidak ada data ditemukan</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">List Invoice</h1>
      <div className="flex flex-wrap gap-4 mb-8">
        <label className="flex flex-col">
          <span className="text-sm font-medium mb-1">Tanggal:</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium mb-1">Keterangan:</span>
          <select
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">All Keterangan</option>
            <option value="lunas">Lunas</option>
            <option value="belum lunas">Belum Lunas</option>
          </select>
        </label>

        <button
          onClick={fetchInvoices}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Terapkan Filter
        </button>
      </div>

      {renderTable(siangInvoices, 'Kategori Siang')}
      {renderTable(soreInvoices, 'Kategori Sore')}
    </div>
  );
};

export default SplitInvoices;
