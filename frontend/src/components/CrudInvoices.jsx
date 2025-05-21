import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const CrudInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [users, setUsers] = useState({});
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    id: null,
    user_id: "",
    pesanan: "",
    kategori: "",
    total_tagihan: "",
    keterangan: "Lunas",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const apiUrl = `${API_URL}/crud_invoice.php`;

  // Fetch invoices data
  const fetchInvoices = async () => {
    try {
      const response = await axios.get(apiUrl);
      if (response.data && Array.isArray(response.data.data)) {
        setInvoices(response.data.data);
      } else {
        setInvoices([]);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setInvoices([]);
    }
  };

  // Fetch categories for the select dropdown (if needed later)
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-filter.php`);
      if (response.data && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  // Fetch user name by user_id
  const fetchUserName = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/getNameUser.php?user_id=${userId}`);
      if (response.data.status === "success") {
        setUsers(prevState => ({
          ...prevState,
          [userId]: response.data.user_name,
        }));
      } else {
        setUsers(prevState => ({
          ...prevState,
          [userId]: "User not found",
        }));
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
      setUsers(prevState => ({
        ...prevState,
        [userId]: "Error fetching user",
      }));
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Fetch user names for each invoice when invoices data is loaded
    invoices.forEach((invoice) => {
      if (!users[invoice.user_id]) {
        fetchUserName(invoice.user_id);
      }
    });
  }, [invoices]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form:", form);
    try {
      if (isEditing) {
        const response = await axios.put(`${apiUrl}?id=${form.id}`, form);
        console.log("Update response:", response);
      } else {
        const response = await axios.post(apiUrl, form);
        console.log("Create response:", response);
      }
      fetchInvoices();
      resetForm();
      setIsModalOpen(false); // Close modal after submit
    } catch (error) {
      console.error("Error saving invoice:", error);
      if (error.response) {
        console.error("Server error:", error.response.data);
      }
    }
  };

  const handleEdit = (invoice) => {
    setForm(invoice);
    setIsEditing(true);
    setIsModalOpen(true); // Open modal when editing
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}?id=${id}`);
      fetchInvoices();
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      user_id: "",
      pesanan: "",
      kategori: "siang",
      total_tagihan: "",
      keterangan: "Lunas",
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Invoices Management</h1>

      {/* Invoices Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              {/* Sticky Columns */}
              <th className="px-4 py-2  ">ID</th>
              <th className="px-4 py-2  ">User Id</th>
              <th className="px-4 py-2 sticky left-0 bg-gray-100 z-10">User Name</th>
              <th className="px-4 py-2">Pesanan</th>
              <th className="px-4 py-2">Kategori</th>
              <th className="px-4 py-2">Total Tagihan</th>
              <th className="px-4 py-2">Keterangan</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="bg-white border-b">
                  <td className="px-4 py-2  ">{invoice.id}</td>
                  <td className="px-4 py-2 ">{invoice.user_id}</td>
                  <td className="px-4 py-2 sticky left-0  bg-white">{users[invoice.user_id] || "Loading..."}</td>
                  <td className="px-4 py-2">{invoice.pesanan}</td>
                  <td className="px-4 py-2">{invoice.kategori}</td>
                  <td className="px-4 py-2">{invoice.total_tagihan}</td>
                  <td className="px-4 py-2">{invoice.keterangan}</td>
                  <td className="px-4 py-2 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                    <button
                      onClick={() => handleEdit(invoice)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded w-full sm:w-auto"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(invoice.id)}
                      className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded w-full sm:w-auto"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No invoices found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form for Editing Invoice */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 sm:w-full">
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Invoice" : "Add Invoice"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">User ID</label>
                <input
                  type="text"
                  name="user_id"
                  value={form.user_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="pesanan" className="block text-sm font-medium text-gray-700">Pesanan</label>
                <input
                  type="text"
                  name="pesanan"
                  value={form.pesanan}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="kategori" className="block text-sm font-medium text-gray-700">Kategori</label>
                <select
                  name="kategori"
                  value={form.kategori}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="siang">siang</option>
                  <option value="sore">sore</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="total_tagihan" className="block text-sm font-medium text-gray-700">Total Tagihan</label>
                <input
                  type="number"
                  name="total_tagihan"
                  value={form.total_tagihan}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700">Keterangan</label>
                <select
                  name="keterangan"
                  value={form.keterangan}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="Lunas">Lunas</option>
                  <option value="Belum Lunas">Belum Lunas</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded"
                >
                  {isEditing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudInvoices;
