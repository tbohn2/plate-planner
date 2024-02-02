import React, { useState } from "react";
import { useQuery, useMutation } from '@apollo/client';
import { ADD_ITEMS_TO_LIST, UPDATE_RECIPE, DELETE_RECIPE } from '../utils/mutations';
import '../styles/root.css';

const RecipeModal = ({ recipe, refetch, userId }) => {

    const { _id, name, ingredients, URL, img } = recipe;

    const typelessIngredients = ingredients.map(ingredient => {
        const quantity = ingredient.amount.replace(/[^0-9/.]/g, '');
        const unit = ingredient.amount.replace(/[0-9/.]/g, '').trim();
        return { name: ingredient.name, quantity: quantity, unit: unit }
    });

    const defaultItemsList = ingredients.map(ingredient => {
        return { name: ingredient.name, quantity: 1 }
    });

    const [editing, setEditing] = useState(false);
    const [addingToList, setAddingToList] = useState(false);
    const [editFormNameState, setEditFormNameState] = useState(name);
    const [editFormIngedientsState, setEditFormIngredientsState] = useState(typelessIngredients);
    const [addingFormIngedientsState, setAddingFormIngredientsState] = useState(defaultItemsList);

    const [addItemsToList] = useMutation(ADD_ITEMS_TO_LIST);
    const [updateRecipe] = useMutation(UPDATE_RECIPE);
    const [deleteRecipe] = useMutation(DELETE_RECIPE);

    const toggleEdit = (e) => {
        e.preventDefault();
        setEditFormIngredientsState(typelessIngredients);
        setEditing(!editing);
    };

    const toggleAddingToList = (e) => {
        e.preventDefault();
        setAddingFormIngredientsState(defaultItemsList);
        setAddingToList(!addingToList);
    };

    const handleIngredientChange = (event, index) => {
        const { name, value } = event.target;
        if (editing) {
            setEditFormIngredientsState(prevIngredients => {
                const updatedIngredients = [...prevIngredients];
                updatedIngredients[index] = {
                    ...updatedIngredients[index],
                    [name]: value
                };
                return updatedIngredients;
            });
        }
        if (addingToList) {
            setAddingFormIngredientsState(prevIngredients => {
                const updatedIngredients = [...prevIngredients];
                updatedIngredients[index] = {
                    ...updatedIngredients[index],
                    [name]: name === 'quantity' ? Number(value) : value
                };
                return updatedIngredients;
            });
        }
    };

    const increaseIngredientNumber = () => {
        setEditFormIngredientsState(prevIngredients => [...prevIngredients, { name: '', quantity: "", unit: '' }]);
    };

    const removeIngredient = (index) => {
        if (editing) {
            // Creates shallow copy of editFormIngedientsState to avoid mutating state directly
            const list = [...editFormIngedientsState];
            list.splice(index, 1);
            setEditFormIngredientsState(list);
        }
        if (addingToList) {
            // Creates shallow copy of addingFormIngedientsState to avoid mutating state directly
            const list = [...addingFormIngedientsState];
            list.splice(index, 1);
            setAddingFormIngredientsState(list);
        }
    };

    const addItemsToListHandler = async (event) => {
        event.preventDefault();
        try {
            const { data } = await addItemsToList({
                variables: { userId: userId, items: addingFormIngedientsState },
            });
            if (data) {
                toggleAddingToList(event);
                refetch();
            }
        } catch (err) {
            console.error(err);
        }
    }

    const updateRecipeHandler = async (event) => {
        event.preventDefault();
        const updatedIngredients = editFormIngedientsState.map(ingredient => {
            return { name: ingredient.name, amount: `${ingredient.quantity} ${ingredient.unit}` }
        });
        try {
            const { data } = await updateRecipe({
                variables: {
                    recipeId: _id,
                    name: editFormNameState,
                    ingredients: updatedIngredients,
                    instructions: "",
                },
            });
            if (data) {
                toggleEdit(event);
                refetch();
            }
        }
        catch (err) {
            console.error(err);
        }
    };

    const removeRecipe = async (event) => {
        event.preventDefault();
        try {
            const { data } = await deleteRecipe({
                variables: { recipeId: _id },
            });
            if (data) { refetch(); }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="modal-dialog modal-lg ">
            <div className="modal-content bg-light-yellow">
                <div className="modal-header">
                    <h1 className="modal-title">{name}</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setEditing(false); setAddingToList(false) }}></button>
                </div>
                {editing || addingToList ? (
                    <div>
                        {editing ? (
                            <div>
                                <div className="modal-body d-flex flex-column align-items-center">
                                    <form className="d-flex flex-column align-items-center">
                                        {editFormIngedientsState.map((ingredient, index) => (
                                            <div key={index} className="col-10 d-flex justify-content-between">
                                                <input type="text" name="name" placeholder="Ingredient Name" value={ingredient.name} onChange={(e) => handleIngredientChange(e, index)} />
                                                <input type="text" name="quantity" placeholder="Quantity" value={ingredient.quantity} onChange={(e) => handleIngredientChange(e, index)} onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9/. ]/g, ''); }} />
                                                <input type="text" name="unit" placeholder="Units e.g. cups, tbsp" value={ingredient.unit} onChange={(e) => handleIngredientChange(e, index)} />
                                                <button type='button' onClick={() => removeIngredient(index)}>Remove Ingredient</button>
                                            </div>
                                        ))}
                                        <button type='button' onClick={increaseIngredientNumber}>Add Another Ingredient</button>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" onClick={updateRecipeHandler}>Save Updated Recipe</button>
                                    <button type="button" className="btn btn-secondary" onClick={toggleEdit}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="modal-body d-flex flex-column align-items-center">
                                    <form className="d-flex flex-column align-items-center">
                                        {addingFormIngedientsState.map((ingredient, index) => (
                                            <div key={index} className="col-10 d-flex justify-content-between">
                                                <input type="text" name="name" value={ingredient.name} onChange={(e) => handleIngredientChange(e, index)} />
                                                <input type="number" name="quantity" value={ingredient.quantity} onChange={(e) => handleIngredientChange(e, index)} />
                                                <button type='button' onClick={() => removeIngredient(index)}>Remove Ingredient</button>
                                            </div>
                                        ))}
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={addItemsToListHandler}>Add Items to Grocery List</button>
                                    <button type="button" className="btn btn-secondary" onClick={toggleAddingToList}>Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <div className="modal-body d-flex justify-content-center col-12">
                            <div className="col-5">
                                <h2 className="col-12 text-center text-decoration-underline">Ingredients</h2>
                                {ingredients.map((ingredient) => (
                                    <div key={ingredient._id} className="d-flex justify-content-between border-dark border">
                                        <p className="m-1">{ingredient.name}</p>
                                        <p className="m-1">{ingredient.amount}</p>
                                    </div>
                                ))}
                            </div>
                            {recipe.instructions || recipe.img ? (
                                <div className="d-flex flex-column align-items-center">
                                    {recipe.img ? (<img className="searchImg m-2" src={recipe.img} alt={recipe.name} />) : (null)}
                                    {recipe.instructions ? (<div className="m-2">
                                        <h2 className="col-12 text-center text-decoration-underline">Instructions</h2>
                                        <p>{recipe.instructions}</p>
                                    </div>) : (null)}
                                </div>
                            ) : (null)}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-green" onClick={toggleAddingToList}>Add to List</button>
                            <button type="button" className="btn btn-blue" onClick={toggleEdit}>Edit Recipe</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={removeRecipe}>Delete Recipe</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default RecipeModal;
