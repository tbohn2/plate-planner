import React, { useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import '../styles/root.css'
import '../styles/home.css'
import auth from "../utils/auth";
import circleImg from '../assets/circleHomePage.png'
import homeImg1 from '../assets/home1.png'
import homeImg2 from '../assets/home2.png'
import homeImg3 from '../assets/home3.png'

const Home = () => {

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const cardInfo = [
        { image: homeImg1, title: 'Step 1', text: 'Sign up and log in to your account' },
        { image: homeImg2, title: 'Step 2', text: 'Search for your favorite recipes' },
        { image: homeImg3, title: 'Step 3', text: 'Add ingredients to your shopping list' }]

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
                <div className="bg-blue pb-3">
                    <div className="home-body-bg">
                        <img src={circleImg} alt='circleImg' className='circleImg' />
                        <div className="about text-dark d-flex flex-column align-items-center fs-1 p-1">
                            <p className="bubblegum">Simplify your life by storing your favorite recipes and shopping list in the same place! This app allows you to create your
                                shopping list at the click of a button! Join now for free to see it in action!</p>
                            <button className="btn btn-success fs-4 col-8">Sign Up!</button>
                        </div>
                    </div>
                    <div className="howItWorks bg-blue d-flex flex-column align-items-center">
                        <h1 className="text-light bubblegum fw-bold col-12 text-center my-5">HOW IT WORKS</h1>
                        <div className="d-flex justify-content-center col-12">
                            {cardInfo.map((card, index) => (
                                <div key={index} className="card border-0 col-3 mx-5">
                                    <img src={card.image} className="card-img-top" alt="..." />
                                    <div className="card-body bg-blue text-light">
                                        <h3 className="card-title bubblegum">{card.title}</h3>
                                        <p className="card-text fs-5">{card.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <h2 className="text-light bubblegum text-center my-3">Sign up for free today!</h2>
                        <button className="btn btn-success fs-3 col-3 text-center">Create Account</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home;