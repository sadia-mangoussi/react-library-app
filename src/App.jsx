import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/features/home/Home';
import AdvancedSearch from './components/features/search/AdvancedSearch';
import BookDetail from './components/features/book/BookDetail';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<AdvancedSearch />} />
            <Route path="/book/:bookId" element={<BookDetail />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
