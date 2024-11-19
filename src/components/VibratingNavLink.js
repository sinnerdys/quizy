import React from 'react';
import { NavLink } from 'react-router-dom'; // Для веба
import { Vibration } from 'react-native'; // Для мобильных платформ
import HapticFeedback from 'react-native-haptic-feedback'; // Для тактильной обратной связи на iOS/Android

const VibratingNavLink = ({ children, to, className, activeClassName, duration = 50 }) => {
  const triggerVibration = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      // Вибрация для веба
      navigator.vibrate(duration);
    } else if (typeof HapticFeedback !== 'undefined') {
      // Тактильная обратная связь для iOS/Android через HapticFeedback
      HapticFeedback.trigger('impactLight', {
        enableVibrateFallback: true, // Включает вибрацию, если Taptic Engine недоступен
        ignoreAndroidSystemSettings: false, // Игнорирует системные настройки вибрации
      });
    } else if (typeof Vibration !== 'undefined') {
      // Вибрация через React Native для Android
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
