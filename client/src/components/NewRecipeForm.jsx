import React, { useState } from "react";
import { useMutation } from '@apollo/client';
import { CREATE_RECIPE, SAVE_RECIPE_TO_USER } from '../utils/mutations';

const NewRecipeForm = ({ id, refetch }) => {

    const [createRecipe] = useMutation(CREATE_RECIPE);
    const [saveRecipeToUser] = useMutation(SAVE_RECIPE_TO_USER);

    const [newRecipeNameState, setnewRecipeNameState] = useState('');
    const [ingredientsState, setIngredientsState] = useState([{ name: '', quantity: '', unit: '' }]);
    const [instructionsState, setinstructionsState] = useState('');


    const handleRecipeChange = (e) => {
        const { value } = e.target;
        setnewRecipeNameState(value);
    };

    const handleIngredientChange = (e, index) => {
        const { name, value } = e.target;
        setIngredientsState(prevIngredients => {
            const updatedIngredients = [...prevIngredients];
            updatedIngredients[index] = {
                ...updatedIngredients[index],
                [name]: value
            };
            return updatedIngredients;
        });
    }

    const handleInstructionsChange = (event) => {
        setinstructionsState(event.target.value);
    };

    const increaseIngredientNumber = () => {
        setIngredientsState(prevIngredients => [...prevIngredients, { name: '', quantity: '', unit: '' }]);
    };

    const removeIngredient = (index) => {
        // Creates shallow copy of editFormIngedientsState to avoid mutating state directly
        const list = [...ingredientsState];
        list.splice(index, 1);
        setIngredientsState(list);
    };

    const clearForm = () => {
        setnewRecipeNameState('');
        setIngredientsState([{ name: '', quantity: '', unit: '' }]);
        setinstructionsState('');
    };

    const handleNewRecipe = async (e) => {
        e.preventDefault();
        const newIngredients = ingredientsState.map(ingredient => {
            const amount = `${ingredient.quantity} ${ingredient.unit}`;
            return { name: ingredient.name, amount: amount };
        }
        );
        try {
            const { data } = await createRecipe({
                variables: {
                    name: newRecipeNameState,
                    ingredients: newIngredients,
                    instructions: instructionsState,
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
                setnewRecipeNameState('');
                setIngredientsState([{ name: '', quantity: '', unit: '' }]);
                refetch();
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="modal-dialog modal-lg">
            <div className="modal-content bg-light-yellow">
                <div className="modal-header">
                    <h2 className="modal-title">Create New Recipe</h2>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <form className="col-12 d-flex flex-column align-items-center">
                        <input
                            type="text"
                            name="recipeName"
                            placeholder="Recipe Name"
                            className="col-6 fs-4 my-1"
                            value={newRecipeNameState}
                            onChange={handleRecipeChange}
                        />
                        <div className="col-12 d-flex flex-column justify-content-center align-items-center my-1">
                            {ingredientsState.map((ingredient, index) => (
                                <div key={index} className="col-10 d-flex justify-content-between my-1">
                                    <input
                                        type='text'
                                        name='name'
                                        placeholder='Ingredient'
                                        className="col-4"
                                        value={ingredient.name}
                                        onChange={(e) => handleIngredientChange(e, index)}
                                    />
                                    <input
                                        type='text'
                                        name='quantity'
                                        placeholder='Quantity'
                                        className="col-2"
                                        value={ingredient.quantity}
                                        onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9/ ]/g, ''); }}
                                        onChange={(e) => handleIngredientChange(e, index)}
                                    />
                                    <input
                                        type='text'
                                        name='unit'
                                        placeholder='Unit i.e cups,a dash, etc.'
                                        className="col-3"
                                        value={ingredient.unit}
                                        onChange={(e) => handleIngredientChange(e, index)}
                                    />
                                    <button type='button' className="col-3 btn btn-danger mx-1" onClick={() => removeIngredient(index)}>Remove</button>
                                </div>
                            ))}
                            <button type='button' className="btn btn-success my-1" onClick={increaseIngredientNumber}>+ Ingredient</button>
                        </div>
                        <div className="col-12">
                            <h3 className="col-12 text-center text-decoration-underline">Instructions</h3>
                            <textarea className="col-12 form-control my-text-area" name="instructions" value={instructionsState} onChange={handleInstructionsChange} />
                        </div>
                    </form>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={handleNewRecipe}>Save Recipe</button>
                        <button type="button" className="btn btn-primary" onClick={clearForm}>Clear All</button>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default NewRecipeForm;