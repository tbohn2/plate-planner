import React from "react";

const Search = () => {

    const fetchRandomRecipe = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/random')
            const data = await res.json();
            console.log(data);

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h1>Search Page</h1>
            <button onClick={fetchRandomRecipe}>Random Recipe</button>
        </div>
    );
};

export default Search;