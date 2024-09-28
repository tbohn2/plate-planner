import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/root.css'
import '../styles/header.css'
import logo1 from '../assets/logo1.png'

const Header = ({ loggedIn, handleLogout }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth <= 768);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className='bg-w fade-in'>
            {isMobile ?
                (
                    <header className='d-flex justify-content-center my-header'>
                        <Link to='/'><img src={logo1} alt='logo1' className='header-logo' /></Link>
                        <div id='nav-btn-group' className="btn-group">
                            <button type="button" className="mobile-nav-btn z-0 noTextDec d-flex justify-content-center align-items-center" data-bs-toggle="dropdown" aria-expanded="false">
                                ☰
                            </button>
                            <ul className="dropdown-menu bg-w">
                                <li><Link className='text-decoration-none fs-3 dropdown-item' to='/myRecipes'>My Recipes</Link></li>
                                <li><Link className='text-decoration-none fs-3 dropdown-item border-top border-primary' to='/list'>My List</Link></li>
                                <li><Link className='text-decoration-none fs-3 dropdown-item border-top border-primary' to='/search'>Browse Recipes</Link></li>
                                {loggedIn ? (
                                    <li><Link className='text-decoration-none fs-3 dropdown-item border-top border-primary' onClick={handleLogout}>Logout</Link></li>
                                ) : (
                                    <li><Link className='text-decoration-none fs-3 dropdown-item border-top border-primary' to='/login'>Login</Link></li>
                                )}
                            </ul>
                        </div>
                    </header>
                )
                :
                (
                    <header className='d-flex justify-content-between py-1 my-header'>
                        <Link to='/'><img src={logo1} alt='logo1' className='header-logo' /></Link>
                        <nav className='d-flex align-items-center justify-content-evenly col-7'>
                            <Link className='navBtn' to='/myRecipes'>My Recipes</Link>
                            <Link className='navBtn' to='/list'>My List</Link>
                            <Link className='navBtn' to='/search'>Browse Recipes</Link>
                            {loggedIn ? (
                                <Link className='loginBtn' onClick={handleLogout}>Logout</Link>
                            ) : (
                                <Link className='loginBtn' to='/login'>Login</Link>
                            )}
                        </nav>
                    </header>
                )
            }
        </div>
    )
};

export default Header;