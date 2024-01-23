import { gql } from '@apollo/client';

export const ADD_USER = gql`
  mutation addUser($name: String!, $email: String!, $password: String!) {
    addUser(name: $name, email: $email, password: $password) {
      token
      user {
        _id
        name
        email
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
    token
    user {
        _id
        name
        email
    }
  }
}
`;

export const ADD_ITEMS_TO_LIST = gql`
  mutation addItemsToList($userId: ID!, $items: [ItemInput]) {
    addItemsToList(userId: $userId, items: $items) {
      _id
      name
      shoppingList {
        name
        quantity
      }
    }
  }
`;

export const UPDATE_USER_LIST = gql`
  mutation updateUserList($userId: ID!, $shoppingList: [ItemInput]!) {
    updateUserList(userId: $userId, shoppingList: $shoppingList) {
      _id
      name
      shoppingList {
        name
        quantity
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($userId: ID!) {
    deleteUser(userId: $userId) {
      _id
      name      
    }
  }
`;

export const CREATE_RECIPE = gql`
  mutation createRecipe($name: String!, $img: String, $ingredients: [IngredientInput], $instructions: String,  $URL: String, $custom: Boolean) {
    createRecipe(name: $name, img: $img, ingredients: $ingredients, instructions: $instructions URL: $URL, custom: $custom) {
      _id
      name
      img
      ingredients {
        name
        amount
      }
      instructions
      URL
      custom
    }
  }
`;

export const SAVE_RECIPE_TO_USER = gql`
  mutation saveRecipeToUser($userId: ID!, $recipeId: ID!) {
    saveRecipeToUser(userId: $userId, recipeId: $recipeId) {
      _id
      name
      savedRecipes {
        _id
        name        
        custom
      }
    }
  }
`;

export const UPDATE_RECIPE = gql`
  mutation Mutation($recipeId: ID!, $name: String!, $ingredients: [IngredientInput], $instructions: String,) {
    updateRecipe(recipeId: $recipeId, name: $name, ingredients: $ingredients, instructions: $instructions) {
      _id
    }
  }
`;

export const DELETE_RECIPE = gql`
  mutation deleteRecipe($recipeId: ID!) {
    deleteRecipe(recipeId: $recipeId) {
      _id
      name
    }
  }
`;