import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';
import { UPDATE_USER_LIST } from '../utils/mutations';
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

    useEffect(() => {
        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error! {error.message}</div>;
        }
    }, [loading, error, data]);


    const [updateUserList] = useMutation(UPDATE_USER_LIST);

    const recipes = data.user.savedRecipes || [];

    const customRecipes = recipes.filter((recipe) => recipe.custom);
    const savedRecipes = recipes.filter((recipe) => !recipe.custom);

    const shoppingList = data.user.shoppingList;

    const typelessItems = shoppingList.map(item => {
        return { name: item.name, quantity: item.quantity }
    });

    const [editing, setEditing] = useState(false);
    const [shoppingListState, setShoppingListState] = useState(typelessItems);

    const toggleEdit = (e) => {
        e.preventDefault();
        setEditing(!editing);
    };

    const handleItemChange = (event, index) => {
        const { name, value } = event.target;
        setShoppingListState(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[index] = {
                ...updatedItems[index],
                [name]: name === 'quantity' ? Number(value) : value
            };
            return updatedItems;
        });
    };

    const removeItem = (index) => {
        // Creates shallow copy of shoppingListState to avoid mutating state directly
        const list = [...shoppingListState];
        list.splice(index, 1);
        setShoppingListState(list);
    };

    const updateShoppingListHandler = async (event) => {
        event.preventDefault();
        try {
            const { data } = await updateUserList({
                variables: { userId: id, items: shoppingListState },
            });
            if (data) {
                toggleEdit(event)
                refetch();
            }
        } catch (err) {
            console.error(err);
        }
    }

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
                        {shoppingListState.map((ingredient, index) =>
                            editing ? (
                                <div key={index} className="col-12 d-flex justify-content-between">
                                    <input type="text" name="name" value={ingredient.name} onChange={(e) => handleItemChange(e, index)} />
                                    <input type="number" name="quantity" value={ingredient.quantity} onChange={(e) => handleItemChange(e, index)} />
                                    <button type='button' onClick={() => removeItem(index)}>X</button>
                                </div>
                            ) : (
                                <div key={index} className="col-12 d-flex justify-content-between">
                                    <p name="name">{ingredient.name} </p>
                                    <p name="name">{ingredient.quantity} </p>
                                </div>
                            )
                        )}
                    </ul>
                </div>
                {editing ? (
                    <div>
                        <button type="button" className="btn btn-primary" onClick={updateShoppingListHandler}>Save changes</button>
                        <button type="button" className="btn btn-secondary" onClick={toggleEdit}>Cancel</button>
                    </div>
                ) : (
                    <div>
                        <button type="button" className="btn btn-primary" onClick={toggleEdit}>Edit List</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserRecipes;
