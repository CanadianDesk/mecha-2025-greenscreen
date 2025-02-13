import { useMemo } from 'react';
import { useSubscription, gql } from '@apollo/client';
import { rockiesTmId, prairiesTmId, foothillsTmId, badlandsTmId, domeTmId, client } from '@/lib/apollo-client';

export enum MatchStatus {
  UNKNOWN,
  QUEUED,
  AUTON,
  PAUSED,
  DRIVER,
  SCORING,
  COMPLETED,
}

export type MatchQueuedData =  {
  matchQueued: {
    linked: {
      name: string;
    };
    round: string;
    instance: number;
    number: number;
    red: {
      teams: {
        number: string;
        name: string;
        country: string;
      }[];
    };
    blue: {
      teams: {
        name: string;
        number: string;
        country: string;
      }[];
    };
    status: MatchStatus;
    endTime: number; // unix timestamp
  };
}

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
      matchQueued(tmId: ${foothillsTmId}){
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
      matchQueued(tmId: ${badlandsTmId}){
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
  dome: gql`
    subscription{
      matchQueued(tmId: ${domeTmId}){
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
  return useSubscription<MatchQueuedData>(subscription, { variables: { tmId: division === 'dome' ? 3 : 0 }, client });
}