require("dotenv").config();

const apiKey = process.env.API_KEY;

const apiUrl = `https://www.themealdb.com/api/json/v1/${apiKey}/`;

const fetchRandomMeal = async () => {
    try {
        const response = await fetch(`${apiUrl}random.php`);
        const data = await response.json();
        console.log(data);
        if (response.status !== 200) {
            console.log(response);
        }
    }
    catch (error) {
        console.error(error);
    }
};

const fetchMealByName = async (name, category) => {
    if (name && category) {
        try {
            const response = await fetch(`${apiUrl}search.php?s=${name}&filter.php?c=${category}`);
            const data = await response.json();
            console.log(data);
            if (response.status !== 200) {
                console.log(response);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    if (name && !category) {
        try {
            const response = await fetch(`${apiUrl}search.php?s=${name}`);
            const data = await response.json();
            console.log(data);
            if (response.status !== 200) {
                console.log(response);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

};