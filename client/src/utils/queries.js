import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user($id: ID!) {
    user(_id: $id) {
      name
      savedRecipes {
        _id
        name
        ingredients {
          name
          quantity
        }
        img
        URL
        custom
      }
      shoppingList {
        name
        quantity
      }
    }
  }
`;

export const QUERY_SHOPPING_LIST = gql`
  query user($id: ID!) {
    user(_id: $id) {
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

