require("dotenv").config();

const axios = require("axios");

const apiKey = process.env.API_KEY;

const apiUrl = `https://www.themealdb.com/api/json/v1/${apiKey}/`;

const fetchRandomMeal = async () => {
    try {
        const response = await axios.get(`${apiUrl}random.php`);
        const data = response.data;
        if (response.status !== 200) {
            console.log(response);
        }
        return data;
    }
    catch (error) {
        console.error(error);
    }
};

const fetchMealByName = async (name, category) => {
    if (name && category) {
        try {
            const url = `${apiUrl}search.php?s=${name}&filter.php?c=${category}`;
            const response = await axios.get(url);
            const data = await response.json();
            if (response.status !== 200) {
                console.log(response);
            }
            return data;
        }
        catch (error) {
            console.error(error);
        }
    }
    if (name && !category) {
        try {
            const url = `${apiUrl}search.php?s=${name}`
            const response = await fetch(url);
            const data = await response.json();
            if (response.status !== 200) {
                console.log(response);
            }
            return data;
        }
        catch (error) {
            console.error(error);
        }
    }
};

module.exports = { fetchRandomMeal, fetchMealByName };