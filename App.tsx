import * as React from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import AppInner from './AppInner';
import './src/i18n';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

function App() {
  return (
    <Provider store={store}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />
      {/* <StatusBar barStyle="dark-content" backgroundColor="#ffffff" /> */}
       <NavigationContainer>
        <AppInner />
      </NavigationContainer>
    </Provider>
  )
}
export default App;