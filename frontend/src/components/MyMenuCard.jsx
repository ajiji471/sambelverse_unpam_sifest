import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext"; // Ambil context auth untuk user_id

const API_URL = import.meta.env.VITE_API_URL;

const MyMenuCard = () => {
  // Ambil user_id dari AuthContext
  const { userId } = useAuth(); // Pastikan useAuth mengembalikan userId yang valid

  // State untuk menu
  const [menus, setMenus] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [checked, setChecked] = useState({});
  const [stok, setStok] = useState({}); // Untuk menyimpan stok
  const [totalPrice, setTotalPrice] = useState(0);
  const [invoiceText, setInvoiceText] = useState("");
  const [totalDeposit, setTotalDeposit] = useState(null);
  const [remainingDeposit, setRemainingDeposit] = useState(null);
  const [priceSementara, setPriceSementara] = useState(null);

  // State untuk invoice
  const [kategori, setKategori] = useState("siang");
  const [purchaseDate, setPurchaseDate] = useState("");

  // Ambil data menu hari ini dari API
  useEffect(() => {
    axios
      .get(`${API_URL}/menu.php?action=menus-today`)
      .then((response) => {
        setMenus(response.data);
        const initialQuantity = {};
        const initialChecked = {};
        const initialStok = {}; // Tambahkan objek untuk stok
        response.data.forEach((menu) => {
          initialQuantity[menu.kode_menu] = 1; // Default quantity adalah 1
          initialChecked[menu.kode_menu] = false; // Default tidak tercentang
          initialStok[menu.kode_menu] = menu.stok || 0; // Set stok sesuai data API
        });
        setQuantity(initialQuantity);
        setChecked(initialChecked);
        setStok(initialStok); // Set stok ke state
      })
      .catch((error) => console.error("Error fetching menu:", error));

      fetch(`${API_URL}/invoices_deposit.php?user_id=${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setTotalDeposit(data.status === "success" ? data.deposit_id : "Data tidak tersedia");
        })
        .catch((error) => console.error("Error fetching deposit:", error));
  }, []);

  // Fungsi untuk menambah jumlah menu
  const incrementQuantity = (kode_menu) => {
    setQuantity((prevQuantity) => ({
      ...prevQuantity,
      [kode_menu]: (prevQuantity[kode_menu] || 1) + 1,
    }));
  };

  // Fungsi untuk mengurangi jumlah menu
  const decrementQuantity = (kode_menu) => {
    setQuantity((prevQuantity) => ({
      ...prevQuantity,
      [kode_menu]: prevQuantity[kode_menu] > 1 ? prevQuantity[kode_menu] - 1 : 1,
    }));
  };

  // Fungsi untuk menangani perubahan checkbox
  const handleCheckboxChange = (kode_menu) => {
    setChecked((prevChecked) => ({
      ...prevChecked,
      [kode_menu]: !prevChecked[kode_menu],
    }));
  };

  // Mengupdate total harga dan invoice setiap kali ada perubahan quantity atau checkbox
  useEffect(() => {
    let total = 0;
    let invoice = [];
    let sisaDeposit = totalDeposit; // Saldo awal deposit
    let hargaSementara = 0;
  
    menus.forEach((menu) => {
      const isChecked = checked[menu.kode_menu];
      const itemQuantity = quantity[menu.kode_menu];
      if (isChecked) {
        const menuTotal = menu.hrga_menu * itemQuantity;
  
        if (sisaDeposit > 0) {
          // Jika deposit cukup untuk menutupi harga menu
          if (sisaDeposit >= menuTotal) {
            sisaDeposit -= menuTotal; // Kurangi deposit sesuai harga menu
          } else {
            // Jika deposit tidak cukup, gunakan deposit habis, sisanya ditambahkan ke total
            total += (menuTotal - sisaDeposit);
            sisaDeposit = 0;
          }
        } else {
          // Jika deposit sudah habis, langsung tambahkan harga menu ke total
          total += menuTotal;
        }
  
        hargaSementara += menuTotal;
        invoice.push(`${menu.nama_menu} x ${itemQuantity}`);
      }
    });
  
    setTotalPrice(Math.max(total, 0));  // Pastikan totalPrice tidak negatif
    setInvoiceText(invoice.join(", "));
    setRemainingDeposit(sisaDeposit);  // Set sisa deposit
    setPriceSementara(hargaSementara); // set price sementara
  }, [checked, quantity, menus, totalDeposit]);
  
  
  
  // Handle perubahan kategori waktu (siang atau sore)
  const handleKategoriChange = (event) => {
    setKategori(event.target.value);
  };

  // Handle konfirmasi invoice
  const handleConfirmClick = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    setPurchaseDate(currentDate);

    // Pastikan userId ada sebelum mengirimkan data
    if (userId) {
      const invoiceData = {
        user_id: userId, // Ambil user_id dari context
        pesanan: invoiceText,
        kategori: kategori,
        total_tagihan: totalPrice,
        deposit_id:remainingDeposit,
        keterangan: "belum lunas", // Status bisa disesuaikan
      };

      // Tampilkan data invoice di console untuk memastikan
      console.log("Data yang akan dikirim ke server:", invoiceData);

      axios
        .post(`${API_URL}/invoices.php`, invoiceData)
        .then((response) => {
          console.log("Invoice created:", response.data);
          alert("Invoice created successfully with ID: " + response.data.invoice_id);
          setKategori("siang");
          setPurchaseDate("");
        })
        .catch((error) => {
          console.error("There was an error creating the invoice:", error);
          alert("Failed to create invoice. Try again!");
        });
    } else {
      alert("User is not authenticated!");
    }
  };

  return (
    <>
      <div className="container mx-auto p-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-8">Menu Hari Ini</h1>

        {/* Menu Section */}
        {menus.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menus.map((menu) => (
              <div
              key={menu.kode_menu}
              className={`menu-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 ${stok[menu.kode_menu] === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {/* Gambar Menu */}
              <div className="overflow-hidden relative">
                <img
                  src={menu.gambar}
                  alt={menu.nama_menu}
                  className="w-full h-40 object-cover"
                />
                {stok[menu.kode_menu] === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">Menu Habis</span>
                  </div>
                )}
                <div className=" text-white text-md text-center font-semibold px-2 py-1 rounded">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < menu.rating ? "text-yellow-400" : "text-gray-400"}>★</span>
                  ))}
                </div>
              </div>
              <div className="p-4">
                {/* Nama Menu */}
                <p className="text-lg font-bold text-gray-800 mb-2">{menu.nama_menu}</p>
                {/* Harga */}
                <p className="text-xl font-semibold text-green-600 mb-4">
                  Rp {new Intl.NumberFormat("id-ID").format(menu.hrga_menu)}
                </p>
                {/* Kuantitas */}
                <div className="flex items-center justify-between mb-4">
                  <div className="menu-quantity flex items-center space-x-2">
                    <button
                      onClick={() => decrementQuantity(menu.kode_menu)}
                      disabled={stok[menu.kode_menu] === 0} // Disable jika stok 0
                      className={`bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ${stok[menu.kode_menu] === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      -
                    </button>
                    <span className="text-lg font-medium">{quantity[menu.kode_menu]}</span>
                    <button
                      onClick={() => incrementQuantity(menu.kode_menu)}
                      disabled={stok[menu.kode_menu] === 0} // Disable jika stok 0
                      className={`bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 ${stok[menu.kode_menu] === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      +
                    </button>
                  </div>
                  {/* stok */}
                  <label>tersedia: {stok[menu.kode_menu] || 0}</label> {/* Menampilkan stok */}
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={checked[menu.kode_menu] || false}
                    onChange={() => handleCheckboxChange(menu.kode_menu)}
                    disabled={stok[menu.kode_menu] === 0} // Disable checkbox jika stok 0
                    className="w-5 h-5 text-blue-500 focus:ring focus:ring-blue-300 rounded"
                  />
                </div>
              </div>
            </div>
            
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No menu set for today.</p>
        )}

        {/* Invoice Section */}
        <div className="invoice bg-gray-100 p-6 mt-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Invoice</h2>
          <div id="invoice-content" className="mb-4">
            <p className="text-gray-700">{invoiceText || "No items selected."}</p>
          </div>
          {/* Kategori Invoice */}
          <div className="kategoriInvoice mb-4">
            <label className="block font-medium text-gray-700 mb-2">pengambilan</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="siang"
                  checked={kategori === "siang"}
                  onChange={handleKategoriChange}
                  required
                  className="form-radio text-blue-500"
                />
                <span>Siang</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="sore"
                  checked={kategori === "sore"}
                  onChange={handleKategoriChange}
                  required
                  className="form-radio text-blue-500"
                />
                <span>Sore</span>
              </label>
            </div>
          </div>

          <p className="text-sm font-semibold text-green-800 mb-2">
            Deposit: Rp {remainingDeposit}
          </p>
          <p className="text-md font-semibold text-gray-800 mb-2">
            Total Harga: Rp {priceSementara}
          </p>
          <p className="text-md font-semibold text-gray-800 mb-2">
            Total Bayar: Rp {totalPrice.toLocaleString("id-ID")}
          </p>
          {/* Tanggal Pembelian */}
          <p className="text-gray-700 mb-4">Purchase Date: {purchaseDate}</p>
          {/* Tombol Konfirmasi */}
          <button
            onClick={handleConfirmClick}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </>
  );
};

export default MyMenuCard;
