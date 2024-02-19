import React, { useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import '../styles/root.css'
import '../styles/home.css'
import auth from "../utils/auth";
import circleImg from '../assets/circleHomePage.png'

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
                <div className="bg-blue">
                    <div className="home-body-bg overflow-hidden"></div>
                    <div>
                        <img src={circleImg} alt='circleImg' className='circleImg' />
                        <div className="about">About</div>
                    </div>
                    <div className="bg-blue">
                        <h1 className="text-light fw-bold col-12 text-center">How It Twerks</h1>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home;