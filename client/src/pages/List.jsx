import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';
import { UPDATE_USER_LIST } from '../utils/mutations';
import '../styles/list.css';
import Auth from '../utils/auth';

const List = () => {
    if (!Auth.loggedIn()) {
        window.location.assign('/login');
    }

    const user = Auth.getProfile();
    const id = user.data._id;

    const [editing, setEditing] = useState(false);
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

    return (
        <div className="col-12 d-flex flex-column align-items-center">
            <h1>My Shopping List</h1>
            <div className='d-flex justify-content-end col-6'>
                <h2 className='col-7'>Item</h2>
                <h2 className='col-4'>Quantity</h2>
            </div>
            <div className='d-flex flex-column col-6'>
                {editing ? (
                    shoppingListEditState.map((ingredient, index) =>
                        <div key={index} className="col-12 d-flex">
                            <input type="text" className="col-8" name="name" value={ingredient.name} onChange={(e) => handleItemChange(e, index)} />
                            <input type="number" className="col-3" name="quantity" value={ingredient.quantity} onChange={(e) => handleItemChange(e, index)} />
                            <button type='button' className="btn btn-danger" onClick={() => removeItem(index)}>X</button>
                        </div>
                    )
                ) : (
                    shoppingList.map((ingredient, index) =>
                        <div key={index} className="col-12 d-flex justify-content-end">
                            <input type="checkbox" className="form-check-input m-1 myCheckBox" />
                            <p name="name" className="col-7 fs-4">{ingredient.name} </p>
                            <p name="name" className="col-4 fs-4">{ingredient.quantity} </p>
                        </div>
                    )
                )}
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
    );
};

export default List;