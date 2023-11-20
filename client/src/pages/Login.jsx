import React from 'react';

const Login = () => {

    return (
        <div className=''>
            <div className=''>
                <h2 className=''>Login</h2>
                <form className=''>
                    <input
                        className=''
                        placeholder='Username'
                        name='username'
                        required
                    />
                    <input
                        className=''
                        type='password'
                        placeholder='Password'
                        name='password'
                        required
                    />
                    <div className=''>
                        <button className='' type='submit'>
                            Log In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
