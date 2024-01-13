import React, { useState } from "react";
import RecipeModal from '../components/RecipeModal';

const RecipeCards = ({ recipes }) => {
    return (
        <div className=''>
            {recipes.map((recipe) => (
                <div>
                    <div key={recipe._id} className='border' data-bs-toggle="modal" data-bs-target={`#RecipeModal-${recipe._id}`}>
                        <h3>{recipe.name}</h3>
                        <p>{recipe.img}</p>
                    </div>

                    <div className="modal fade" id={`RecipeModal-${recipe._id}`} tabIndex="-1" aria-labelledby={`RecipeModalLabel-${recipe._id}`} aria-hidden="true">
                        <RecipeModal id={recipe._id} />
                    </div>
                </div>
            ))}
        </div>
    )
};

export default RecipeCards;