import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';
import Auth from '../utils/auth';
import NewRecipeForm from '../components/NewRecipeForm';
import RecipeCard from '../components/RecipeCard';

const UserRecipes = () => {
    if (!Auth.loggedIn()) {
        window.location.assign('/login');
    }

    const user = Auth.getProfile();
    const id = user.data._id;

    const { loading, error, data, refetch } = useQuery(QUERY_USER, {
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

    const shoppingList = data.user.shoppingList;

    return (
        <div className='d-flex'>
            <div className='col-8'>
                <h1>My Recipes</h1>
                {customRecipes.map((recipe) => (
                    <RecipeCard recipe={recipe} refetch={refetch} userId={id} />
                ))}

                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#NewRecipeModal">
                    Create New Recipe
                </button>

                <div className="modal fade" id="NewRecipeModal" tabIndex="-1" aria-labelledby="NewRecipeModalLabel" aria-hidden="true">
                    <NewRecipeForm id={id} refetch={refetch} />
                </div>

                <h1>Saved Recipes</h1>
                {savedRecipes.map((recipe) => (
                    <RecipeCard recipe={recipe} refetch={refetch} userId={id} />
                ))}
            </div>

            <div className='col-4 border'>
                <h1>My Shopping List</h1>
                <div className='d-flex'>
                    <h2 className='col-8'>Ingredients</h2>
                    <h2 className='col-4'>Quantity</h2>
                </div>
                <div className='d-flex'>
                    <ul className='list-unstyled col-8'>
                        {shoppingList.map((ingredient) => (
                            <li key={ingredient._id}>{ingredient.name}</li>
                        ))}
                    </ul>
                    <ul className='list-unstyled col-4'>
                        {shoppingList.map((ingredient) => (
                            <li key={ingredient._id}>{ingredient.quantity}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserRecipes;
