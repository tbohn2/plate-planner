import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_SAVED_RECIPES } from '../utils/queries';
import { CREATE_RECIPE, SAVE_RECIPE_TO_USER, UPDATE_RECIPE } from '../utils/mutations';
import Auth from '../utils/auth';

const UserRecipes = () => {

    return (
        <div className=''>
            My Recipes
        </div>
    );
};

export default UserRecipes;
