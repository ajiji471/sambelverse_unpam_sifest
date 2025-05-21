import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;
const ListInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [kategori, setKategori] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [deposits, setDeposits] = useState({}); // Menyimpan nilai deposit per user_id

  const fetchInvoices = async () => {
    let url = `${API_URL}/list-invoice.php?`;
    if (date) url += `date=${date}&`;
    if (kategori) url += `kategori=${kategori}&`;
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
  }, [date, kategori, keterangan]);

  return (
    <div>
      <h1>List Invoice</h1>
      <div>
        <label>
          Tanggal:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label>
          Kategori:
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
          >
            <option value="">All Kategori</option>
            <option value="siang">Siang</option>
            <option value="sore">Sore</option>
          </select>
        </label>

        <label>
          Keterangan:
          <select
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
          >
            <option value="">All Keterangan</option>
            <option value="lunas">Lunas</option>
            <option value="belum lunas">Belum Lunas</option>
          </select>
        </label>

        <button onClick={fetchInvoices}>Terapkan Filter</button>
      </div>

      <table border="1" cellPadding="10" cellSpacing="0" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Pesanan</th>
            <th>Kategori</th>
            <th>Total Tagihan</th>
            <th>Tanggal Pembelian</th>
            <th>Deposit ID</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>{invoice.user_id}</td>
                <td>{invoice.pesanan}</td>
                <td>{invoice.kategori}</td>
                <td>{invoice.total_tagihan}</td>
                <td>{invoice.purchase_date}</td>
                <td>{deposits[invoice.user_id] || 'Loading...'}</td>
                <td>{invoice.keterangan}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">Tidak ada data ditemukan</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListInvoices;
