import React, { useState } from "react";
import { useMutation } from '@apollo/client';
import { CREATE_RECIPE, SAVE_RECIPE_TO_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const NewRecipeForm = () => {

    const user = Auth.getProfile();
    const id = user.data._id;

    const [createRecipe] = useMutation(CREATE_RECIPE);
    const [saveRecipeToUser] = useMutation(SAVE_RECIPE_TO_USER);

    const [newRecipe, setNewRecipe] = useState({ recipeName: '', });
    const [ingredients, setIngredients] = useState([{ ingredientName: '', quantity: 0 }]);


    const handleRecipeChange = (e) => {
        const { name, value } = e.target;
        setNewRecipe((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleIngredientChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...ingredients];
        list[index][name] = name === 'quantity' ? Number(value) : value;
        setIngredients(list);
    }

    const increaseIngredientNumber = () => {
        setIngredients(prevIngredients => [...prevIngredients, { ingredientName: '', quantity: 0 }]);
    };

    const removeIngredient = (index) => {
        const list = [...ingredients];
        list.splice(index, 1);
        setIngredients(list);
    };

    const handleNewRecipe = async (e) => {
        e.preventDefault();
        console.log(newRecipe, ingredients);
        try {
            const { data } = await createRecipe({
                variables: {
                    name: newRecipe.recipeName,
                    ingredients: ingredients,
                },
            });
            console.log(data);
            const recipeId = data.createRecipe._id;
            console.log(recipeId);
            await saveRecipeToUser({
                variables: {
                    userId: id,
                    recipeId: recipeId,
                },
            });
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Create New Recipe</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleNewRecipe}>
                        <label>Recipe Name</label>
                        <input
                            type="text"
                            name="recipeName"
                            value={newRecipe.recipeName}
                            onChange={handleRecipeChange}
                        />
                        {ingredients.map((ingredient, index) => (
                            <div key={index}>
                                <input
                                    type='text'
                                    name='ingredientName'
                                    placeholder='Ingredient'
                                    value={ingredient.ingredientName}
                                    onChange={(e) => handleIngredientChange(e, index)}
                                />
                                <input
                                    type='number'
                                    name='quantity'
                                    placeholder='Quantity'
                                    value={ingredient.quantity}
                                    onChange={(e) => handleIngredientChange(e, index)}
                                />
                                <button type='button' onClick={() => removeIngredient(index)}>Remove Ingredient</button>
                            </div>
                        ))}
                        <button type='button' onClick={increaseIngredientNumber}>Add Another Ingredient</button>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary">Save Recipe</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default NewRecipeForm;