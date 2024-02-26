import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';
import { UPDATE_USER_LIST } from '../utils/mutations';
import Auth from '../utils/auth';
import MobileUserRecipes from '../components/UserRecipes/MobileUserRecipes';
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
    const [myRecipes, setMyRecipes] = useState([]);

    const [updateUserList] = useMutation(UPDATE_USER_LIST);

    const setStates = async (data) => {
        const recipes = data.user.savedRecipes || [];
        const customRecipes = recipes.filter(recipe => recipe.custom === true);
        const savedRecipes = recipes.filter(recipe => recipe.custom === false);
        const sortedRecipes = customRecipes.concat(...savedRecipes);
        setMyRecipes(sortedRecipes);

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

    const updateSearch = (search) => {
        const currentRecipes = data.user.savedRecipes || [];
        const searchResults = currentRecipes.filter((recipe) => recipe.name.toLowerCase().includes(search.toLowerCase()))
        setMyRecipes(searchResults);
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

    const draggedItem = useRef(null);

    const handleDragStart = (event, item, index) => {
        draggedItem.current = { item, index };
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event, targetIndex) => {
        event.preventDefault();
        const sourceIndex = draggedItem.current.index;
        const draggedItemData = draggedItem.current.item;

        const newList = [...shoppingListEditState];

        newList.splice(sourceIndex, 1);

        newList.splice(targetIndex, 0, draggedItemData);

        setShoppingListEditState(newList);
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
            <div className='body-bg'></div>
            {loadingState &&
                <div className="d-flex justify-content-center align-items-center m-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            }
            {errorState && <div className="alert alert-danger" role="alert">{errorState}</div>}
            {isMobile ? (
                <MobileUserRecipes
                    id={id}
                    myRecipes={myRecipes}
                    editing={editing}
                    removing={removing}
                    shoppingList={shoppingList}
                    shoppingListEditState={shoppingListEditState}
                    updateSearch={updateSearch}
                    refetchHandler={refetchHandler}
                    handleDragStart={handleDragStart}
                    handleDragOver={handleDragOver}
                    handleDrop={handleDrop}
                    handleItemChange={handleItemChange}
                    addItemToList={addItemToList}
                    removeItem={removeItem}
                    updateShoppingListHandler={updateShoppingListHandler}
                    removeAllItems={removeAllItems}
                    toggleEdit={toggleEdit}
                    toggleRemove={toggleRemove}
                    setErrorState={setErrorState}
                />
            ) : (
                <div className='myRecipes d-flex fade-in mt-3'>
                    <div className='col-lg-9 col-8 d-flex flex-column align-items-center myBody'>
                        <h1 className='border-bottom-blue bubblegum col-3 text-center'>My Recipes</h1>
                        <div className='col-3'>
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
                            <NewRecipeForm id={id} refetch={refetchHandler} loadingState={loadingState} setLoadingState={setLoadingState} setErrorState={setErrorState} />
                        </div>

                        <div className='d-flex flex-wrap col-12 justify-content-center'>
                            {myRecipes.map((recipe) => (
                                <RecipeCard key={recipe._id} recipe={recipe} refetch={refetchHandler} userId={id} setLoadingState={setLoadingState} setErrorState={setErrorState} />
                            ))}
                        </div>
                    </div>

                    <div className={`col-lg-3 col-4 list-container bg-yellow border-blue d-flex flex-column align-items-center py-1 px-3' ${fixedList ? 'list-container-fixed' : 'list-container-absolute'}`}>
                        <h1 className='border-bottom-blue text-center col-12 bubblegum'>Shopping List</h1>
                        <div className='d-flex flex-column align-items-center col-xl-10 col-11 shopping-list bg-yellow border-blue'>
                            {editing ? (
                                <div className='d-flex flex-wrap'>
                                    {shoppingListEditState.map((ingredient, index) =>
                                        <div key={index} className="col-12 d-flex justify-content-evenly mb-1"
                                            draggable
                                            onDragStart={(event) => handleDragStart(event, ingredient, index)}
                                            onDragOver={(event) => handleDragOver(event)}
                                            onDrop={(event) => handleDrop(event, index)}
                                        >
                                            <button type='button' className="btn btn-sm btn-danger col-1" onClick={() => removeItem(index)}>X</button>
                                            <div className='col-10 d-flex justify-content-end'>
                                                <input type="text" className="col-10 fs-5 text-blue" name="name" value={ingredient.name} onChange={(e) => handleItemChange(e, index)} />
                                                <input type="number" className="col-2 fs-5 text-blue ms-1" name="quantity" value={ingredient.quantity} onChange={(e) => handleItemChange(e, index)} />
                                            </div>
                                        </div>)}
                                    <button type='button' className="btn btn-primary my-1 col-12" onClick={addItemToList}>+ Item</button>
                                </div>
                            ) : (
                                <div className='col-12 '>
                                    {shoppingList.map((ingredient, index) =>
                                        <div key={index} className="col-12 d-flex border border-dark text-blue">
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
