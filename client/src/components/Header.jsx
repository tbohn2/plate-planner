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
                    <header className='d-flex border border-dark'>
                        <div className='border border-dark logoContainer1 d-flex justify-content-center align-items-center'>
                            <img src={logo1} alt='logo1' className='logo1' />
                        </div>
                    </header>
                )
            }
        </div>
    )
};

export default Header;