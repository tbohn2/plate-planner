import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER, LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const Login = () => {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [signingUp, setSigningUp] = useState(false);

    const toggleSignup = () => {
        setSigningUp(!signingUp);
    };

    const updateForm = (event) => {
        const { name, value } = event.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const [addUser] = useMutation(ADD_USER);
    const [login] = useMutation(LOGIN_USER);

    const loginUser = async (event) => {
        event.preventDefault();
        try {
            const { email, password } = formState;
            console.log(email, password);
            const { data } = await login({
                variables: { email, password },
            });
            Auth.login(data.login.token);
        } catch (err) {
            console.error(err);
        }
    };

    const addNewUser = async (event) => {
        event.preventDefault();
        try {
            const { name, email, password } = formState;
            const { data } = await addUser({
                variables: { name, email, password },
            });
            Auth.login(data.addUser.token);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className=''>
            {signingUp ? (
                <div className=''>
                    <h2 className=''>Create Account</h2>
                    <form onSubmit={addNewUser} className=''>
                        <input
                            className=''
                            placeholder='First Name'
                            name='name'
                            onChange={updateForm}
                            required
                        />
                        <input
                            className=''
                            placeholder='Email'
                            name='email'
                            onChange={updateForm}
                            required
                        />
                        <input
                            className=''
                            type='password'
                            placeholder='Password'
                            name='password'
                            onChange={updateForm}
                            required
                        />
                        <div className=''>
                            <button className='' type='submit'>
                                Create Account
                            </button>
                        </div>
                    </form>
                    <button className='' onClick={toggleSignup}>
                        Already have an account?
                    </button>
                </div>
            ) : (
                <div className=''>
                    <h2 className=''>Login</h2>
                    <form onSubmit={loginUser} className=''>
                        <input
                            className=''
                            placeholder='Email'
                            name='email'
                            onChange={updateForm}
                            required
                        />
                        <input
                            className=''
                            type='password'
                            placeholder='Password'
                            name='password'
                            onChange={updateForm}
                            required
                        />
                        <div className=''>
                            <button className='' type='submit'>
                                Log In
                            </button>
                        </div>
                    </form>
                    <button className='' onClick={toggleSignup}>
                        Click here to create an account
                    </button>
                </div>
            )}

        </div>
    );
};

export default Login;
