import React, { useState } from "react";
import { useQuery, useMutation } from '@apollo/client';
import { ADD_ITEMS_TO_LIST, UPDATE_RECIPE, DELETE_RECIPE } from '../utils/mutations';

const RecipeModal = ({ recipe, refetch, userId }) => {

    const { _id, name, ingredients, URL, img } = recipe;

    const [editing, setEditing] = useState(false);
    const [editFormNameState, setEditFormNameState] = useState(name);
    const [editFormIngedientsState, setEditFormIngredientsState] = useState(ingredients);

    const [addItemsToList] = useMutation(ADD_ITEMS_TO_LIST);
    const [updateRecipe] = useMutation(UPDATE_RECIPE);
    const [deleteRecipe] = useMutation(DELETE_RECIPE);

    const toggleEdit = (e) => {
        e.preventDefault();
        setEditFormIngredientsState(ingredients);
        setEditing(!editing);
    };

    const handleIngredientChange = (event, index) => {
        const { name, value } = event.target;
        setEditFormIngredientsState(prevIngredients => {
            const updatedIngredients = [...prevIngredients];
            updatedIngredients[index] = {
                ...updatedIngredients[index],
                [name]: name === 'quantity' ? Number(value) : value
            };
            return updatedIngredients;
        });
    };

    const addItemsToListHandler = async (event) => {
        event.preventDefault();
        let newIngredients = []
        for (let i = 0; i < ingredients.length; i++) {
            const newIngredient = { name: ingredients[i].name, quantity: ingredients[i].quantity };
            newIngredients.push(newIngredient)
        }
        console.log(userId, newIngredients)
        try {
            const { data } = await addItemsToList({
                variables: { userId: userId, items: newIngredients },
            });
            console.log(data);
            refetch();
        } catch (err) {
            console.error(err);
        }
    }



    const removeRecipe = async (event) => {
        event.preventDefault();
        try {
            const { data } = await deleteRecipe({
                variables: { recipeId: _id },
            });
            console.log(data);
            refetch();
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">{name}</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                {editing ? (
                    <div className="modal-body d-flex flex-column align-items-center">
                        <form className="d-flex flex-column align-items-center">
                            {editFormIngedientsState.map((ingredient, index) => (
                                <div key={index} className="col-6 d-flex justify-content-between">
                                    <input type="text" name="name" value={ingredient.name} onChange={(e) => handleIngredientChange(e, index)} />
                                    <input type="number" name="quantity" value={ingredient.quantity} onChange={(e) => handleIngredientChange(e, index)} />
                                </div>
                            ))}
                        </form>
                        <button type="button" className="btn btn-primary" onClick={toggleEdit}>Save</button>
                    </div>
                ) : (
                    <div className="modal-body d-flex flex-column align-items-center">
                        {ingredients.map((ingredient) => (
                            <div key={ingredient._id} className="col-6 d-flex justify-content-between">
                                <p>{ingredient.name}</p>
                                <p>{ingredient.quantity}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="modal-footer">
                    <button type="button" className="btn btn-success" onClick={addItemsToListHandler}>Add to List</button>
                    <button type="button" className="btn btn-primary" onClick={toggleEdit}>Edit Recipe</button>
                    <button type="button" className="btn btn-danger" onClick={removeRecipe} data-bs-dismiss="modal">Delete Recipe</button>
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    )
}

export default RecipeModal;
