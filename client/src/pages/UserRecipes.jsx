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
        variables: { userId: id },
    });

    const recipes = data.savedRecipes || [];

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error! {error.message}</div>;
    }

    const [createRecipe] = useMutation(CREATE_RECIPE);
    const [updateRecipe] = useMutation(UPDATE_RECIPE);
    const [saveRecipeToUser] = useMutation(SAVE_RECIPE_TO_USER);



    return (
        <div className=''>
            My Recipes
        </div>
    );
};

export default UserRecipes;
