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

    const [newRecipe, setNewRecipe] = useState({
        title: '',
        ingredients: '',
        instructions: '',
    });

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

    // const [createRecipe] = useMutation(CREATE_RECIPE);
    // const [updateRecipe] = useMutation(UPDATE_RECIPE);
    // const [saveRecipeToUser] = useMutation(SAVE_RECIPE_TO_USER);



    const handleRecipeChange = (e) => {
        const { name, value } = e.target;
        setNewRecipe((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleNewRecipe = (e) => {
        e.preventDefault();
        console.log(newRecipe);
    };



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
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Create New Recipe</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleNewRecipe}>
                                <p>Recipe Title</p>
                                <input
                                    type="text"
                                    name="title"
                                    value={newRecipe.title}
                                    onChange={handleRecipeChange}
                                />
                                <p>Ingredients</p>
                                <input
                                    type="text"
                                    name="ingredients"
                                    value={newRecipe.ingredients}
                                    onChange={handleRecipeChange}
                                />
                                <p>Instructions</p>
                                <input
                                    type="text"
                                    name="instructions"
                                    value={newRecipe.instructions}
                                    onChange={handleRecipeChange}
                                />
                                <p>Image</p>
                                <input
                                    type="text"
                                    name="image"
                                    value={newRecipe.image}
                                    onChange={handleRecipeChange}
                                />
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary">Save Recipe</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
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
