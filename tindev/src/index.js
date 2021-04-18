/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {LogBox} from 'react-native';

import Router from './routes';

LogBox.ignoreLogs(['Unrecognized WebSocket']);

export default function App() {
  return <Router />;
}
