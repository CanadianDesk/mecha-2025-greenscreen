import { useMemo } from 'react';
import { useSubscription, gql } from '@apollo/client';
import { rockiesTmId, prairiesTmId, foothillsTmId, badlandsTmId, domeTmId, client } from '@/lib/apollo-client';
import { MatchStatus } from '@/hooks/useMatchSubscription';

export type MatchStatusUpdatedData = {
  matchStatusUpdated: {
    linked: {
      name: string;
    };
    round: string;
    instance: number;
    number: number;
    red: {
      teams: {
        name: string;
        number: string;
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
  }
}

const DIVISION_SUBSCRIPTIONS = {
  rockies: gql`
      subscription {
      matchStatusUpdated(tmId: ${rockiesTmId}) {
        linked {
          name
        }
        round
        instance
        number
        red {
          teams {
            number
            country
          }
        }
        blue {
          teams {
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
      subscription {
      matchStatusUpdated(tmId: ${prairiesTmId}) {
        linked {
          name
        }
        round
        instance
        number
        red {
          teams {
            number
            country
          }
        }
        blue {
          teams {
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
      subscription {
      matchStatusUpdated(tmId: ${foothillsTmId}) {
        linked {
          name
        }
        round
        instance
        number
        red {
          teams {
            number
            country
          }
        }
        blue {
          teams {
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
      subscription {
      matchStatusUpdated(tmId: ${badlandsTmId}) {
        linked {
          name
        }
        round
        instance
        number
        red {
          teams {
            number
            country
          }
        }
        blue {
          teams {
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
      subscription {
      matchStatusUpdated(tmId: ${domeTmId}) {
        linked {
          name
        }
        round
        instance
        number
        red {
          teams {
            number
            country
          }
        }
        blue {
          teams {
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

export function useMatchStatusUpdated(division: DivisionName) {
  const subscription = useMemo(() =>
    DIVISION_SUBSCRIPTIONS[division],
    [division]
  );
  return useSubscription<MatchStatusUpdatedData>(subscription, { variables: { tmId: division === 'dome' ? 3 : 0 }, client });
}


