const express = require('express');
const { fetchRandomMeal, fetchMealByName } = require('./mealdb');
const router = express.Router();

router.get('/api/random', async (req, res) => {
    const data = await fetchRandomMeal();
    res.status(200).json(data);
});

router.get('/api/searchByName', async (req, res) => {
    const { name, category } = req.query;
    const data = await fetchMealByName(name, category);
    res.status(200).json(data);
});

module.exports = router;