import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import '../styles/root.css'
import '../styles/home.css'
import circleImg from '../assets/circleHomePage.png'
import homeImg1 from '../assets/home1.png'
import homeImg2 from '../assets/home2.png'
import homeImg3 from '../assets/home3.png'

const Home = () => {

    const [loading, setLoading] = useState(true);
    const [loaded, setLoaded] = useState(false);
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
        <div>
            {loading &&
                <div className="fade-in col-12 d-flex flex-wrap justify-content-center">
                    <h1 className="col-12 text-center bubblegum">Welcome!</h1>
                    <div className="spinner-border col-12" role="status">
                    </div>
                </div>}
            <div className={loaded ? 'fade-in' : 'visually-hidden'}>
                <div className={`intro-container d-flex col-12 align-items-center ${isMobile ? 'flex-column justify-content-between' : 'justify-content-evenly'}`}>
                    {isMobile ? (
                        <img src={circleImg} alt='circleImg' className='circleImg' onLoad={() => { setLoaded(true); setLoading(false); }} />
                    ) : null}
                    <div className="about bg-w border-blue d-flex flex-column align-items-center justify-content-evenly px-3">
                        <p className="bubblegum text-blue d-flex align-items-center justify-content-center">
                            Simplify your life by storing your favorite recipes and shopping list in the same place!
                            This app allows you to create your shopping list at the click of a button!
                            Join now for free to see it in action!
                        </p>
                        <Link to='/login' onClick={scrollToTop} className="btn btn-success fs-4 col-8">Sign Up!</Link>
                    </div>
                    {!isMobile ? (
                        <img src={circleImg} alt='circleImg' className='circleImg' onLoad={() => { setLoaded(true); setLoading(false); }} />
                    ) : null}
                </div>

                <div className="howItWorks pt-4 bg-blue d-flex flex-column align-items-center">
                    <h1 className="text-light bubblegum fw-bold col-12 text-center my-3">HOW IT WORKS</h1>
                    <div className={`d-flex ${isMobile ? 'flex-column align-items-center' : 'justify-content-center'} col-12`}>
                        {cardInfo.map((card, index) => (
                            <div key={index} className={`card border-0 ${isMobile ? 'col-sm-8 col-10 mb-3' : 'col-3 mx-5'}`}>
                                <img src={card.image} className="card-img-top" alt="..." />
                                <div className="card-body bg-blue text-light">
                                    <h3 className="card-title bubblegum">{card.title}</h3>
                                    <p className="card-text fs-5">{card.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-light bubblegum text-center my-3">Sign up for free today!</h2>
                    <Link to='/login' onClick={scrollToTop} className={`btn btn-success mb-3 fs-3 ${isMobile ? 'col-6 my-3' : 'col-lg-3 col-md-4'} text-center`}>Create Account</Link>
                </div>
            </div>
        </div>
    )
}

export default Home;