import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Navbar from './Navbar';
import MenuForHome from './MenuForHome';
import AllMenuForHome from './AllMenuForHome';
import Myfooter from './Myfooter';
import YouInvoices from './YouInvoices';
import TodayInvoices from './TodayInvoices';
import RatingForm from './RatingForm';


const HomePage = ({ showLoginModal = false }) => {
  const { isLoggedIn } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(showLoginModal);
    

  return (
    <>
      <div >
        <Navbar
          isLoginModalOpen={isLoginModalOpen}
          setIsLoginModalOpen={setIsLoginModalOpen}
        />
        <div className="linkMenu flex items-center justify-start p-4 bg-gray-800 shadow-md">
          {isLoggedIn ? (
            <div>
              <Link
                to="/menu-list"
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 hover:shadow-red-600/50 transition-all duration-300"
              >
                Pesan Sekarang
              </Link>
            </div>
          ) : (
            <span className="text-gray-300 text-sm">
              Silahkan Login Dulu Untuk Melihat dan Pesan Menu Hari ini
            </span>
          )}
        </div>

        <MenuForHome />
        <hr></hr>
        
        {isLoggedIn ? (
          <>
          <YouInvoices />
          <RatingForm />
          </>
        ):(
         <TodayInvoices />
        )}
        <AllMenuForHome />
      <Myfooter />
      </div>
    </>
  );
};

export default HomePage;
