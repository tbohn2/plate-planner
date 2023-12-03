import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_SAVED_RECIPES } from '../utils/queries';
import { CREATE_RECIPE, SAVE_RECIPE_TO_USER, UPDATE_RECIPE } from '../utils/mutations';
import Auth from '../utils/auth';

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

    console.log(data);
    const recipes = data.user.savedRecipes || [];

    const customRecipes = recipes.filter((recipe) => recipe.custom);
    const savedRecipes = recipes.filter((recipe) => !recipe.custom);

    // const [createRecipe] = useMutation(CREATE_RECIPE);
    // const [updateRecipe] = useMutation(UPDATE_RECIPE);
    // const [saveRecipeToUser] = useMutation(SAVE_RECIPE_TO_USER);



    return (
        <div className=''>
            <h1>My Recipes</h1>
            <div className=''>
                {customRecipes.map((recipe) => (
                    <div key={recipe._id} className='border'>
                        <h3>{recipe.name}</h3>
                        <p>{recipe.img}</p>
                    </div>
                ))}
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
