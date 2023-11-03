require("dotenv").config();

const apiKey = process.env.API_KEY;

const apiUrl = `https://www.themealdb.com/api/json/v1/${apiKey}/random.php`;

fetch(apiUrl)
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            console.error(`Error: ${response.status}`);
        }
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('An error occurred:', error);
    });
