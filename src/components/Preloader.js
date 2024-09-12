import React from 'react';
import './Preloader.css'; // Подключаем стили для прелоадера

function Preloader() {
  return (
    <div className="preloader">
      <div className="spinner"></div>
    </div>
  );
}

export default Preloader;
