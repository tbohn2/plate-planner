import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Home, List, Login, UserRecipes, Search } from './pages';
import Header from './components/Header';
import Footer from './components/Footer';
import Auth from './utils/auth';
import './styles/root.css'

const httpLink = createHttpLink({
  // uri: 'http://localhost:3001/graphql', // for development
  uri: 'https://plate-planner-czqw.onrender.com/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  const [loggedIn, setLoggedIn] = useState(Auth.loggedIn());

  function updateGradientAngle() {
    const vh = window.innerHeight * 0.84;
    const vw = window.innerWidth;
    const angle = 180 - Math.atan(vh / vw) * (180 / Math.PI);

    document.documentElement.style.setProperty('--dynamic-angle', `${angle}deg`);
  }

  window.addEventListener('resize', updateGradientAngle);
  updateGradientAngle();


  const handleLogin = () => {
    setLoggedIn(true);
  }

  const handleLogout = () => {
    Auth.logout();
    setLoggedIn(false);
  };

  return (
    <ApolloProvider client={client}>
      <Router basename='/plate-planner'>
        <div className='myBody'>
          <Header loggedIn={loggedIn} handleLogout={handleLogout} />
          <div id='main-content' className='overflow-x-hidden'>
            <Routes>
              <Route exact path='/' element={<Home />} />
              <Route exact path='/list' element={loggedIn ? <List /> : <Navigate to="/login" replace />} />
              <Route exact path='/login' element={<Login loggedIn={loggedIn} handleLogin={handleLogin} />} />
              <Route exact path='/myRecipes' element={loggedIn ? <UserRecipes /> : <Navigate to="/login" replace />} />
              <Route exact path='/search' element={loggedIn ? <Search /> : <Navigate to="/login" replace />} />
            </Routes>
          </div>
          <div>
            <Footer />
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App
