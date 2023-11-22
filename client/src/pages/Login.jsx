import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER, LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const Login = () => {
    const [formState, setFormState] = useState({
        email: '',
        password: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const [addUser] = useMutation(ADD_USER);
    const [login] = useMutation(LOGIN_USER);

    // Page keeps refreshing when I click the login button
    const loginUser = async (event) => {
        event.preventDefault();
        try {
            const { email, password } = formState;
            const { data } = await login({
                variables: { email, password },
            });
            console.log(data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className=''>
            <div className=''>
                <h2 className=''>Login</h2>
                <form className=''>
                    <input
                        className=''
                        placeholder='Email'
                        name='email'
                        onChange={handleChange}
                        required
                    />
                    <input
                        className=''
                        type='password'
                        placeholder='Password'
                        name='password'
                        onChange={handleChange}
                        required
                    />
                    <div className=''>
                        <button className='' type='submit' onSubmit={loginUser}>
                            Log In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
