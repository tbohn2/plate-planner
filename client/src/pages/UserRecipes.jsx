import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_SAVED_RECIPES } from '../utils/queries';
import { CREATE_RECIPE, SAVE_RECIPE_TO_USER, UPDATE_RECIPE } from '../utils/mutations';
import Auth from '../utils/auth';
import NewRecipeForm from '../components/NewRecipeForm';
import RecipeModal from '../components/RecipeModal';

const UserRecipes = () => {
    if (!Auth.loggedIn()) {
        window.location.assign('/login');
    }

    const user = Auth.getProfile();
    const id = user.data._id;

    const { loading, error, data } = useQuery(QUERY_SAVED_RECIPES, {
        variables: { id: id },
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error! {error.message}</div>;
    }

    const recipes = data.user.savedRecipes || [];

    const customRecipes = recipes.filter((recipe) => recipe.custom);
    const savedRecipes = recipes.filter((recipe) => !recipe.custom);



    return (
        <div className=''>
            <h1>My Recipes</h1>
            <div className=''>
                {customRecipes.map((recipe) => (
                    <div>
                        <div key={recipe._id} className='border' data-bs-toggle="modal" data-bs-target={`#RecipeModal-${recipe._id}`}>
                            <h3>{recipe.name}</h3>
                            <p>{recipe.img}</p>
                        </div>

                        <div className="modal fade" id={`RecipeModal-${recipe._id}`} tabIndex="-1" aria-labelledby={`RecipeModalLabel-${recipe._id}`} aria-hidden="true">
                            <RecipeModal />
                        </div>
                    </div>
                ))}
            </div>

            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#NewRecipeModal">
                Create New Recipe
            </button>

            <div className="modal fade" id="NewRecipeModal" tabIndex="-1" aria-labelledby="NewRecipeModalLabel" aria-hidden="true">
                <NewRecipeForm />
            </div>

            <h1>Saved Recipes</h1>
            <div className=''>
                {savedRecipes.map((recipe) => (
                    <div key={recipe._id} className='border'>
                        <h3>{recipe.name}</h3>
                        <p>{recipe.img}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserRecipes;
