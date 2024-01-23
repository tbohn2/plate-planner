import React, { useState } from "react";
import { useMutation } from '@apollo/client';
import { CREATE_RECIPE, SAVE_RECIPE_TO_USER } from '../utils/mutations';

const NewRecipeForm = ({ id, refetch }) => {

    const [createRecipe] = useMutation(CREATE_RECIPE);
    const [saveRecipeToUser] = useMutation(SAVE_RECIPE_TO_USER);

    const [newRecipe, setNewRecipe] = useState({ recipeName: '', });
    const [ingredients, setIngredients] = useState([{ name: '', quantity: "", unit: '' }]);


    const handleRecipeChange = (e) => {
        const { name, value } = e.target;
        setNewRecipe((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleIngredientChange = (e, index) => {
        const { name, value } = e.target;
        setIngredients(prevIngredients => {
            const updatedIngredients = [...prevIngredients];
            updatedIngredients[index] = {
                ...updatedIngredients[index],
                [name]: value
            };
            return updatedIngredients;
        });
    }

    const increaseIngredientNumber = () => {
        setIngredients(prevIngredients => [...prevIngredients, { name: '', quantity: "", unit: '' }]);
    };

    const removeIngredient = (index) => {
        // Creates shallow copy of editFormIngedientsState to avoid mutating state directly
        const list = [...ingredients];
        list.splice(index, 1);
        setIngredients(list);
    };

    const handleNewRecipe = async (e) => {
        e.preventDefault();
        const newIngredients = ingredients.map(ingredient => {
            const amount = `${ingredient.quantity} ${ingredient.unit}`;
            return { name: ingredient.name, amount: amount };
        }
        );
        try {
            const { data } = await createRecipe({
                variables: {
                    name: newRecipe.recipeName,
                    ingredients: newIngredients,
                    custom: true,
                },
            });
            const recipeId = data.createRecipe._id;
            await saveRecipeToUser({
                variables: {
                    userId: id,
                    recipeId: recipeId,
                },
            });
            if (saveRecipeToUser) {
                setNewRecipe({ recipeName: '', });
                setIngredients([{ name: '', quantity: "0", unit: '' }]);
                refetch();
            }
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
                                    name='name'
                                    placeholder='Ingredient'
                                    value={ingredient.name}
                                    onChange={(e) => handleIngredientChange(e, index)}
                                />
                                <input
                                    type='text'
                                    name='quantity'
                                    placeholder='Quantity'
                                    value={ingredient.quantity}
                                    onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9/ ]/g, ''); }}
                                    onChange={(e) => handleIngredientChange(e, index)}
                                />
                                <input
                                    type='text'
                                    name='unit'
                                    placeholder='Unit e.g. cups, tbsp, a dash, etc.'
                                    value={ingredient.unit}
                                    onChange={(e) => handleIngredientChange(e, index)}
                                />
                                <button type='button' onClick={() => removeIngredient(index)}>Remove Ingredient</button>
                            </div>
                        ))}
                        <button type='button' onClick={increaseIngredientNumber}>Add Another Ingredient</button>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save Recipe</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default NewRecipeForm;