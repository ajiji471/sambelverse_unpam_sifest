import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import { TbLogout } from "react-icons/tb";


// Menggunakan import.meta.env untuk mengambil environment variable di Vite
const API_URL = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const { isLoggedIn, userId, login, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [notification, setNotification] = useState({ visible: false, message: "", type: "" });
  const [totalTagihan, setTotalTagihan] = useState(null);
  const [totalDeposit, setTotalDeposit] = useState(null);

  useEffect(() => {
    if (userId) {
      fetch(`${API_URL}/getUserName.php?id=${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setUserName(data.name);
          } else {
            console.error("Failed to fetch user name:", data.message);
          }
        })
        .catch((error) => console.error("Error fetching user name:", error));
      fetch(`${API_URL}/total_tagihan.php?id_user=${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setTotalTagihan(data.status === "success" ? data.total : "Data tidak tersedia");
        })
        .catch((error) => console.error("Error fetching total tagihan:", error));

      fetch(`${API_URL}/invoices_deposit.php?user_id=${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setTotalDeposit(data.status === "success" ? data.deposit_id : "Data tidak tersedia");
        })
        .catch((error) => console.error("Error fetching deposit:", error));
    }
  }, [userId]);


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setNotification({
          visible: true,
          message: "Login successful! Welcome back.",
          type: "success",
        });
        login(data.token, data.id);
        setIsLoginModalOpen(false);
      } else {
        setNotification({
          visible: true,
          message: data.message || "Login failed. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      setNotification({
        visible: true,
        message: "An error occurred. Please try again later.",
        type: "error",
      });
    } finally {
      setTimeout(() => {
        setNotification({ visible: false, message: "", type: "" });
      }, 3000);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <h1 className="text-xl text-center font-bold py-2">Sambelverse</h1>
      <div className="flex justify-between items-center">
        {/* <div className="px-0 w-md">

      <FaUserCircle />
      </div> */}
        {isLoggedIn ? (
          <>
            <div className="flex flex-col justify-center items-start">
              <div className="flex flex-row content-center items-start">

                <span>
                  {userName ? userName.slice(0, 10) + (userName.length > 10 ? "..." : "") : "Loading..."}
                </span>
              </div>
              <Link to="/pembayaran" className='text-blue-500 '>
              <span className="text-sm text-orange-400">
                Tagihan: {totalTagihan !== null ? `Rp. ${new Intl.NumberFormat("id-ID").format(totalTagihan)}` : "-"}
              </span>
              </Link>
              <span className="text-sm text-green-400">
                Deposit: {totalDeposit !== null ? `Rp. ${new Intl.NumberFormat("id-ID").format(totalDeposit)}` : "-"}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <button
                onClick={logout}
                className="mt-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded shadow-md transition-shadow duration-300"
              >
                <TbLogout />
              </button>

            </div>

          </>
        ) : (
          <>
          <div className="flex items-center space-x-4">

          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/register"
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded shadow-md transition-shadow duration-300"
              >
              Register
            </Link>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded shadow-md transition-shadow duration-300"
              >
              Login
            </button>
          </div>
              </>
        )}
      </div>

      {notification.visible && (
        <div
          className={`fixed z-50 top-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded shadow-md text-sm transition-opacity duration-300
            ${notification.type === "success"
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700"
            }
          `}
        >
          <div className="flex items-center">
            {notification.type === "success" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-700 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-700 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <p>{notification.message}</p>
          </div>
        </div>
      )}

      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-50 flex justify-center items-center ">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-80  z-[10]">
            <h2 className="text-lg font-bold mb-4">Login</h2>
            {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-900">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-black w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-900">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-black w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded shadow-md transition-shadow duration-300"
              >
                Login
              </button>
            </form>
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="mt-4 w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded shadow-md transition-shadow duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
