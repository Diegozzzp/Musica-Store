import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#594F4F] text-white text-center py-4 ">
      <div className="flex items-center justify-center gap-8">
        <h1 className="text-2xl font-bold font-mono" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Kiwi <br/>Music</h1>
        <p className="text-md text-[#9DE0AD]">Sigue la musica <br/> que te gusta</p>
      </div>
    </footer>
  );
};

export default Footer;
