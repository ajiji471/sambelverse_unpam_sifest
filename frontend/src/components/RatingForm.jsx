import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactStars from 'react-stars';
import { useAuth } from './AuthContext';
const API_URL = import.meta.env.VITE_API_URL;

function RatingForm() {
  const { userId } = useAuth(); // Mengambil userId dari AuthContext
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState('');
  const [rating, setRating] = useState(0);
  const [testimoni, setTestimoni] = useState('');

  useEffect(() => {
    // Mengambil daftar menu dari API
    axios.get(`${API_URL}/menu.php?action=all-menus`)
      .then(response => {
        setMenus(response.data); // Pastikan response adalah array menu
      })
      .catch(error => console.error('Error fetching menu:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Kirim data rating ke server
    try {
      const response = await axios.post(`${API_URL}/create_rating.php`, {
        kode_menu: selectedMenu,
        user_id: userId, // Menggunakan userId dari AuthContext
        rating: rating,
        testimoni: testimoni
      });
      console.log(response.data);
      alert(response.data.message);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <div className="container  mx-auto bg-white p-5 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Ulasan</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          
          <select
            id="kode_menu"
            value={selectedMenu}
            onChange={(e) => setSelectedMenu(e.target.value)}
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">--Pilih Menu--</option>
            {menus.map((menu) => (
              <option key={menu.kode_menu} value={menu.kode_menu}>
                {menu.nama_menu}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="rating" className="block text-lg font-medium text-gray-700">Rating:</label>
          <ReactStars
            count={5}
            value={rating}
            onChange={setRating}
            size={24}
            half={false}
            color2={'#ffd700'} // Warna bintang terpilih
          />
        </div>

        <div>
          <label htmlFor="testimoni" className="block text-lg font-medium text-gray-700">Testimoni:</label>
          <textarea
            id="testimoni"
            value={testimoni}
            onChange={(e) => setTestimoni(e.target.value)}
            placeholder="Tulis testimoni Anda"
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-200"
        >
          Kirim Rating
        </button>
      </form>
    </div>
  );
}

export default RatingForm;
