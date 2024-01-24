import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_RECIPE, SAVE_RECIPE_TO_USER } from "../utils/mutations";
import Auth from "../utils/auth";

const Search = () => {

    const user = Auth.getProfile();
    const id = user.data._id;

    const [recipes, setRecipes] = useState([]);

    const [createRecipe] = useMutation(CREATE_RECIPE);
    const [saveRecipeToUser] = useMutation(SAVE_RECIPE_TO_USER);

    const fetchRandomRecipe = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/random')
            const data = await res.json();
            setRecipes(data.meals);

        } catch (error) {
            console.log(error);
        }
    };


    const handleSaveRecipe = async (e, name, ingredients, instructions, URL, img) => {
        e.preventDefault();
        try {
            const { data } = await createRecipe({
                variables: {
                    name,
                    ingredients,
                    instructions,
                    URL,
                    img,
                    custom: false,
                },
            });
            const recipeId = data.createRecipe._id;
            await saveRecipeToUser({
                variables: {
                    userId: id,
                    recipeId: recipeId,
                },
            });
            if (saveRecipeToUser) {
                console.log('Recipe saved!');
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <h1>Search Page</h1>
            <button onClick={fetchRandomRecipe}>Random Recipe</button>
            <div>
                {recipes.map((recipe) => {
                    const ingredientKeys = Object.keys(recipe).filter(key => key.startsWith('strIngredient')).map(key => recipe[key]);
                    const measureKeys = Object.keys(recipe).filter(key => key.startsWith('strMeasure')).map(key => recipe[key]);
                    const name = recipe.strMeal;
                    const instructions = recipe.strInstructions;
                    const img = recipe.strMealThumb;
                    const URL = recipe.strSource;

                    let ingredients = [];
                    for (let i = 0; i < ingredientKeys.length; i++) {
                        if (ingredientKeys[i] !== '') {
                            const newIngredient = { name: ingredientKeys[i], amount: measureKeys[i] };
                            ingredients.push(newIngredient);
                        }
                    }

                    return (
                        <div key={recipe.idMeal}>
                            <h1>{name}</h1>
                            <a href={URL}>{URL}</a>
                            <img src={img} alt={name} />
                            <h2>Ingredients</h2>
                            <ul>
                                {ingredients.map((ingredient) => {
                                    return (
                                        <li key={ingredient.name + ingredient.amount}>{ingredient.name} - {ingredient.amount}</li>
                                    );
                                })}
                            </ul>
                            <p>{instructions}</p>
                            <button onClick={(e) => handleSaveRecipe(e, name, ingredients, instructions, URL, img)}>Save Recipe</button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Search;