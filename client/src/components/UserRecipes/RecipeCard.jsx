import React, { useState } from "react";
import RecipeModal from './RecipeModal';
import '../../styles/root.css';
import '../../styles/UserRecipes/recipeCard.css';

const RecipeCard = ({ recipe, refetch, userId }) => {

    const [loaded, setLoaded] = useState(false);

    return (
        <div className={`card recipeCard text-blue border-1 border-secondary-emphasis col-xl-3 col-lg-5 col-md-4 col-sm-5 col-8 mx-4 pb-1 my-2 ${recipe.img ? loaded ? 'fade-in' : 'visually-hidden' : 'fade-in'}`}>
            <div key={recipe._id} className='d-flex flex-column align-items-center justify-content-between' data-bs-toggle="modal" data-bs-target={`#RecipeModal-${recipe._id}`}>
                {recipe.img ? (<img className="img recipeImg col-12" onLoad={() => setLoaded(true)} src={recipe.img} alt={recipe.name} />) : (null)}
                <h3 className="col-12 text-center my-2 fw-bold">{recipe.name}</h3>
            </div>

            <div className="modal fade" id={`RecipeModal-${recipe._id}`} tabIndex="-1" aria-labelledby={`RecipeModalLabel-${recipe._id}`} aria-hidden="true">
                <RecipeModal recipe={recipe} refetch={refetch} userId={userId} />
            </div>
        </div>
    )
};

export default RecipeCard;