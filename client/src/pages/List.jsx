import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';
import { UPDATE_USER_LIST } from '../utils/mutations';
import '../styles/list.css';
import Auth from '../utils/auth';

const List = () => {
    const user = Auth.getProfile();
    const id = user.data._id;

    const [editing, setEditing] = useState(false);
    const [err, setErr] = useState('');
    const [shoppingList, setShoppingList] = useState([]);
    const [shoppingListEditState, setShoppingListEditState] = useState([]);

    const [updateUserList] = useMutation(UPDATE_USER_LIST);

    const setStates = async (data) => {
        const shoppingList = data.user.shoppingList || [];

        const typelessShoppingList = shoppingList.map(item => {
            return { name: item.name, quantity: item.quantity };
        });

        setShoppingList(shoppingList);
        setShoppingListEditState(typelessShoppingList);
    }

    const { loading, error, data, refetch } = useQuery(QUERY_USER, {
        variables: { id: id },
    });

    useEffect(() => {
        if (loading) {
            console.log('Loading...');
        }
        if (error) {
            console.log(error);
        }
        if (!loading && !error && data && shoppingListEditState.length === 0) {
            setStates(data);
        }
    }, [loading, error, data, shoppingListEditState]);

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
                setErr('');
                toggleEdit(event)
            }
        } catch (err) {
            setErr('Error updating shopping list; please fill out all fields and try again.');
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
                toggleEdit(event)
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="fade-in col-12 d-flex flex-column align-items-center">
            <div className="body-bg"></div>
            <div className="bg-green col-5 card d-flex flex-column align-items-center">
                <h1 className="text-light">My Shopping List</h1>
                {err && <div className="alert alert-danger">{err}</div>}
                <div className='d-flex justify-content-end col-10'>
                    <h2 className='col-8 text-light'>Item</h2>
                    <h2 className='col-3 text-light'>Quantity</h2>
                </div>
                <div className='d-flex flex-column col-10 text-blue'>
                    {editing ? (
                        <div className="d-flex flex-wrap justify-content-center">
                            {shoppingListEditState.map((ingredient, index) =>
                                <div key={index} className="col-12 d-flex mb-1">
                                    <input type="text" className="col-9 fs-4" name="name" placeholder="Item Name" value={ingredient.name} onChange={(e) => handleItemChange(e, index)} />
                                    <input type="number" className="col-2 fs-4" name="quantity" placeholder="Qty." value={ingredient.quantity} onChange={(e) => handleItemChange(e, index)} />
                                    <div className="col-1 d-flex justify-content-center align-items-center">
                                        <button type='button' className="btn btn-danger" onClick={() => removeItem(index)}>X</button>
                                    </div>
                                </div>
                            )}
                            <button type='button' className="btn btn-primary my-1 col-12" onClick={addItemToList}>+ Item</button>
                        </div>
                    ) : (
                        shoppingList.map((ingredient, index) =>
                            <div key={index} className="bg-w col-12 d-flex align-items-center border border-dark py-1">
                                <div className="col-1 d-flex justify-content-center align-items-center">
                                    <input type="checkbox" className="form-check-input m-1 myCheckBox" />
                                </div>
                                <p name="name" className="col-8 fs-4 m-0">{ingredient.name} </p>
                                <p name="name" className="col-3 fs-4 border-start border-dark m-0">{ingredient.quantity} </p>
                            </div>
                        )
                    )}
                </div>
                {editing ? (
                    <div className="py-1">
                        <button type="button" className="btn btn-success" onClick={updateShoppingListHandler}>Save changes</button>
                        <button type="button" className="btn btn-secondary mx-1" onClick={toggleEdit}>Cancel</button>
                    </div>
                ) : (
                    <div className="py-1">
                        <button type="button" className="btn btn-primary" onClick={toggleEdit}>Edit List</button>
                        <button type="button" className="btn btn-danger mx-1" onClick={removeAllItems}>Remove All Items</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default List;