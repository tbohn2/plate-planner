import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css'
import logo from '../assets/logo2.png'

const Footer = () => {

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
                    <footer></footer>
                )
                :
                (
                    <footer></footer>
                )
            }
        </div>
    )
};

export default Footer;