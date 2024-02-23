import React from 'react';
import NewRecipeForm from './NewRecipeForm';
import RecipeCard from './RecipeCard';
import '../../styles/root.css';
import '../../styles/UserRecipes/userRecipes.css';

const MobileUserRecipes = ({ id, myRecipes, editing, removing, shoppingListEditState,
    shoppingList, updateSearch, refetchHandler, handleDragStart, handleDragOver, handleDrop, handleItemChange, addItemToList, removeItem,
    updateShoppingListHandler, removeAllItems, toggleEdit, toggleRemove }) => {

    return (
        <div className='myRecipes d-flex justify-content-center fade-in'>
            <div className='col-12 d-flex flex-column align-items-center myBody'>
                <h1 className='fs-1'>My Recipes</h1>
                <div className='col-8'>
                    <input
                        type="text"
                        placeholder="Search by name"
                        name="searchName"
                        className="form-control mx-1 text-blue"
                        onChange={(e) => updateSearch(e.target.value)}
                        required
                    />

                </div>
                <button type="button" className="btn btn-primary my-3" data-bs-toggle="modal" data-bs-target="#NewRecipeModal">
                    Create New Recipe
                </button>

                <div className="modal fade" id="NewRecipeModal" tabIndex="-1" aria-labelledby="NewRecipeModalLabel" aria-hidden="true">
                    <NewRecipeForm id={id} refetch={refetchHandler} />
                </div>

                <div className='d-flex flex-wrap col-12 justify-content-center'>
                    {myRecipes.map((recipe) => (
                        <RecipeCard recipe={recipe} refetch={refetchHandler} userId={id} />
                    ))}
                </div>
            </div>

            <button className="mobile-list-btn btn btn-yellow d-flex flex-column justify-content-center align-items-center text-center fs-4" type="button" data-bs-toggle="offcanvas" data-bs-target="#listOffCanvas" aria-controls="listOffCanvas">
                <p className='m-0'>List</p>
            </button>

            <div className="offcanvas offcanvas-end bg-yellow" tabIndex="-1" id="listOffCanvas" aria-labelledby="listOffCanvasLabel">
                <div className="offcanvas-header">
                    <h1 className='offcanvas-title bubblegum fs-1 text-blue'>Shopping List</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body text-blue bg-yellow">
                    <div className='col-12 ms-2'>
                        <div className='d-flex flex-column col-xl-10 col-11'>
                            {editing ? (
                                <div className='d-flex flex-wrap justify-content-center'>
                                    {shoppingListEditState.map((ingredient, index) =>
                                        <div key={index} className="col-12 d-flex mb-1"
                                            draggable
                                            onDragStart={(event) => handleDragStart(event, ingredient, index)}
                                            onDragOver={(event) => handleDragOver(event)}
                                            onDrop={(event) => handleDrop(event, index)}
                                        >
                                            <input type="text" className="col-7 fs-5" name="name" value={ingredient.name} onChange={(e) => handleItemChange(e, index)} />
                                            <input type="number" className="col-4 fs-5" name="quantity" value={ingredient.quantity} onChange={(e) => handleItemChange(e, index)} />
                                            <button type='button' className="btn btn-sm btn-danger mx-1" onClick={() => removeItem(index)}>X</button>
                                        </div>)}
                                    <button type='button' className="btn btn-primary my-1 col-12" onClick={addItemToList}>+ Item</button>
                                </div>
                            ) : (
                                shoppingList.map((ingredient, index) =>
                                    <div key={index} className="col-12 d-flex border border-dark">
                                        <p name="name" className="col-7 fs-5 m-1 border-end border-dark">{ingredient.name} </p>
                                        <p name="name" className="col-4 fs-5 m-1">{ingredient.quantity} </p>
                                    </div>
                                )
                            )}
                        </div>
                        {editing ? (
                            <div className='mt-2'>
                                <div>
                                    <button type="button" className="btn btn-success" onClick={updateShoppingListHandler}>Save changes</button>
                                    <button type="button" className="btn btn-secondary mx-1" onClick={toggleEdit}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className='mt-2'>
                                {removing ? (
                                    <div>
                                        <button type="button" className="btn btn-danger  mx-1" onClick={removeAllItems}>Clear All Items?</button>
                                        <button type="button" className="btn btn-secondary" onClick={toggleRemove}>Cancel</button>
                                    </div>
                                ) : (
                                    <div>
                                        <button type="button" className="btn btn-primary" onClick={toggleEdit}>Edit List</button>
                                        <button type="button" className="btn btn-danger mx-1" onClick={toggleRemove}>Clear List</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default MobileUserRecipes;
