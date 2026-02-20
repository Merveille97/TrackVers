import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 pt-32 flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;