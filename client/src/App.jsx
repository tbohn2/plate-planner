import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Home, List, Login, UserRecipes, Search } from './pages';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/root.css'

const httpLink = createHttpLink({
  // uri: 'http://localhost:3001/graphql', // for development
  uri: 'https://hidden-atoll-84159-73053ccb91cd.herokuapp.com/graphql',
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
  return (
    <ApolloProvider client={client}>
      <Router basename='/plate-planner'>
        <div className='myBody bg-light-yellow'>
          <Header />
          <div>
            <Routes>
              <Route exact path='/' element={<Home />} />
              <Route exact path='/list' element={<List />} />
              <Route exact path='/login' element={<Login />} />
              <Route exact path='/myRecipes' element={<UserRecipes />} />
              <Route exact path='/search' element={<Search />} />
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
