const { User, Recipe } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        users: async () => {
            return User.find().populate('savedRecipes');
        },
        user: async (parent, { _id }) => {
            return User.findById({ _id }).populate('savedRecipes').populate({
                path: 'savedRecipes',
                populate: { path: 'ingredients' }
            });
        },
        recipes: async () => {
            return Recipe.find();
        },
        recipe: async (parent, { recipeId }) => {
            return Recipe.findOne({ _id: recipeId });
        }
    },
    Mutation: {
        addUser: async (parent, { name, email, password }) => {
            const user = await User.create({ name, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const token = signToken(user);
            return { token, user };
        },
        updateUserList: async (parent, { userId, shoppingList }) => {
            return User.findOneAndUpdate({ _id: userId }, { shoppingList }, { new: true });
        },
        deleteUser: async (parent, { userId }) => {
            return User.findOneAndDelete({ _id: userId });
        },
        createRecipe: async (parent, { name, img, ingredients, URL, custom }) => {
            return Recipe.create({ name, img, ingredients, URL, custom });
        },
        saveRecipeToUser: async (parent, { userId, recipeId }) => {
            return User.findOneAndUpdate(
                { _id: userId },
                { $addToSet: { savedRecipes: recipeId } },
                { new: true }
            ).populate('savedRecipes');
        },
        updateRecipe: async (parent, { recipeId, name, quantity }) => {
            return Recipe.findOneAndUpdate({ _id: recipeId }, { ingredients: { name, quantity } }, { new: true }
            );
        },
        deleteRecipe: async (parent, { recipeId }) => {
            return Recipe.findOneAndDelete({ _id: recipeId });
        }
    }
};

module.exports = resolvers;