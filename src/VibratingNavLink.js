import React from 'react';
import { NavLink } from 'react-router-dom'; // Для веба
import { Vibration, Platform } from 'react-native'; // Для мобильных платформ

const VibratingNavLink = ({ children, to, className, activeClassName, duration = 50 }) => {
  const triggerVibration = () => {
    if (Platform.OS === 'web') {
      // Вибрация для веба
      if ('vibrate' in navigator) {
        navigator.vibrate(duration);
      }
    } else {
      // Вибрация для iOS и Android
      Vibration.vibrate(duration);
    }
  };

  return (
    <NavLink
      to={to}
      className={className}
      activeClassName={activeClassName}
      onClick={triggerVibration}
    >
      {children}
    </NavLink>
  );
};

export default VibratingNavLink;
