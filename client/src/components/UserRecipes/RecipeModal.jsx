import React, { useState, useEffect } from "react";
import { useMutation } from '@apollo/client';
import { ADD_ITEMS_TO_LIST, UPDATE_RECIPE, DELETE_RECIPE } from '../../utils/mutations';
import '../../styles/root.css';
import '../../styles/UserRecipes/recipeModal.css';

const RecipeModal = ({ recipe, refetch, userId, setLoadingState, setErrorState }) => {

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth <= 768);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const { _id, name, ingredients, instructions, URL, img } = recipe;

    const typelessIngredients = ingredients.map(ingredient => {
        const quantity = ingredient.amount.replace(/[^0-9/.]/g, '');
        const unit = ingredient.amount.replace(/[0-9/.]/g, '').trim();
        return { name: ingredient.name, quantity: quantity, unit: unit }
    });

    const defaultItemsList = ingredients.map(ingredient => {
        return { name: ingredient.name, amount: ingredient.amount, quantity: 1 }
    });

    const [editing, setEditing] = useState(false);
    const [addingToList, setAddingToList] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [modalError, setModalError] = useState('');
    const [editFormNameState, setEditFormNameState] = useState(name);
    const [editFormInstructionsState, setEditFormInstructionsState] = useState(instructions);
    const [editFormIngedientsState, setEditFormIngredientsState] = useState(typelessIngredients);
    const [addingFormIngedientsState, setAddingFormIngredientsState] = useState(defaultItemsList);

    const [addItemsToList] = useMutation(ADD_ITEMS_TO_LIST);
    const [updateRecipe] = useMutation(UPDATE_RECIPE);
    const [deleteRecipe] = useMutation(DELETE_RECIPE);

    const toggleEdit = (e) => {
        e.preventDefault();
        setEditFormNameState(name);
        setEditFormIngredientsState(typelessIngredients);
        setEditFormInstructionsState(instructions);
        setEditing(!editing);
    };

    const toggleAddingToList = (e) => {
        e.preventDefault();
        setAddingFormIngredientsState(defaultItemsList);
        setAddingToList(!addingToList);
    };

    const toggleDelete = (e) => {
        e.preventDefault();
        setDeleting(!deleting);
    };

    const handleNameChange = (event) => {
        setEditFormNameState(event.target.value);
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

    const handleInstructionsChange = (event) => {
        setEditFormInstructionsState(event.target.value);
    };

    const addItemsToListHandler = async (event) => {
        event.preventDefault();
        setLoadingState(true);
        const itemsToAdd = addingFormIngedientsState.map(ingredient => {
            return { name: ingredient.name, quantity: ingredient.quantity }
        });

        try {
            const { data } = await addItemsToList({
                variables: { userId: userId, items: itemsToAdd },
            });
            if (data) {
                toggleAddingToList(event);
                refetch();
                setLoadingState(false);
                setErrorState('');
            }
        } catch (err) {
            setErrorState('Error adding items to list');
            console.error(err);
        }
    }

    const updateRecipeHandler = async (event) => {
        event.preventDefault();
        setUpdating(true);
        const updatedIngredients = editFormIngedientsState.map(ingredient => {
            return { name: ingredient.name, amount: `${ingredient.quantity} ${ingredient.unit}` }
        });
        try {
            const { data } = await updateRecipe({
                variables: {
                    recipeId: _id,
                    name: editFormNameState,
                    ingredients: updatedIngredients,
                    instructions: editFormInstructionsState,
                },
            });
            if (data) {
                toggleEdit(event);
                refetch();
                setUpdating(false);
                setModalError('');
            }
        }
        catch (err) {
            setModalError('Error updating recipe');
            console.error(err);
        }
    };

    const removeRecipe = async (event) => {
        event.preventDefault();
        setDeleting(false);
        setLoadingState(true);
        try {
            const { data } = await deleteRecipe({
                variables: { recipeId: _id },
            });
            if (data) {
                refetch();
                setErrorState('');
                setLoadingState(false);
            }
        } catch (err) {
            setErrorState('Error deleting recipe');
            console.error(err);
        }
    };

    return (
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
                {updating &&
                    <div className="d-flex justify-content-center align-items-center m-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                }
                {modalError &&
                    <div className="alert alert-danger" role="alert">
                        {modalError}
                    </div>
                }
                {editing || addingToList ? (
                    <div>
                        {editing ? (
                            <div>
                                <div className="modal-header border-bottom border-dark">
                                    <input type="text" className="fs-2" name="name" value={editFormNameState} onChange={(e) => handleNameChange(e)} />
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setEditing(false); setAddingToList(false) }}></button>
                                </div>
                                <div className="modal-body d-flex flex-column align-items-center">
                                    <form className="d-flex flex-column align-items-center">
                                        <h2 className="col-12 text-center">Edit Recipe:</h2>
                                        <div className="col-12 d-flex align-items-center">
                                            <h3 className="col-4 text-center text-decoration-underline">{isMobile ? 'Ing.' : 'Ingredient'}</h3>
                                            <h3 className="col-2 text-center text-decoration-underline">Qty.</h3>
                                            <h3 className="col-3 text-center text-decoration-underline">Unit</h3>
                                        </div>
                                        {editFormIngedientsState.map((ingredient, index) => (
                                            <div key={index} className="col-12 d-flex my-1">
                                                <input type="text" className="col-4" name="name" placeholder="Ingredient Name" value={ingredient.name} onChange={(e) => handleIngredientChange(e, index)} />
                                                <input type="text" className="col-2" name="quantity" placeholder="Quantity" value={ingredient.quantity} onChange={(e) => handleIngredientChange(e, index)} onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9/. ]/g, ''); }} />
                                                <input type="text" className="col-3" name="unit" placeholder="Units e.g. cups, tbsp" value={ingredient.unit} onChange={(e) => handleIngredientChange(e, index)} />
                                                <button type='button' className="col-2 btn btn-sm btn-danger mx-1" onClick={() => removeIngredient(index)}>X</button>
                                            </div>
                                        ))}
                                        <button type='button' className="btn btn-primary my-1" onClick={increaseIngredientNumber}>+ Ingredient</button>
                                        <div className="col-12">
                                            <h3 className="col-12 text-center text-decoration-underline">Instructions</h3>
                                            <textarea className="col-12 form-control my-text-area" name="instructions" value={editFormInstructionsState} onChange={handleInstructionsChange} />
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-success" onClick={updateRecipeHandler}>Save Updated Recipe</button>
                                    <button type="button" className="btn btn-secondary" onClick={toggleEdit}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="modal-header border-bottom border-dark">
                                    <h1 className="modal-title">{name}</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setEditing(false); setAddingToList(false) }}></button>
                                </div>
                                <div className="modal-body d-flex flex-column align-items-center">
                                    <form className="d-flex col-12 flex-column align-items-center">
                                        <h2 className="col-12 text-center">Add Ingredients to Grocery List:</h2>
                                        <div className="col-12 d-flex">
                                            <h3 className="col-4 text-center text-decoration-underline">{isMobile ? 'Ing.' : 'Ingredient'}</h3>
                                            <h3 className="col-4 text-center text-decoration-underline">Needed</h3>
                                            <h3 className="col-2 text-center text-decoration-underline">Qty.</h3>
                                        </div>
                                        <div>
                                        </div>
                                        {addingFormIngedientsState.map((ingredient, index) => (
                                            <div key={index} className="col-12 d-flex align-items-center my-1">
                                                <input type="text" className="col-4" name="name" value={ingredient.name} onChange={(e) => handleIngredientChange(e, index)} />
                                                <p className="col-4 my-1 text-center">{ingredient.amount}</p>
                                                <input type="number" className="col-2" name="quantity" value={ingredient.quantity} onChange={(e) => handleIngredientChange(e, index)} />
                                                <button type='button' className="btn btn-danger mx-1 py-1 col-2 text-center" onClick={() => removeIngredient(index)}>X</button>
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
                        <div className="modal-header border-bottom border-dark">
                            <h1 className="modal-title">{name}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setEditing(false); setAddingToList(false) }}></button>
                        </div>
                        <div className="modal-body d-flex flex-wrap col-12 justify-content-center">
                            <div className={isMobile ? 'col-12 d-flex flex-column align-items-center' : 'col-12 d-flex flex-row-reverse justify-content-center'}>
                                {img ? (<img className={isMobile ? "img max-img-height col-10 m-1" : "img max-img-height col-5 m-1"} src={img} alt={name} />) : (null)}
                                <div className={isMobile ? "col-10 m-1" : "col-6 m-1"} >
                                    <h2 className="col-12 text-center text-decoration-underline">Ingredients</h2>
                                    {ingredients.map((ingredient, index) => (
                                        <div key={index} className="col-12 d-flex justify-content-between border-dark border">
                                            <p className="m-1">{ingredient.name}</p>
                                            <p className="m-1">{ingredient.amount}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {instructions || img ? (
                                <div className=" col-12 d-flex flex-column align-items-center">
                                    {instructions ? (
                                        <div className="mx-2">
                                            <h2 className="col-12 text-center text-decoration-underline">Instructions</h2>
                                            <p>{instructions}</p>
                                        </div>
                                    ) : (null)}
                                </div>
                            ) : (null)}
                        </div>
                        {deleting ? (
                            <div className="modal-footer">
                                <p>Are you sure you want to delete recipe?</p>
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={removeRecipe}>Confirm Delete</button>
                                <button type="button" className="btn btn-secondary" onClick={toggleDelete}>Cancel</button>
                            </div>
                        ) : (
                            <div className={`modal-footer ${isMobile && 'd-flex flex-wrap justify-content-evenly'}`}>
                                <button type="button" className={`btn btn-success ${isMobile && 'col-5'}`} onClick={toggleAddingToList}>Add to List</button>
                                <button type="button" className={`btn btn-primary ${isMobile && 'col-5'}`} onClick={toggleEdit}>Edit Recipe</button>
                                <button type="button" className={`btn btn-danger ${isMobile && 'col-5'}`} onClick={toggleDelete}>Delete Recipe</button>
                                <button type="button" className={`btn btn-secondary ${isMobile && 'col-5'}`} data-bs-dismiss="modal">Close</button>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div >
    )
}

export default RecipeModal;
