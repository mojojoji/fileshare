import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import RootStore, { StoreContext } from './stores';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const store = new RootStore();

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.100',
        color: 'black',
      },
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </StoreContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
