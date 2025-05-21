import React, { createContext, useContext, useState } from 'react';

// Membuat context untuk invoice
const InvoiceContext = createContext();

// Custom hook untuk menggunakan context invoice
export const useInvoice = () => {
  return useContext(InvoiceContext);
};

// Provider untuk menyuplai data invoice ke komponen-komponen yang membutuhkannya
export const InvoiceProvider = ({ children }) => {
  const [invoiceText, setInvoiceText] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  const updateInvoice = (text, price) => {
    setInvoiceText(text);
    setTotalPrice(price);
  };

  return (
    <InvoiceContext.Provider value={{ invoiceText, totalPrice, updateInvoice }}>
      {children}
    </InvoiceContext.Provider>
  );
};
