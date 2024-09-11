import React from 'react';
import { NavLink } from 'react-router-dom';
import './BottomNav.css'; // стили для нижней навигации

function BottomNav() {
  return (
    <div className="bottom-nav">
      <NavLink to="/" className="nav-link">
        <div className="icon">
          🏠
        </div>
        <span>Home</span>
      </NavLink>
      <NavLink to="/leaderboard" className="nav-link">
        <div className="icon">
          🏆
        </div>
        <span>Leaderboard</span>
      </NavLink>
      <NavLink to="/friends" className="nav-link">
        <div className="icon">
          👥
        </div>
        <span>Friends</span>
      </NavLink>
    </div>
  );
}

export default BottomNav;
