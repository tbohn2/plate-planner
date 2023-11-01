import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import '../styles/home.css'

const Home = () => {

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

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    return (
        <div className=''>
            {isMobile ? (
                <div></div>
            ) : (
                <div> </div>
            )}
        </div>
    )
}

export default Home;