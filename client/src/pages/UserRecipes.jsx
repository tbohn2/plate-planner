import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';
import { UPDATE_USER_LIST } from '../utils/mutations';
import Auth from '../utils/auth';
import NewRecipeForm from '../components/UserRecipes/NewRecipeForm';
import RecipeCard from '../components/UserRecipes/RecipeCard';
import '../styles/root.css';
import '../styles/UserRecipes/userRecipes.css';

const UserRecipes = () => {
    const user = Auth.getProfile();
    const id = user.data._id;

    const [fixedList, setFixedList] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [loadingState, setLoadingState] = useState(false);
    const [errorState, setErrorState] = useState(null);
    const [editing, setEditing] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [shoppingList, setShoppingList] = useState([]);
    const [shoppingListEditState, setShoppingListEditState] = useState([]);
    const [customRecipes, setCustomRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);

    const [updateUserList] = useMutation(UPDATE_USER_LIST);

    const setStates = async (data) => {
        const recipes = data.user.savedRecipes || [];
        setCustomRecipes(recipes.filter((recipe) => recipe.custom));
        setSavedRecipes(recipes.filter((recipe) => !recipe.custom));

        const shoppingList = data.user.shoppingList || [];

        const typelessShoppingList = shoppingList.map(item => {
            return { name: item.name, quantity: item.quantity };
        });

        if (shoppingList.length !== 0) {
            setShoppingList(shoppingList);
            setShoppingListEditState(typelessShoppingList);
        }
        else {
            setShoppingList([{ name: 'No items in list', quantity: 0 }]);
            setShoppingListEditState([{ name: 'No items in list', quantity: 0 }]);
        }
    }

    const { loading, error, data, refetch } = useQuery(QUERY_USER, {
        variables: { id: id },
    });

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth <= 768);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (loading) {
            setLoadingState(true);
        }
        if (error) {
            setErrorState("Error loading data");
            console.error(error);
        }
        if (!loading && !error && data && shoppingListEditState.length === 0) {
            setErrorState(null);
            setLoadingState(false);
            setStates(data);
        }
    }, [loading, error, data, shoppingListEditState]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            console.log(scrollPosition);
            if (scrollPosition >= 146) {
                setFixedList(true);
            } else {
                setFixedList(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const refetchHandler = async () => {
        try {
            const refetchedData = await refetch();
            const updatedData = refetchedData.data;
            if (updatedData) {
                setStates(updatedData);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const toggleEdit = (e) => {
        e.preventDefault();
        if (!editing) {
            setShoppingListEditState([]);
        }
        setEditing(!editing);
    };

    const toggleRemove = (e) => {
        e.preventDefault();
        setRemoving(!removing);
    };

    const handleItemChange = (event, index) => {
        const { name, value } = event.target;
        setShoppingListEditState(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[index] = {
                ...updatedItems[index],
                [name]: name === 'quantity' ? Number(value) : value
            };
            return updatedItems;
        });
    };

    const addItemToList = () => {
        setShoppingListEditState(prevItems => [...prevItems, { name: '', quantity: '' }]);
    };

    const removeItem = (index) => {
        // Creates shallow copy of shoppingListEditState to avoid mutating state directly
        const list = [...shoppingListEditState];
        list.splice(index, 1);
        setShoppingListEditState(list);
    };

    const updateShoppingListHandler = async (event) => {
        event.preventDefault();
        try {
            const { data } = await updateUserList({
                variables: { userId: id, shoppingList: shoppingListEditState },
            });
            if (data) {
                refetchHandler();
                toggleEdit(event)
            }
        } catch (err) {
            console.error(err);
        }
    }

    const removeAllItems = async (event) => {
        event.preventDefault();
        try {
            const { data } = await updateUserList({
                variables: { userId: id, shoppingList: [] },
            });
            if (data) {
                refetchHandler();
                toggleRemove(event)
            }
        } catch (err) {
            console.error(err);
        }
    }


    return (
        <div>
            {loadingState &&
                <div>
                    <h1 className='col-12 text-center fst-italic'>Welcome!</h1>
                    <h2 className='col-12 text-center fst-italic'>Loading Data</h2>
                    <div className="d-flex justify-content-center align-items-center m-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            }
            {errorState && <div className="alert alert-danger" role="alert">{errorState}</div>}
            {isMobile ? (
                <div className='myRecipes d-flex justify-content-center fade-in'>
                    <div className='col-12 d-flex flex-column align-items-center myBody'>
                        <h1 className='fs-1'>My Recipes</h1>
                        <div className='d-flex flex-wrap col-12 justify-content-center'>
                            {customRecipes.map((recipe) => (
                                <RecipeCard recipe={recipe} refetch={refetchHandler} userId={id} />
                            ))}
                        </div>

                        <button type="button" className="btn btn-primary my-3" data-bs-toggle="modal" data-bs-target="#NewRecipeModal">
                            Create New Recipe
                        </button>

                        <div className="modal fade" id="NewRecipeModal" tabIndex="-1" aria-labelledby="NewRecipeModalLabel" aria-hidden="true">
                            <NewRecipeForm id={id} refetch={refetchHandler} />
                        </div>

                        <h1 className='fs-1'>Saved Recipes</h1>
                        <div className='d-flex flex-wrap col-12 justify-content-center'>
                            {savedRecipes.map((recipe) => (
                                <RecipeCard recipe={recipe} refetch={refetchHandler} userId={id} />
                            ))}
                        </div>
                    </div>
                    <div className='mobile-list-btn-container' >
                        <button class="mobile-list-btn btn btn-primary text-break text-center fs-4 pe-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#listOffCanvas" aria-controls="listOffCanvas">
                            &larr;List&larr;
                        </button>
                    </div>

                    <div className="offcanvas offcanvas-end bg-light-yellow" tabindex="-1" id="listOffCanvas" aria-labelledby="listOffCanvasLabel">
                        <div className="offcanvas-header border-bottom border-dark">
                            <h1 className='offcanvas-title fs-1'>Shopping List</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div class="offcanvas-body">
                            <div className='col-12 border ms-2'>
                                <div className='d-flex col-xl-10 col-11'>
                                    <h2 className='col-7'>Item</h2>
                                    <h2 className='col-4'>Quantity</h2>
                                </div>
                                <div className='d-flex flex-column col-xl-10 col-11'>
                                    {editing ? (
                                        <div className='d-flex flex-wrap justify-content-center'>
                                            {shoppingListEditState.map((ingredient, index) =>
                                                <div key={index} className="col-12 d-flex mb-1">
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
            ) : (
                <div className='myRecipes d-flex fade-in mt-3'>
                    <div className='col-lg-9 col-8 d-flex flex-column align-items-center myBody'>
                        <h1 className='border-bottom-blue'>My Recipes</h1>
                        <div className='d-flex flex-wrap col-12 justify-content-center'>
                            {customRecipes.map((recipe) => (
                                <RecipeCard recipe={recipe} refetch={refetchHandler} userId={id} />
                            ))}
                        </div>

                        <button type="button" className="btn btn-primary my-3" data-bs-toggle="modal" data-bs-target="#NewRecipeModal">
                            Create New Recipe
                        </button>

                        <div className="modal fade" id="NewRecipeModal" tabIndex="-1" aria-labelledby="NewRecipeModalLabel" aria-hidden="true">
                            <NewRecipeForm id={id} refetch={refetchHandler} />
                        </div>

                        <div className='d-flex flex-wrap col-12 justify-content-center'>
                            {savedRecipes.map((recipe) => (
                                <RecipeCard recipe={recipe} refetch={refetchHandler} userId={id} />
                            ))}
                        </div>
                    </div>

                    <div className={`col-lg-3 col-4 list-container d-flex flex-column align-items-center py-1 px-3' ${fixedList ? 'list-container-fixed' : 'list-container-absolute'}`}>
                        <h1 className='border-bottom-blue text-center col-12'>Shopping List</h1>
                        <div className='d-flex justify-content-end col-xl-10 col-12'>
                            <h2 className={editing ? 'col-9' : 'col-10'}>Item</h2>
                            <h2 className='col-2'>Qty.</h2>
                        </div>
                        <div className='d-flex flex-column align-items-center col-xl-10 col-12 shopping-list'>
                            {editing ? (
                                <div className='d-flex flex-wrap'>
                                    {shoppingListEditState.map((ingredient, index) =>
                                        <div key={index} className="col-12 d-flex justify-content-end mb-1">
                                            <button type='button' className="btn btn-sm btn-danger col-1" onClick={() => removeItem(index)}>X</button>
                                            <input type="text" className="col-9 fs-5" name="name" value={ingredient.name} onChange={(e) => handleItemChange(e, index)} />
                                            <input type="number" className="col-2 fs-5" name="quantity" value={ingredient.quantity} onChange={(e) => handleItemChange(e, index)} />
                                        </div>)}
                                    <button type='button' className="btn btn-primary my-1 col-12" onClick={addItemToList}>+ Item</button>
                                </div>
                            ) : (
                                <div className=' col-12'>
                                    {shoppingList.map((ingredient, index) =>
                                        <div key={index} className="col-12 d-flex border border-dark">
                                            <p name="name" className="col-10 fs-5 px-1 my-1 border-end border-dark">{ingredient.name} </p>
                                            <p name="name" className="col-2 fs-5 px-1 my-1">{ingredient.quantity} </p>
                                        </div>)}
                                </div>
                            )
                            }
                        </div>
                        {editing ? (
                            <div className='mt-2 list-btns'>
                                <div>
                                    <button type="button" className="btn btn-success" onClick={updateShoppingListHandler}>Save changes</button>
                                    <button type="button" className="btn btn-secondary mx-1" onClick={toggleEdit}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className='mt-2 list-btns'>
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
            )
            }
        </div>
    )
};

export default UserRecipes;
