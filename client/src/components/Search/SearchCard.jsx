import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_RECIPE, SAVE_RECIPE_TO_USER } from "../../utils/mutations";
import Auth from "../../utils/auth";
import "../../styles/root.css";
import "../../styles/search.css";

const SearchCard = ({ recipe, refetch }) => {
    const user = Auth.getProfile();
    const id = user.data._id;

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [createRecipe] = useMutation(CREATE_RECIPE);
    const [saveRecipeToUser] = useMutation(SAVE_RECIPE_TO_USER);

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth <= 768);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleSaveRecipe = async (e, name, ingredients, instructions, URL, img) => {
        e.preventDefault();
        setSaving(true);
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
                setSaving(false);
                setSaved(true);
                refetch();
            }
        } catch (err) {
            console.error(err);
            setSaving(false);
            setError(true);
        }
    }

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
        <div key={recipe.idMeal} className='card fade-in my-3 col-lg-5 col-md-9 col-10 d-flex flex-column align-items-center justify-content-between border border-dark'>
            <a href={URL} className="col-12 text-center fs-1 text-decoration-none link-dark">{name}</a>
            <div className={`col-12 d-flex flex-wrap ${isMobile ? 'flex-column flex-column-reverse align-items-center' : ''}`}>
                <div className="col-md-5 col-10 d-flex flex-column align-items-center">
                    <h2 className="col-12 text-center">Ingredients</h2>
                    <ul>
                        {ingredients.map((ingredient) => {
                            return (
                                <li key={ingredient.name + ingredient.amount}>{ingredient.name} {ingredient.amount && `- ${ingredient.amount}`}</li>
                            );
                        })}
                    </ul>
                </div>
                <img className={`img col-md-6 col-8 ${loaded ? 'fade-in' : 'visually-hidden'}`} src={img} alt={name} onLoad={() => { setLoaded(true) }} />
                {!loaded &&
                    <div className="d-flex justify-content-center align-items-center m-5">
                        <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>}
            </div>
            <div className="d-flex flex-column align-items-center m-1">
                <h2 className="col-12 text-center">Instructions</h2>
                <p>{instructions}</p>
            </div>
            {saved || error ? (
                <div className="col-12">
                    {saved ? (
                        <button className="btn border border-success border-2 bg-light-yellow text-success fw-bold col-12">Recipe Saved!</button>
                    ) : (
                        <button className="btn border border-danger border-2 bg-light-yellow text-danger fw-bold col-12">Error Saving Recipe</button>
                    )}
                </div>
            ) : (
                <button className="btn btn-success col-12" onClick={(e) => handleSaveRecipe(e, name, ingredients, instructions, URL, img)}>
                    {saving ? <div className="spinner-border spinner-border-sm" role="status"></div> : 'Save Recipe Above'}
                </button>
            )}
        </div>
    )
};

export default SearchCard;