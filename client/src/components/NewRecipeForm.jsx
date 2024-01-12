import React, { useState } from "react";
import { useMutation } from '@apollo/client';
import { CREATE_RECIPE } from '../utils/mutations';

const NewRecipeForm = () => {

    const [newRecipe, setNewRecipe] = useState({ recipeName: '', });
    const [ingredients, setIngredients] = useState([{ ingredientName: '', quantity: '' }]);

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
        list[index][name] = value;
        setIngredients(list);
    }

    const increaseIngredientNumber = () => {
        setIngredients(prevIngredients => [...prevIngredients, { ingredientName: '', quantity: '' }]);
    };

    const removeIngredient = (index) => {
        const list = [...ingredients];
        list.splice(index, 1);
        setIngredients(list);
    };

    const handleNewRecipe = (e) => {
        e.preventDefault();
        console.log(newRecipe);
    };

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
                                    type='text'
                                    name='quantity'
                                    placeholder='Quantity'
                                    value={ingredient.quantity}
                                    onChange={(e) => handleIngredientChange(e, index)}
                                />
                                <button type='button' onClick={() => removeIngredient(index)}>Remove Ingredient</button>
                            </div>
                        ))}
                        <button type='button' onClick={increaseIngredientNumber}>Add Another Ingredient</button>
                        <label>Ingredients</label>
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