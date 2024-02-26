import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';
import { UPDATE_USER_LIST } from '../utils/mutations';
import '../styles/list.css';
import Auth from '../utils/auth';

const List = () => {
    const user = Auth.getProfile();
    const id = user.data._id;

    const [fixedList, setFixedList] = useState(false);
    const [editing, setEditing] = useState(false);
    const [loadingState, setLoadingState] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [err, setErr] = useState('');
    const [shoppingList, setShoppingList] = useState([]);
    const [shoppingListEditState, setShoppingListEditState] = useState([]);

    const [updateUserList] = useMutation(UPDATE_USER_LIST);

    const setStates = async (data) => {
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
        if (loading) {
            setLoadingState(true);
        }
        if (error) {
            setErr('Error loading shopping list.');
            console.log(error);
        }
        if (!loading && !error && data && shoppingListEditState.length === 0) {
            setErr('');
            setLoadingState(false);
            setStates(data);
        }
    }, [loading, error, data, shoppingListEditState]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition >= 1046) {
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
                setErr('');
                setLoadingState(false);
            }
        } catch (err) {
            setErr('Error refetching shopping list.');
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
        setLoadingState(true);
        try {
            const { data } = await updateUserList({
                variables: { userId: id, shoppingList: shoppingListEditState },
            });
            if (data) {
                refetchHandler();
                setErr('');
                toggleEdit(event)
                setLoadingState(false);
            }
        } catch (err) {
            setErr('Error updating shopping list; try again.');
            console.error(err);
        }
    }

    const removeAllItems = async (event) => {
        event.preventDefault();
        setLoadingState(true);
        try {
            const { data } = await updateUserList({
                variables: { userId: id, shoppingList: [] },
            });
            if (data) {
                refetchHandler();
                setErr('');
                setRemoving(false);
            }
        } catch (err) {
            setErr('Error removing all items from shopping list.');
            console.error(err);
        }
    }

    return (
        <div className="fade-in list-page col-12 d-flex flex-column align-items-center">
            <div className="body-bg"></div>
            {loadingState &&
                <div className="d-flex justify-content-center align-items-center my-1">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>}
            <div className={`bg-yellow list-card col-xxl-5 col-xl-6 col-lg-7 col-md-8 col-sm-10 col-11 d-flex flex-column align-items-center justify-content-between ${fixedList ? 'list-container-fixed' : 'list-container-absolute'}`}>
                <h1 className="mt-1 text-blue text-center bubblegum border-bottom-blue col-8">My Shopping List</h1>
                {err && <div className="alert alert-danger">{err}</div>}
                <div className='d-flex flex-column col-11 border-blue text-blue main-shopping-list'>
                    {editing ? (
                        <div className="d-flex flex-wrap justify-content-center">
                            {shoppingListEditState.map((ingredient, index) =>
                                <div key={index} className="col-12 d-flex mb-1">
                                    <input type="text" className="col-8 fs-4" name="name" placeholder="Item Name" value={ingredient.name} onChange={(e) => handleItemChange(e, index)} />
                                    <input type="number" className="col-2 fs-4" name="quantity" placeholder="Qty." value={ingredient.quantity} onChange={(e) => handleItemChange(e, index)} />
                                    <div className="col-1 d-flex justify-content-center align-items-center">
                                        <button type='button' className="btn btn-danger ms-3" onClick={() => removeItem(index)}>X</button>
                                    </div>
                                </div>
                            )}
                            <button type='button' className="btn btn-primary my-1 col-12" onClick={addItemToList}>+ Item</button>
                        </div>
                    ) : (
                        shoppingList.map((ingredient, index) =>
                            <div key={index} className="col-12 d-flex align-items-center border border-dark py-1">
                                <div className="col-1 d-flex justify-content-center align-items-center">
                                    <input type="checkbox" className="form-check-input m-1 myCheckBox" />
                                </div>
                                <p name="name" className="col-8 fs-4 m-0">{ingredient.name} </p>
                                <p name="name" className="col-3 fs-4 border-start border-dark m-0">{ingredient.quantity} </p>
                            </div>
                        )
                    )}
                </div>
                {removing || editing ? (
                    <div className="my-3">
                        {editing ? (
                            <div>
                                <button type="button" className="btn btn-success" onClick={updateShoppingListHandler}>Save changes</button>
                                <button type="button" className="btn btn-secondary mx-1" onClick={toggleEdit}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                <button type="button" className="btn btn-danger  mx-1" onClick={removeAllItems}>Clear All Items?</button>
                                <button type="button" className="btn btn-secondary" onClick={toggleRemove}>Cancel</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="my-3">
                        <button type="button" className="btn btn-primary" onClick={toggleEdit}>Edit List</button>
                        <button type="button" className="btn btn-danger mx-1" onClick={toggleRemove}>Clear List</button>
                    </div>
                )}


            </div>
        </div>
    );
};

export default List;