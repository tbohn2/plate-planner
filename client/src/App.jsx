import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <div>
          <Routes>
            <Route exact path='/' element={<Home />} />
          </Routes>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App
