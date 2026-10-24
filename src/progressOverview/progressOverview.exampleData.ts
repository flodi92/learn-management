import { GeneralStatistics } from './progressOverview';

export const statisticsExample: GeneralStatistics = {
  childType: 'category',
  statistics: {
    avgLastRepetitionBeforeDays: 19,
    notLearned: 6,
    learning: 5,
    learned: 9,
    forRepeat: 4,
  },
  children: {
    Mathematics: {
      childType: 'relevance',
      statistics: {
        avgLastRepetitionBeforeDays: 10.5,
        notLearned: 1,
        learning: 1,
        learned: 3,
        forRepeat: 1,
      },
      children: {
        1: {
          childType: 'subject',
          statistics: {
            avgLastRepetitionBeforeDays: 2.5,
            notLearned: 0,
            learning: 0,
            learned: 2,
            forRepeat: 0,
          },
          children: {
            'Solving equations': {
              statistics: {
                label: 'Solving equations',
                mastery: 0.9,
                lastRepetitionBeforeDays: 3,
                numberOfRepetitions: 4,
                learningState: 'learned',
              },
            },
            Fractions: {
              statistics: {
                label: 'Fractions',
                mastery: 0.95,
                lastRepetitionBeforeDays: 2,
                numberOfRepetitions: 5,
                learningState: 'learned',
              },
            },
          },
        },
        2: {
          childType: 'subject',
          statistics: {
            avgLastRepetitionBeforeDays: 22.5,
            notLearned: 0,
            learning: 1,
            learned: 0,
            forRepeat: 1,
          },
          children: {
            'Linear functions': {
              statistics: {
                label: 'Linear functions',
                mastery: 0.55,
                lastRepetitionBeforeDays: 5,
                numberOfRepetitions: 2,
                learningState: 'learning',
              },
            },
            Probability: {
              statistics: {
                label: 'Probability',
                mastery: 0.6,
                lastRepetitionBeforeDays: 40,
                numberOfRepetitions: 3,
                learningState: 'forRepeat',
              },
            },
          },
        },
        3: {
          childType: 'subject',
          statistics: {
            avgLastRepetitionBeforeDays: 6.5,
            notLearned: 1,
            learning: 0,
            learned: 1,
            forRepeat: 0,
          },
          children: {
            Geometry: {
              statistics: {
                label: 'Geometry',
                mastery: 0.85,
                lastRepetitionBeforeDays: 12,
                numberOfRepetitions: 3,
                learningState: 'learned',
              },
            },
            Statistics: {
              statistics: {
                label: 'Statistics',
                mastery: 0.1,
                lastRepetitionBeforeDays: 1,
                numberOfRepetitions: 1,
                learningState: 'notLearned',
              },
            },
          },
        },
      },
    },
    Chemistry: {
      childType: 'relevance',
      statistics: {
        avgLastRepetitionBeforeDays: 7.17,
        notLearned: 2,
        learning: 2,
        learned: 1,
        forRepeat: 1,
      },
      children: {
        1: {
          childType: 'subject',
          statistics: {
            avgLastRepetitionBeforeDays: 6,
            notLearned: 1,
            learning: 0,
            learned: 0,
            forRepeat: 1,
          },
          children: {
            'Atomic structure': {
              statistics: {
                label: 'Atomic structure',
                mastery: 0.2,
                lastRepetitionBeforeDays: 2,
                numberOfRepetitions: 1,
                learningState: 'notLearned',
              },
            },
            'Chemical reactions': {
              statistics: {
                label: 'Chemical reactions',
                mastery: 0.6,
                lastRepetitionBeforeDays: 10,
                numberOfRepetitions: 3,
                learningState: 'forRepeat',
              },
            },
          },
        },
        2: {
          childType: 'subject',
          statistics: {
            avgLastRepetitionBeforeDays: 7.5,
            notLearned: 0,
            learning: 1,
            learned: 1,
            forRepeat: 0,
          },
          children: {
            'Periodic table': {
              statistics: {
                label: 'Periodic table',
                mastery: 0.45,
                lastRepetitionBeforeDays: 6,
                numberOfRepetitions: 2,
                learningState: 'learning',
              },
            },
            Bonding: {
              statistics: {
                label: 'Bonding',
                mastery: 0.8,
                lastRepetitionBeforeDays: 9,
                numberOfRepetitions: 4,
                learningState: 'learned',
              },
            },
          },
        },
        3: {
          childType: 'subject',
          statistics: {
            avgLastRepetitionBeforeDays: 8,
            notLearned: 1,
            learning: 1,
            learned: 0,
            forRepeat: 0,
          },
          children: {
            'Acids and bases': {
              statistics: {
                label: 'Acids and bases',
                mastery: 0.1,
                lastRepetitionBeforeDays: 1,
                numberOfRepetitions: 1,
                learningState: 'notLearned',
              },
            },
            'Organic chemistry': {
              statistics: {
                label: 'Organic chemistry',
                mastery: 0.5,
                lastRepetitionBeforeDays: 15,
                numberOfRepetitions: 2,
                learningState: 'learning',
              },
            },
          },
        },
      },
    },
    Physics: {
      childType: 'relevance',
      statistics: {
        avgLastRepetitionBeforeDays: 23.33,
        notLearned: 1,
        learning: 1,
        learned: 3,
        forRepeat: 1,
      },
      children: {
        1: {
          childType: 'subject',
          statistics: {
            avgLastRepetitionBeforeDays: 7,
            notLearned: 0,
            learning: 0,
            learned: 2,
            forRepeat: 0,
          },
          children: {
            'Forces and motion': {
              statistics: {
                label: 'Forces and motion',
                mastery: 0.8,
                lastRepetitionBeforeDays: 6,
                numberOfRepetitions: 3,
                learningState: 'learned',
              },
            },
            Energy: {
              statistics: {
                label: 'Energy',
                mastery: 0.95,
                lastRepetitionBeforeDays: 8,
                numberOfRepetitions: 5,
                learningState: 'learned',
              },
            },
          },
        },
        2: {
          childType: 'subject',
          statistics: {
            avgLastRepetitionBeforeDays: 8,
            notLearned: 1,
            learning: 1,
            learned: 0,
            forRepeat: 0,
          },
          children: {
            Electricity: {
              statistics: {
                label: 'Electricity',
                mastery: 0.5,
                lastRepetitionBeforeDays: 14,
                numberOfRepetitions: 2,
                learningState: 'learning',
              },
            },
            Waves: {
              statistics: {
                label: 'Waves',
                mastery: 0.3,
                lastRepetitionBeforeDays: 2,
                numberOfRepetitions: 1,
                learningState: 'notLearned',
              },
            },
          },
        },
        3: {
          childType: 'subject',
          statistics: {
            avgLastRepetitionBeforeDays: 55,
            notLearned: 0,
            learning: 0,
            learned: 1,
            forRepeat: 1,
          },
          children: {
            Optics: {
              statistics: {
                label: 'Optics',
                mastery: 0.65,
                lastRepetitionBeforeDays: 90,
                numberOfRepetitions: 4,
                learningState: 'forRepeat',
              },
            },
            Thermodynamics: {
              statistics: {
                label: 'Thermodynamics',
                mastery: 0.88,
                lastRepetitionBeforeDays: 20,
                numberOfRepetitions: 4,
                learningState: 'learned',
              },
            },
          },
        },
      },
    },
    History: {
      childType: 'relevance',
      statistics: {
        avgLastRepetitionBeforeDays: 35,
        notLearned: 2,
        learning: 1,
        learned: 2,
        forRepeat: 1,
      },
      children: {
        1: {
          childType: 'subject',
          statistics: {
            avgLastRepetitionBeforeDays: 85,
            notLearned: 0,
            learning: 0,
            learned: 1,
            forRepeat: 1,
          },
          children: {
            'Roman Empire': {
              statistics: {
                label: 'Roman Empire',
                mastery: 0.92,
                lastRepetitionBeforeDays: 20,
                numberOfRepetitions: 5,
                learningState: 'learned',
              },
            },
            'World War II': {
              statistics: {
                label: 'World War II',
                mastery: 0.7,
                lastRepetitionBeforeDays: 150,
                numberOfRepetitions: 4,
                learningState: 'forRepeat',
              },
            },
          },
        },
        2: {
          childType: 'subject',
          statistics: {
            avgLastRepetitionBeforeDays: 17,
            notLearned: 0,
            learning: 1,
            learned: 1,
            forRepeat: 0,
          },
          children: {
            'Middle Ages': {
              statistics: {
                label: 'Middle Ages',
                mastery: 0.4,
                lastRepetitionBeforeDays: 4,
                numberOfRepetitions: 2,
                learningState: 'learning',
              },
            },
            Renaissance: {
              statistics: {
                label: 'Renaissance',
                mastery: 0.75,
                lastRepetitionBeforeDays: 30,
                numberOfRepetitions: 3,
                learningState: 'learned',
              },
            },
          },
        },
        3: {
          childType: 'subject',
          statistics: {
            avgLastRepetitionBeforeDays: 3,
            notLearned: 2,
            learning: 0,
            learned: 0,
            forRepeat: 0,
          },
          children: {
            'French Revolution': {
              statistics: {
                label: 'French Revolution',
                mastery: 0.15,
                lastRepetitionBeforeDays: 1,
                numberOfRepetitions: 1,
                learningState: 'notLearned',
              },
            },
            'Cold War': {
              statistics: {
                label: 'Cold War',
                mastery: 0.3,
                lastRepetitionBeforeDays: 5,
                numberOfRepetitions: 1,
                learningState: 'notLearned',
              },
            },
          },
        },
      },
    },
  },
};
