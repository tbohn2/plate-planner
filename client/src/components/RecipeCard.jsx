import React, { useState } from "react";
import RecipeModal from '../components/RecipeModal';
import '../styles/root.css';
import '../styles/recipeCard.css';

const RecipeCard = ({ recipe, refetch, userId }) => {

    const [loaded, setLoaded] = useState(false);

    return (
        <div className={`card recipeCard border border-dark col-3 mx-4 my-2 ${recipe.img ? loaded ? 'fade-in' : 'visually-hidden' : 'fade-in'}`}>
            <div key={recipe._id} className='d-flex flex-column align-items-center' data-bs-toggle="modal" data-bs-target={`#RecipeModal-${recipe._id}`}>
                <h3 className="text-center">{recipe.name}</h3>
                {recipe.img ? (<img className="img col-8 m-2" onLoad={() => setLoaded(true)} src={recipe.img} alt={recipe.name} />) : (null)}
            </div>

            <div className="modal fade" id={`RecipeModal-${recipe._id}`} tabIndex="-1" aria-labelledby={`RecipeModalLabel-${recipe._id}`} aria-hidden="true">
                <RecipeModal recipe={recipe} refetch={refetch} userId={userId} />
            </div>
        </div>
    )
};

export default RecipeCard;