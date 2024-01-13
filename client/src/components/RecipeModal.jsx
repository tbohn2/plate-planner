import React, { useState } from "react";
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_RECIPE } from '../utils/queries';
import { UPDATE_RECIPE } from '../utils/mutations';

const RecipeModal = ({ id }) => {
    const { loading, error, data } = useQuery(QUERY_RECIPE, {
        variables: { recipeId: id },
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error! {error.message}</div>;
    }

    const { URL, name, ingredients } = data.recipe;
    console.log(data.recipe);

    return (
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">{name}</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    {ingredients.map((ingredient) => (
                        <div key={ingredient._id}>
                            <p>{ingredient.name}</p>
                            <p>{ingredient.quantity}</p>
                        </div>
                    ))}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary">Add to List</button>
                    <button type="button" className="btn btn-primary">Edit Recipe</button>
                    <button type="button" className="btn btn-danger">Delete Recipe</button>
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    )
}

export default RecipeModal;
