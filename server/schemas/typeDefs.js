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

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        users: [User]
        user(username: String!): User
        recipes: [Recipe]
        recipe(recipeId: ID!): Recipe
    }

    type Mutation {
        addUser(name: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        addRecipe(name: String!, img: String, ingredients: [Ingredient], URL: String, custom: Boolean): Recipe
        addIngredient(recipeId: ID!, name: String!, quantity: Int!): Recipe
        removeRecipe(recipeId: ID!): Recipe
        removeIngredient(recipeId: ID!, name: String!): Recipe
    }
    `

module.exports = typeDefs;
