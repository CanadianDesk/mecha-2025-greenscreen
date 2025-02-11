import { createClient } from "graphql-ws";
import { graphQLEndpointWS } from "./constants";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";

export const rockiesTmId = 1;
export const prairiesTmId = 2;
export const foothillsTmId = 3;
export const badlandsTmId = 0;
export const domeTmId = 4;

const wsClient = createClient({
  url: graphQLEndpointWS,
  retryAttempts: Infinity,
  shouldRetry: () => true,
  retryWait: async (retries) => {
    await new Promise(resolve =>
      setTimeout(resolve, Math.min(1000 * Math.pow(2, retries), 3000))
    );
  },
  on: {
    connected: () => console.log('Connected to WebSocket'),
    error: (error) => console.error('WebSocket error:', error),
    closed: () => console.log('WebSocket connection closed'),
  }
});


export const client = new ApolloClient({
  link: new GraphQLWsLink(wsClient),
  cache: new InMemoryCache(),
});