import React, {useContext} from 'react';
import Ingredients from './components/Ingredients/Ingredients';
import {AuthContext} from './Context/auth-context';
import Auth from './components/Auth';

const App = props => {
  // return <Ingredients />;
  const authContext = useContext(AuthContext);
  let context = <Auth/>;
  if (authContext.isAuth) {
    context = <Ingredients/>;
  }
  return context;
};

export default App;
