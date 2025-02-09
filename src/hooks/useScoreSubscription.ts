
import { useMemo } from 'react';
import { useSubscription, gql } from '@apollo/client';
import { rockiesTmId, prairiesTmId, foothillsTmId, badlandsTmId, domeTmId, client } from '@/lib/apollo-client';
import { MatchStatus } from '@/hooks/useMatchSubscription';

export type ScoreUpdatedData = {
  scoreUpdated: {
    match: {
      linked: {
        name: string;
      };
      round: string;
      instance: number;
      number: number;
      red: {
        teams: {
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
    };
    red: {
      score: number;
      wp: boolean;
      auton: boolean;
    };
    blue: {
      score: number;
      wp: boolean;
      auton: boolean;
    };
  };
}



const DIVISION_SUBSCRIPTIONS = {
  rockies: gql`
    subscription {
      scoreUpdated(tmId: ${rockiesTmId}) {
        match {
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
        red {
          score
          wp
          auton
        }
        blue {
          score
          wp
          auton
        }
      }
    }
  `,
  prairies: gql`
    subscription {
      scoreUpdated(tmId: ${prairiesTmId}) {
        match {
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
        red {
          score
          wp
          auton
        }
        blue {
          score
          wp
          auton
        }
      }
    }
  `,
  foothills: gql`
    subscription {
      scoreUpdated(tmId: ${foothillsTmId}) {
        match {
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
        red {
          score
          wp
          auton
        }
        blue {
          score
          wp
          auton
        }
      }
    }
  `,
  badlands: gql`
    subscription {
      scoreUpdated(tmId: ${badlandsTmId}) {
        match {
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
        red {
          score
          wp
          auton
        }
        blue {
          score
          wp
          auton
        }
      }
    }
  `,
  dome: gql`
    subscription {
      scoreUpdated(tmId: ${domeTmId}) {
        match {
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
        red {
          score
          wp
          auton
        }
        blue {
          score
          wp
          auton
        }
      }
    }
  `,
} as const;

type DivisionName = keyof typeof DIVISION_SUBSCRIPTIONS;

export function useScoreSubscription(division: DivisionName) {
  const subscription = useMemo(() =>
    DIVISION_SUBSCRIPTIONS[division],
    [division]
  );
  return useSubscription<ScoreUpdatedData>(subscription, { variables: { tmId: division === 'dome' ? 3 : 0 }, client });
}
