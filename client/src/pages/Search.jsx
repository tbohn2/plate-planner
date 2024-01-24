import React, { useState } from "react";

const Search = () => {

    const [recipes, setRecipes] = useState([]);

    const fetchRandomRecipe = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/random')
            const data = await res.json();
            setRecipes(data.meals);

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h1>Search Page</h1>
            <button onClick={fetchRandomRecipe}>Random Recipe</button>
            <div>
                {recipes.map((recipe) => {
                    const ingredientKeys = Object.keys(recipe).filter(key => key.startsWith('strIngredient')).map(key => recipe[key]);
                    const measureKeys = Object.keys(recipe).filter(key => key.startsWith('strMeasure')).map(key => recipe[key]);
                    let ingredientsArray = [];
                    for (let i = 0; i < ingredientKeys.length; i++) {
                        if (ingredientKeys[i] !== '') {
                            const newIngredient = { name: ingredientKeys[i], amount: measureKeys[i] };
                            ingredientsArray.push(newIngredient);
                        }
                    }

                    return (
                        <div key={recipe.idMeal}>
                            <h1>{recipe.strMeal}</h1>
                            <img src={recipe.strMealThumb} alt={recipe.strMeal} />
                            <h2>Ingredients</h2>
                            <ul>
                                {ingredientsArray.map((ingredient) => {
                                    return (
                                        <li key={ingredient.name}>{ingredient.name} - {ingredient.amount}</li>
                                    );
                                })}
                            </ul>
                            <p>{recipe.strInstructions}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Search;