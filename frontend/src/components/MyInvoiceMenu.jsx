import React, { useState } from "react";
import { useInvoice } from "./InvoiceContext"; // Ambil context invoice
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const MyInvoiceMenu = () => {
  const { invoiceText, totalPrice } = useInvoice(); // Ambil data dari context invoice
  const [user_id, setUserId] = useState("");
  const [kategori, setKategori] = useState("siang");
  const [purchaseDate, setPurchaseDate] = useState("");

  const handleKategoriChange = (event) => {
    setKategori(event.target.value);
  };

  const handleConfirmClick = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    setPurchaseDate(currentDate);

    const invoiceData = {
      user_id: 1, // Sesuaikan dengan ID user
      pesanan: invoiceText,
      kategori: kategori,
      total_tagihan: totalPrice,
      keterangan: "belum lunas",
    };

    axios
      .post(`${API_URL}/invoices.php`, invoiceData)
      .then((response) => {
        console.log("Invoice created:", response.data);
        alert("Invoice created successfully with ID: " + response.data.invoice_id);
        setUserId("");
        setKategori("siang");
        setPurchaseDate("");
      })
      .catch((error) => {
        console.error("There was an error creating the invoice:", error);
        alert("Failed to create invoice. Try again!");
      });
  };

  return (
    <>
      <div className="invoice">
        <h2>Invoice</h2>
        <div id="invoice-content">
          <p>{invoiceText || "No items selected."}</p>
        </div>
        <div className="kategoriInvoice">
          <label>Time of the day</label>
          <div>
            <input
              type="radio"
              value="siang"
              checked={kategori === "siang"}
              onChange={handleKategoriChange}
              required
            />
            <label>Siang</label>
          </div>
          <div>
            <input
              type="radio"
              value="sore"
              checked={kategori === "sore"}
              onChange={handleKategoriChange}
              required
            />
            <label>Sore</label>
          </div>
        </div>
        <p>Total Price: Rp {totalPrice.toLocaleString("id-ID")}</p>
        <p>Purchase Date: {purchaseDate}</p>
        <button onClick={handleConfirmClick}>Confirm</button>
      </div>
    </>
  );
};

export default MyInvoiceMenu;
