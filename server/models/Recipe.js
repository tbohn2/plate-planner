const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const recipeSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    img: {
        type: String,
    },
    ingredients: [
        {
            name: String,
            quantity: Number,
        }
    ],
    URL: {
        type: String,
    },
    custom: {
        type: Boolean,
        default: false,
    },
});

const Recipe = model('Recipe', recipeSchema);

module.exports = Recipe;
