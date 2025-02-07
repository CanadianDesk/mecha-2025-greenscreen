import { useMemo } from 'react';
import { ApolloClient, InMemoryCache, useSubscription, gql } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { graphQLEndpointHTTP, graphQLEndpointWS } from '@/lib/constants';


const rockiesTmId = 3;
const prairiesTmId = 4;
const foothillsTmId = 5;
const badlandsTmId = 6;

const wsClient = createClient({
  url: graphQLEndpointWS,
  retryAttempts: Infinity,
  shouldRetry: () => true,
  retryWait: async (retries) => {
    await new Promise(resolve =>
      setTimeout(resolve, Math.min(1000 * Math.pow(2, retries), 10000))
    );
  },
});

const client = new ApolloClient({
  link: new GraphQLWsLink(wsClient),
  cache: new InMemoryCache(),
});

const DIVISION_SUBSCRIPTIONS = {
  rockies: gql`
    subscription{
      matchQueued(tmId: ${rockiesTmId}){
        linked {
          name
        }
        round
        instance
        number
        red {
          teams {
            number
            name
            country
          }
        }
        blue {
          teams {
            name
            number
            country
          }
        }
        status
        endTime
      }
    }
  `,
  prairies: gql`
    subscription{
      matchQueued(tmId: ${prairiesTmId}){
        linked {
          name
        }
        round
        instance
        number
        red {
          teams {
            number
            name
            country
          }
        }
        blue {
          teams {
            name
            number
            country
          }
        }
        status
        endTime
      }
    }
  `,
  foothills: gql`
    subscription{
      matchQueued(tmId: ${rockiesTmId}){
        linked {
          name
        }
        round
        instance
        number
        red {
          teams {
            number
            name
            country
          }
        }
        blue {
          teams {
            name
            number
            country
          }
        }
        status
        endTime
      }
    }
  `,
  badlands: gql`
    subscription{
      matchQueued(tmId: ${rockiesTmId}){
        linked {
          name
        }
        round
        instance
        number
        red {
          teams {
            number
            name
            country
          }
        }
        blue {
          teams {
            name
            number
            country
          }
        }
        status
        endTime
      }
    }
  `,
} as const;

type DivisionName = keyof typeof DIVISION_SUBSCRIPTIONS;

export function useMatchSubscription(division: DivisionName) {
  const subscription = useMemo(() =>
    DIVISION_SUBSCRIPTIONS[division],
    [division]
  );

  return useSubscription(subscription, { client });
}