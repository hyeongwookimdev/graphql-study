import { ApolloServer } from "@apollo/server";
import { graphql } from "graphql";

const server = new ApolloServer({});

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
