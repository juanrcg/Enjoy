import React from 'react';
import main_img from './main.webp';
import Footer from './footer';
import Header from './header';

function Home() {
  return (
    <>
      <Header /> {/* Header component */}

      {/* Image container */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: 'calc(100vh - 60px)', marginTop: '20%' }} // Adjust based on your header height
      >
        <img src={main_img} alt="Centered Image" className="img-fluid" />
      </div>

      <Footer /> {/* Footer component */}
    </>
  );
}

export default Home;
