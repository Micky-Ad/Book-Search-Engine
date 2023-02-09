const { User, Book } = require("../models");

const resolvers = {
  Query: {
    me: async (parent, id) => {
      return User.findOne({
        where: {
          _id: id,
        },
      });
    },
  },
  Mutation: {
    login: async (parent, args) => {
      const user = await User.findOne({
        where: {
          email: args.email,
        },
      });
      if (user == null) {
        return false;
      }
      const validPassword = user;
    },
  },
};

module.exports = resolvers;
