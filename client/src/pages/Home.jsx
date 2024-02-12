import React, { useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import '../styles/home.css'
import auth from "../utils/auth";

const Home = () => {

    return <Navigate to="/login" />;



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