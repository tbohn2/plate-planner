import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_USER } from "../utils/queries";
import Auth from "../utils/auth";
import SearchCard from "../components/Search/SearchCard";
import "../styles/root.css";
import "../styles/search.css";

const Search = () => {
    const user = Auth.getProfile();
    const id = user.data._id;

    const { refetch } = useQuery(QUERY_USER, {
        variables: { id: id },
    });

    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [category, setCategory] = useState(null);

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
        setRecipes([]);
        if (error) {
            setError(null);
        }
        setFetching(true);
        try {
            const res = await fetch('/api/random')
            const data = await res.json();
            if (data) {
                setRecipes(data.meals);
                setFetching(false);
            }

        } catch (error) {
            console.log(error);
            setFetching(false);
            setError('Error Retrieving data; please try again later');
        }
    };

    const handleSearch = async () => {
        setRecipes([]);
        if (error) {
            setError(null);
        }
        setFetching(true);
        try {
            const response = await fetch(`/api/searchByName?name=${searchName}&category=${category}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (data) {
                setRecipes(data.meals);
                setFetching(false);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setFetching(false);
            setError('Error Retrieving data; please try again later');
        }
    };

    return (
        <div className="fade-in">
            <div className="body-bg"></div>
            <div className="z-1 d-flex flex-column justify-content-center align-items-center">
                <h1 className="col-6 text-center bubblegum border-bottom-blue">Recipe Search</h1>
                <div className="col-12 d-flex flex-wrap justify-content-center align-items-center">
                    <div className="col-12 d-flex flex-wrap justify-content-center align-items-center my-2">
                        <div className="col-lg-4 col-md-5 col-10 mx-2 mb-2">
                            <input
                                type="text"
                                placeholder="Search by name"
                                name="searchName"
                                className="form-control mx-1 text-blue border-blue"
                                onChange={(e) => setSearchName(e.target.value)}
                                required
                            />
                        </div>
                        <button name="category" type="button" className="mx-2 mb-2 col-lg-2 col-md-3 col-6 btn btn-light dropdown-toggle border-blue " data-bs-toggle="dropdown" aria-expanded="false">
                            {category ? category : 'Category (optional)'}
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
                    </div>
                    <button className="btn btn-primary col-lg-2 col-md-3 col-5 fw-bold mx-1" onClick={handleSearch}>Search</button>
                    <button className="btn btn-success col-lg-2 col-md-3 col-5 fw-bold mx-1" onClick={fetchRandomRecipe}>Random Recipe</button>
                </div>
                {fetching ? (
                    <div className="d-flex justify-content-center align-items-center m-5">
                        <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : null}
                {error ? (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                ) : null}
                <div className="d-flex flex-wrap justify-content-evenly fade-in">
                    {recipes.map((recipe) => {
                        return (
                            <SearchCard key={recipe.idMeal} recipe={recipe} refetch={refetchData} />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Search;