import { PageConfig } from "next";
import { ApolloServer, gql } from "apollo-server-micro";

const typeDefs = gql`
  type Query {
    users: [User!]!
  }
  type User {
    name: String
  }
`;

const resolvers = {
  Query: {
    users() {
      return [{ name: "Nextjs" }];
    },
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

const startServer = apolloServer.start();

export default async (req, res) => {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://studio.apollographql.com"
  );

  await startServer;
  await apolloServer.createHandler({
    path: "/api/v1/graphql",
  })(req, res);
};
// // Apollo Server Micro takes care of body parsing
export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};
