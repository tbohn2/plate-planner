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
        instructions: String
        URL: String
        custom: Boolean
    }

    type Ingredient {
        name: String
        amount: String
    }
    
    input IngredientInput {
        name: String
        amount: String       
    }
   
    input ItemInput {
        name: String
        quantity: Int                
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        users: [User]
        user(_id: ID!): User
        recipes: [Recipe]
        recipe(recipeId: ID!): Recipe
    }

    type Mutation {
        addUser(name: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        addItemsToList(userId: ID!, items: [ItemInput]): User
        updateUserList(userId: ID!, shoppingList: [ItemInput]!): User
        deleteUser(userId: ID!): User
        createRecipe(name: String!, img: String, ingredients: [IngredientInput], instructions: String, URL: String, custom: Boolean): Recipe
        saveRecipeToUser(userId: ID!, recipeId: ID!): User
        updateRecipe(recipeId: ID!, name: String!, ingredients: [IngredientInput]): Recipe
        deleteRecipe(recipeId: ID!): Recipe
    }
    `

module.exports = typeDefs;
