import React from 'react';
import VibratingNavLink from './VibratingNavLink'; // Импортируйте новый компонент
import './BottomNav.css';
import homeIcon from '../assets/icons/home.svg';
import leaderboardIcon from '../assets/icons/leaderboard.svg';
import friendsIcon from '../assets/icons/friends.svg';
import gamesIcon from '../assets/icons/games.svg';
import wheelIcon from '../assets/icons/wheel.svg';

function BottomNav() {
  return (
    <div className="bottom-nav">
      <VibratingNavLink to="/" className="nav-link" activeClassName="active">
        <div className="menu-icon active-icon-bg">
          <img src={homeIcon} alt="Home" className="icon-svg" />
        </div>
        <span>Home</span>
      </VibratingNavLink>
      <VibratingNavLink to="/leaderboard" className="nav-link" activeClassName="active">
        <div className="menu-icon active-icon-bg">
          <img src={leaderboardIcon} alt="Leaderboard" className="icon-svg" />
        </div>
        <span>Leaderboard</span>
      </VibratingNavLink>
      <VibratingNavLink to="/quizes" className="nav-link" activeClassName="active">
        <div className="menu-icon active-icon-bg">
          <img src={gamesIcon} alt="Games" className="icon-svg" />
        </div>
        <span>Quizes</span>
      </VibratingNavLink>
      <VibratingNavLink to="/friends" className="nav-link" activeClassName="active">
        <div className="menu-icon active-icon-bg">
          <img src={friendsIcon} alt="Friends" className="icon-svg" />
        </div>
        <span>Friends</span>
      </VibratingNavLink>
      <VibratingNavLink to="/wheel" className="nav-link" activeClassName="active">
        <div className="menu-icon active-icon-bg">
          <img src={wheelIcon} alt="Wheel" className="icon-svg" />
        </div>
        <span>Wheel</span>
      </VibratingNavLink>
    </div>
  );
}

export default BottomNav;
