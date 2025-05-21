import React, { useState, useEffect } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import MyMenuCard from "./MyMenuCard";
import Myfooter from "./Myfooter";
import { FaHome } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const MenuList = () => {
    const [menus, setMenus] = useState([]);
    const navigate = useNavigate(); // Menggunakan navigate untuk navigasi

    useEffect(() => {
        axios.get(`${API_URL}/menu.php?action=menus-today`)
            .then(response => setMenus(response.data));
    }, []);

    const handleHomeClick = () => {
        // Navigasi ke halaman Home dan refresh
        navigate(0); // Refresh page menggunakan navigate(0)
    };

    return (
        <div>
            <Navbar />
            <div className="linkMenu flex items-center justify-start p-4 bg-gray-800 shadow-md">
                <button 
                    onClick={handleHomeClick}
                    className="bg-cyan-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-cyan-600 hover:shadow-cyan-600/50 transition-all duration-300"
                >
                    <FaHome />
                </button>
            </div>
            <MyMenuCard />
            <Myfooter />
        </div>
    );
};

export default MenuList;
