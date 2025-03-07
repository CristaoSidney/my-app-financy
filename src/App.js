import React from 'react';
import { Route, Switch } from 'react-router-dom';
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
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/grupo-conta" component={GrupoConta} />
        <Route path="/sub-conta" component={SubConta} />
      </Switch>
    </div>
  );
};

export default App;
