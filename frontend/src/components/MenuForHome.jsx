import React, { useState, useEffect } from "react";
import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL;

const MenuForHome = () => {
    const [menus, setMenus] = useState([]);
   

    useEffect(() => {
        axios.get(`${API_URL}/menu.php?action=menus-today`)
            .then(response => setMenus(response.data));
    }, []);

    return (
        <div className="container mx-auto p-4 -z-20">
            <h1 className="text-2xl font-bold text-center mb-6">Menu hari ini</h1>
            {menus.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 -z-50">
                    {menus.map((menu) => (
                        <div
                            className="relative bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-200 -z-30"
                            key={menu.kode_menu}
                        >
                            {/* Gambar dengan zoom */}
                            <div className="overflow-hidden">
                                <img
                                    className="w-full h-40 object-cover object-center"
                                    src={menu.gambar}
                                    alt={menu.nama_menu}
                                />
                                {/* Rating bintang di pojok kiri atas */}
                                <div className="absolute top-2 left-2 bg-black bg-opacity-20 text-white text-sm font-semibold px-2 py-1 rounded">
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <span key={i} className={i < menu.rating ? "text-yellow-400" : "text-gray-400"}>
                                            ★ 
                                        </span>
                                    ))}
                                </div>
                            </div>
                            {/* Informasi menu */}
                            <div className="p-4">
                                <p className="text-lg font-bold text-gray-800 mb-2">{menu.nama_menu}</p>
                                <p className="text-xl font-bold text-green-600 mb-2">Rp {new Intl.NumberFormat("id-ID").format(menu.hrga_menu)}</p>
                             
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600">No menu set for today.</p>
            )}
        </div>
    );
};

export default MenuForHome;