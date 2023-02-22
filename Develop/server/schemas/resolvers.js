const { AuthenticationError } = require("apollo-server-express");
const { model } = require("mongoose");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });

      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, args, context) => {
      const BookModel = model("Book", Book);

      const book = await BookModel.create({
        authors: args.input.authors,
        description: args.input.description,
        title: args.input.title,
        bookId: args.input.bookId,
        image: args.input.image,
        link: args.input.link,
      });

      let x = await User.updateOne(
        { _id: context.user._id },
        { $push: { savedBooks: book } }
      );

      return context.user;
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
      }
    },
  },
};

module.exports = resolvers;
