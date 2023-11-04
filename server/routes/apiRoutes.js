const express = require('express');
const { fetchRandomMeal, fetchMealByName } = require('./routes/mealdb');
const router = express.Router();

router.get('/api/random', async (req, res) => {
    const data = await fetchRandomMeal();
    res.status(200).json(data);
});

router.get('/api/searchByName', async (req, res) => {
    const name = req.body.name;
    const category = req.body.category;
    const data = await fetchMealByName(name, category);
    res.status(200).json(data);
});

module.exports = router;