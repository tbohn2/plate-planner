import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css'
import logo1 from '../assets/logo1.png'

const Header = () => {

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
        <div>
            {isMobile ?
                (
                    <header></header>
                )
                :
                (
                    <header className='d-flex justify-content-between border-bottom border-dark'>
                        <img src={logo1} alt='logo1' className='ms-5' />
                        <nav className='d-flex align-items-center justify-content-evenly col-6'>
                            <Link className='text-decoration-none navBtn' to='/myRecipes'>My Recipes</Link>
                            <Link className='text-decoration-none navBtn' to='/list'>My List</Link>
                            <Link className='text-decoration-none navBtn' to='/search'>Browse Recipes</Link>
                            <Link className='text-decoration-none loginBtn' to='/login'>Login</Link>
                        </nav>
                    </header>
                )
            }
        </div>
    )
};

export default Header;