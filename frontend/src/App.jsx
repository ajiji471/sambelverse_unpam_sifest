import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './components/HomePage';
import Register from './components/Register';
import AllMenu from './components/AllMenu';
import MenuList from './components/MenuList';
import MyMenuCard from './components/MyMenuCard';
import { AuthProvider } from "./components/AuthContext";
import { InvoiceProvider } from "./components/InvoiceContext"; // Import InvoiceProvider
import ProtectedRoute from "./components/ProtectedRoute";
import MyInvoiceMenu from "./components/MyInvoiceMenu";
import CrudInvoices from "./components/CrudInvoices";
import ListInvoices from "./components/ListInvoices";
import SplitInvoices from "./components/SplitInvoices";
import YouInvoices from "./components/YouInvoices";
import TodayInvoices from "./components/TodayInvoices";
import RatingForm from "./components/RatingForm";
import Pembayaran from "./components/Pembayaran";

const App = () => {
  return (
    <AuthProvider>
      <InvoiceProvider> {/* Bungkus aplikasi dengan InvoiceProvider */}
        <BrowserRouter 
        basename="/sambelverse4"
        > {/* Tambahkan basename */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/all-menu" element={<AllMenu />} />
            <Route path="/menu-card" element={<MyMenuCard />} />
            <Route path="/invoice" element={<MyInvoiceMenu />} />
            <Route path="/crud-invoice" element={<CrudInvoices />} />
            <Route path="/list-invoices" element={<ListInvoices />} />
            <Route path="/you-invoices" element={<YouInvoices />} />
            <Route path="/today-invoices" element={<TodayInvoices/>} />
            <Route path="/ratings" element={<RatingForm/>} />
            <Route path="/pembayaran" element={<Pembayaran/>} />

            <Route path="/list-split-invoices" element={<SplitInvoices />} />
            <Route
              path="/menu-list"
              element={
                <ProtectedRoute>
                  <MenuList />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </InvoiceProvider>
    </AuthProvider>
  );
};

export default App;
