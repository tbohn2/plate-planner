import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_USER } from "../utils/queries";
import { CREATE_RECIPE, SAVE_RECIPE_TO_USER } from "../utils/mutations";
import Auth from "../utils/auth";
import "../styles/search.css";

const Search = () => {

    const user = Auth.getProfile();
    const id = user.data._id;

    const { refetch } = useQuery(QUERY_USER, {
        variables: { id: id },
    });

    const [recipes, setRecipes] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [category, setCategory] = useState(null);

    const [createRecipe] = useMutation(CREATE_RECIPE);
    const [saveRecipeToUser] = useMutation(SAVE_RECIPE_TO_USER);

    const refetchData = async () => {
        try {
            const refetchedData = await refetch();
            if (refetchedData) {
                console.log('Refetched data!');
            }
        } catch (err) {
            console.error(err);
        }
    }

    const fetchRandomRecipe = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/random')
            const data = await res.json();
            setRecipes(data.meals);

        } catch (error) {
            console.log(error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/searchByName?name=${searchName}&category=${category}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (data) {
                setRecipes(data.meals);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
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
                refetchData();
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <h1>Search Page</h1>
            <input
                type="text"
                placeholder="Search by name"
                name="searchName"
                onChange={(e) => setSearchName(e.target.value)}
                required
            />
            <label htmlFor="category">Category (optional)</label>
            <button name="category" type="button" className=" col-2 btn btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" required>
                {category ? category : 'Category'}
            </button>
            <ul className="dropdown-menu">
                <li><button className="dropdown-item" type="button" onClick={() => setCategory(null)}>None</button></li>
                <li><button className="dropdown-item" type="button" onClick={() => setCategory('Beef')}>Beef</button></li>
                <li><button className="dropdown-item" type="button" onClick={() => setCategory('Breakfast')}>Breakfast</button></li>
                <li><button className="dropdown-item" type="button" onClick={() => setCategory('Chicken')}>Chicken</button></li>
                <li><button className="dropdown-item" type="button" onClick={() => setCategory('Dessert')}>Dessert</button></li>
                <li><button className="dropdown-item" type="button" onClick={() => setCategory('Goat')}>Goat</button></li>
                <li><button className="dropdown-item" type="button" onClick={() => setCategory('Lamb')}>Lamb</button></li>
                <li><button className="dropdown-item" type="button" onClick={() => setCategory('Miscellaneous')}>Miscellaneous</button></li>
                <li><button className="dropdown-item" type="button" onClick={() => setCategory('Pasta')}>Pasta</button></li>
                <li><button className="dropdown-item" type="button" onClick={() => setCategory('Pork')}>Pork</button></li>
                <li><button className="dropdown-item" type="button" onClick={() => setCategory('Seafood')}>Seafood</button></li>
                <li><button className="dropdown-item" type="button" onClick={() => setCategory('Side')}>Side</button></li>
                <li><button className="dropdown-item" type="button" onClick={() => setCategory('Starter')}>Starter</button></li>
                <li><button className="dropdown-item" type="button" onClick={() => setCategory('Vegan')}>Vegan</button></li>
                <li><button className="dropdown-item" type="button" onClick={() => setCategory('Vegetarian')}>Vegetarian</button></li>
            </ul>
            <button onClick={handleSearch}>Search</button>
            <button onClick={fetchRandomRecipe}>Random Recipe</button>
            <div className="d-flex flex-wrap">
                {recipes.map((recipe) => {
                    const ingredientKeys = Object.keys(recipe).filter(key => key.startsWith('strIngredient')).map(key => recipe[key]);
                    const measureKeys = Object.keys(recipe).filter(key => key.startsWith('strMeasure')).map(key => recipe[key]);
                    const name = recipe.strMeal;
                    const instructions = recipe.strInstructions;
                    const img = recipe.strMealThumb;
                    const URL = recipe.strSource;

                    let ingredients = [];
                    for (let i = 0; i < ingredientKeys.length; i++) {
                        if (ingredientKeys[i] !== '' && ingredientKeys[i] !== "" && ingredientKeys[i] !== null && ingredientKeys[i] !== undefined) {
                            const newIngredient = { name: ingredientKeys[i], amount: measureKeys[i] };
                            ingredients.push(newIngredient);
                        }
                    }

                    return (
                        <div key={recipe.idMeal} className="col-6 border border-dark">
                            <a href={URL} className="fs-1 text-decoration-none link-dark">{name}</a>
                            <img className="searchImg" src={img} alt={name} />
                            <h2>Ingredients</h2>
                            <ul>
                                {ingredients.map((ingredient) => {
                                    return (
                                        <li key={ingredient.name + ingredient.amount}>{ingredient.name} - {ingredient.amount}</li>
                                    );
                                })}
                            </ul>
                            <h2>Instructions</h2>
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