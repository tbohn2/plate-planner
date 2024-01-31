import React, { useState } from "react";
import RecipeModal from '../components/RecipeModal';
import '../styles/root.css';
import '../styles/recipeCard.css';

const RecipeCard = ({ recipe, refetch, userId }) => {
    return (
        <div className='card border border-dark col-3 mx-4 my-2'>
            <div key={recipe._id} className='d-flex flex-column align-items-center' data-bs-toggle="modal" data-bs-target={`#RecipeModal-${recipe._id}`}>
                <h3 className="text-center">{recipe.name}</h3>
                {recipe.img ? (<img className="searchImg" src={recipe.img} alt={recipe.name} />) : (null)}
            </div>

            <div className="modal fade" id={`RecipeModal-${recipe._id}`} tabIndex="-1" aria-labelledby={`RecipeModalLabel-${recipe._id}`} aria-hidden="true">
                <RecipeModal recipe={recipe} refetch={refetch} userId={userId} />
            </div>
        </div>
    )
};

export default RecipeCard;