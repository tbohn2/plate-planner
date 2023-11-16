import { gql } from '@apollo/client';

export const QUERY_SAVED_RECIPES = gql`
  query user($id: ID!) {
    user(_id: $id) {
      _id
      name
      savedRecipes {
        _id
        name
        img
        custom
      }
    }
  }
`;

export const QUERY_SHOPPING_LIST = gql`
  query user($id: ID!) {
    user(_id: $id) {
      _id
      name
      shoppingList {
        name
        quantity
      }
    }
  }
`;

export const QUERY_RECIPES = gql`
  query recipes {
    recipes {
      _id
      name
      img
      custom
    }
  }
`;

export const QUERY_RECIPE = gql`
  query recipe($recipeId: ID!) {
    recipe(recipeId: $recipeId) {
      _id
      name
      img
      ingredients {
        name
        quantity
      }
      URL
      custom
    }
  }
`;

