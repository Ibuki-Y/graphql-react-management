import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { StateContextProvider } from './context/StateContext';
import { Auth } from './components/Auth';
import { MainPage } from './components/MainPage';
import styles from './styles/modules/App.module.css';

const client = new ApolloClient({
  uri: 'http://127.0.0.1:8000/graphql/',
  headers: {
    authorization: localStorage.getItem('token') ? `JWT ${localStorage.getItem('token')}` : '',
  },
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <StateContextProvider>
        <div className={styles.app}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Auth />} />
              <Route path="/employees" element={<MainPage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </StateContextProvider>
    </ApolloProvider>
  );
}

export default App;
