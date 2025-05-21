import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AllMenu = () => {
    const [menus, setMenus] = useState([]);
    const [selectedMenus, setSelectedMenus] = useState([]);
    const [stokMenus, setStokMenus] = useState({});
    const [isFetching, setIsFetching] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch data menus saat komponen pertama kali dimuat
    useEffect(() => {
        setIsFetching(true);
        axios
            .get(`${API_URL}/menu.php?action=all-menus`)
            .then((response) => setMenus(response.data))
            .catch((error) => {
                const errorMessage =
                    error.response?.data?.message || "Failed to fetch menus. Please try again.";
                console.error("Error fetching menus:", errorMessage);
                alert(errorMessage);
            })
            .finally(() => setIsFetching(false));
    }, []);

    // Fungsi untuk menangani seleksi menu
    const handleMenuSelection = (menuId) => {
        setSelectedMenus((prev) =>
            prev.includes(menuId)
                ? prev.filter((id) => id !== menuId)
                : [...prev, menuId]
        );
    };

    // Fungsi untuk menangani perubahan stok
    const handleStokChange = (menuId, value) => {
        setStokMenus((prev) => ({
            ...prev,
            [menuId]: value,
        }));
    };

    // Fungsi untuk mengirimkan menu yang dipilih beserta stok
    const handleSubmit = () => {
        if (selectedMenus.length === 0) {
            alert("Please select at least one menu to set for today.");
            return;
        }

        const stokData = selectedMenus.map((menuId) => ({
            menu_id: menuId,
            stok: stokMenus[menuId] || 0, // Jika stok kosong, set default 0
        }));

        setIsSubmitting(true);
        axios
            .post(`${API_URL}/menu.php?action=set-menu-today`, {
                menu_ids: selectedMenus,
                stok: stokData,
            })
            .then(() => alert("Menu for today has been set!"))
            .catch((error) => {
                const errorMessage =
                    error.response?.data?.message || "Failed to set menu for today. Please try again.";
                console.error("Error setting menu:", errorMessage);
                alert(errorMessage);
            })
            .finally(() => setIsSubmitting(false));
    };

    // Komponen memoized untuk menghindari render ulang
    const MenuCard = React.memo(({ menu, isSelected, onToggle, stok, onStokChange }) => (
        <div className="relative bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-md overflow-hidden">
                    <img
                        src={menu.gambar}
                        alt={menu.nama_menu}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1">
                    <h2 className="text-lg font-semibold">{menu.nama_menu}</h2>
                    <p className="text-gray-600">Rp {new Intl.NumberFormat("id-ID").format(menu.hrga_menu)}</p>
                    <div className="flex items-center space-x-1">
                        <span className="text-yellow-500 text-sm">⭐</span>
                        <span className="text-gray-600 text-sm">{menu.rating}</span>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <label>
                    Stok:
                    <input
                        type="number"
                        value={stok}
                        onChange={(e) => onStokChange(menu.kode_menu, e.target.value)}
                        className="border rounded px-2 py-1"
                    />
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={onToggle}
                        className="form-checkbox text-blue-500 h-5 w-5 rounded focus:ring focus:ring-blue-300"
                    />
                    <span className="text-gray-700">Pilih Menu</span>
                </label>
            </div>
        </div>
    ));

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold text-center mb-4">All Menus</h1>

            {isFetching && (
                <div className="flex justify-center items-center mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                </div>
            )}

            <div className="cardMenuAll grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {isFetching
                    ? Array.from({ length: 6 }).map((_, index) => (
                          <div
                              key={index}
                              className="bg-gray-200 rounded-lg shadow-lg p-4 animate-pulse"
                          ></div>
                      ))
                    : menus.length > 0
                    ? menus.map((menu) => (
                          <MenuCard
                              key={menu.kode_menu}
                              menu={menu}
                              isSelected={selectedMenus.includes(menu.kode_menu)}
                              onToggle={() => handleMenuSelection(menu.kode_menu)}
                              stok={stokMenus[menu.kode_menu] || 0}
                              onStokChange={handleStokChange}
                          />
                      ))
                    : (
                        <p className="text-center text-gray-500">
                            No menus available.
                        </p>
                    )}
            </div>
            <div className="flex justify-center mt-6">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`bg-blue-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {isSubmitting ? "Processing..." : "Set Menu Today"}
                </button>
            </div>
        </div>
    );
};

export default AllMenu;
