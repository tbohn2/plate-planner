import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ADD_USER, LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';
import '../styles/root.css';
import '../styles/login.css';

const Login = ({ loggedIn, handleLogin }) => {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [signingUp, setSigningUp] = useState(false);

    const toggleSignup = () => {
        setError('');
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
        setLoading(true);
        event.preventDefault();
        try {
            const { email, password } = formState;
            const { data } = await login({
                variables: { email, password },
            });
            if (data) {
                Auth.login(data.login.token);
                setLoading(false);
                handleLogin();
            }
        } catch (err) {
            setLoading(false);
            setError('Failed to log in; Please try again.');
            console.error(err);
        }
    };

    const addNewUser = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const { name, email, password } = formState;
            const { data } = await addUser({
                variables: { name, email, password },
            });
            if (data) {
                setLoading(false);
                Auth.login(data.addUser.token);
                handleLogin();
            }
        } catch (err) {
            setLoading(false);
            setError('Failed to create account; Please try again.');
            console.error(err);
        }
    };

    return (
        <div className='fade-in loginPage'>
            <div className='body-bg'></div>
            {loggedIn && <Navigate to='/myRecipes' />}
            {signingUp ? (
                <div className='d-flex flex-column card p-3 col-xl-4 col-lg-5 col-md-7 col-sm-9 col-10'>
                    {error && <div className='fade-in alert alert-danger col-12'>{error}</div>}
                    {loading && <div className='spinner-border spinner-border-sm col-3' role='status'></div>}
                    <h2 className='text-center'>Create Account</h2>
                    <form onSubmit={addNewUser} className='d-flex flex-column'>
                        <label htmlFor="name">Name</label>
                        <input
                            className='my-1'
                            placeholder='First Name'
                            name='name'
                            id='name'
                            onChange={updateForm}
                            required
                        />
                        <label htmlFor="email">Email</label>
                        <input
                            className='my-1'
                            placeholder='Email'
                            name='email'
                            onChange={updateForm}
                            required
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            className='my-1'
                            type='password'
                            placeholder='Password'
                            name='password'
                            id='password'
                            onChange={updateForm}
                            required
                        />
                        <button className='my-1 btn btn-success col-12' type='submit'>
                            {loading ? <div className='spinner-border spinner-border-sm col-3' role='status'></div> : 'Log In'}
                        </button>
                    </form>
                    <button className='my-1 btn btn-primary col-12' onClick={toggleSignup}>
                        Already have an account?
                    </button>
                </div>
            ) : (
                <div className='d-flex flex-column card p-3 col-xl-4 col-lg-5 col-md-7 col-sm-9 col-10'>
                    <h2 className='text-center'>Login</h2>
                    {error && <div className='fade-in alert alert-danger align-self-center col-12'>{error}</div>}
                    <form onSubmit={loginUser} className='d-flex flex-column'>
                        <label htmlFor="email">Email</label>
                        <input
                            className='my-1'
                            placeholder='Email'
                            name='email'
                            id='email'
                            onChange={updateForm}
                            required
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            className='my-1'
                            type='password'
                            placeholder='Password'
                            name='password'
                            id='password'
                            onChange={updateForm}
                            required
                        />
                        <button className='mt-3 fs-5 btn btn-success col-12' type='submit'>
                            {loading ? <div className='spinner-border spinner-border-sm col-3' role='status'></div> : 'Log In'}
                        </button>
                    </form>
                    <button className='mt-3 fs-5 btn btn-primary col-12' onClick={toggleSignup}>
                        Click here to create an account
                    </button>
                </div>
            )}

        </div>
    );
};

export default Login;
