import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Home, Login } from './pages';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/root.css'

const httpLink = createHttpLink({
  uri: '/graphql',
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
      <Router>
        <div className='myBody'>
          <Header />
          <div>
            <Routes>
              <Route exact path='/' element={<Home />} />
              <Route exact path='/login' element={<Login />} />
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
