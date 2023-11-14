const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        name: String
        email: String
        savedRecipes: [Recipe]
        shoppingList: [Ingredient]
    }

    type Recipe {
        _id: ID
        name: String
        img: String
        ingredients: [Ingredient]
        URL: String
        custom: Boolean
    }

    type Ingredient {
        name: String
        quantity: Int
    }
    
    input IngredientInput {
        name: String
        quantity: Int
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        users: [User]
        user(email: String!): User
        recipes: [Recipe]
        recipe(recipeId: ID!): Recipe
    }

    type Mutation {
        addUser(name: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        updateUserList(userId: ID!, shoppingList: [IngredientInput]): User
        deleteUser(userId: ID!): User
        createRecipe(name: String!, img: String, ingredients: [IngredientInput], URL: String, custom: Boolean): Recipe
        saveRecipeToUser(userId: ID!, recipeId: ID!): User
        addIngredientToRecipe(recipeId: ID!, name: String!, quantity: Int!): Recipe
        removeIngredient(recipeId: ID!, name: String!): Recipe
        deleteRecipe(recipeId: ID!): Recipe
    }
    `

module.exports = typeDefs;
