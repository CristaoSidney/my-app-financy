import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GrupoConta from './components/GrupoConta';
import SubConta from './components/SubConta';
import { useAuth0 } from '@auth0/auth0-react';

const App = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/grupo-conta" element={<GrupoConta />} />
        <Route path="/sub-conta" element={<SubConta />} />
      </Routes>
    </div>
  );
};

export default App;
