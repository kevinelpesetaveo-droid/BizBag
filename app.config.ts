import React from 'react';
import { LogBox } from 'react-native';
import './styles/globals.css';

// Ignorar advertencias no críticas en desarrollo
if (__DEV__) {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'ViewPropTypes will be removed',
  ]);
}
