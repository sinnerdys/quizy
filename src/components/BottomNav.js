import React from 'react';
import { NavLink } from 'react-router-dom';
import './BottomNav.css'; // стили для нижней навигации
import homeIcon from '../assets/icons/home.svg';
import leaderboardIcon from '../assets/icons/leaderboard.svg';
import friendsIcon from '../assets/icons/friends.svg';

function BottomNav() {
  return (
    <div className="bottom-nav">
      <NavLink to="/" className="nav-link" activeClassName="active">
        <div className="icon">
          <img src={homeIcon} alt="Home" className="icon-svg" />
        </div>
        <span>Home</span>
      </NavLink>
      <NavLink to="/leaderboard" className="nav-link" activeClassName="active">
        <div className="icon">
          <img src={leaderboardIcon} alt="Leaderboard" className="icon-svg" />
        </div>
        <span>Leaderboard</span>
      </NavLink>
      <NavLink to="/friends" className="nav-link" activeClassName="active">
        <div className="icon">
          <img src={friendsIcon} alt="Friends" className="icon-svg" />
        </div>
        <span>Friends</span>
      </NavLink>
    </div>
  );
}

export default BottomNav;
