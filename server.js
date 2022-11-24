import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

let tweets = [
  {
    id: "1",
    text: "first one!",
    userId: "2",
  },
  {
    id: "2",
    text: "second one!",
    userId: "1",
  },
];

let users = [
  {
    id: "1",
    firstName: "Hyuwoo",
    lastName: "Kim",
  },
  {
    id: "2",
    firstName: "Taesan",
    lastName: "Kim",
  },
];

const typeDefs = `#graphql
  type User {
    id:ID!
    firstName: String!
    lastName: String!
    """
    Is the sum of firstName + lastName as a string
    """
    fullName: String!
  }
  """
  Tweet object represents a resource for a Tweet
  """
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet 
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    """
    Deltes a Tweet if found, else returns false
    """
    deleteTweet(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    allTweets: () => {
      return tweets;
    },
    tweet: (_, { id }) => {
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers: () => {
      console.log("all users called!");
      return users;
    },
  },
  Mutation: {
    postTweet: (_, { text, userId }) => {
      if (!users.find((user) => user.id === userId))
        throw new Error(`userId ${userId} not found`);
      const newTweet = {
        id: tweets.length + 1,
        text,
        userId,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet: (_, { id }) => {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    fullName: ({ firstName, lastName }) => {
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author: ({ userId }) => users.find((user) => user.id === userId),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);

/*
const deleteTweetIndex = tweets.findIndex((tweet) => tweet.id === id);
if (deleteTweetIndex === -1) return false;
tweets.splice(deleteTweetIndex, 1);
return true;
*/
