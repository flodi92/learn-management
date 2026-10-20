import { StatisticsHierarchy } from './progressOverview';

export const statisticsExample: StatisticsHierarchy = {
  childType: 'category',
  statistics: {
    avgLastRepetitionBeforeDays: 23.25,
    notLearned: 3,
    learning: 4,
    learned: 5,
    forRepeat: 4,
  },
  children: {
    Mathematics: {
      childType: 'relevance',
      statistics: {
        avgLastRepetitionBeforeDays: 15,
        notLearned: 0,
        learning: 1,
        learned: 2,
        forRepeat: 1,
      },
      children: {
        1: {
          statistics: {
            label: 'Solving equations',
            mastery: 0.9,
            lastRepetitionBeforeDays: 3,
            numberOfRepetitions: 4,
            learningState: 'learned',
          },
        },
        2: {
          statistics: {
            label: 'Linear functions',
            mastery: 0.55,
            lastRepetitionBeforeDays: 5,
            numberOfRepetitions: 2,
            learningState: 'learning',
          },
        },
        3: {
          statistics: {
            label: 'Geometry',
            mastery: 0.85,
            lastRepetitionBeforeDays: 12,
            numberOfRepetitions: 3,
            learningState: 'learned',
          },
        },
        4: {
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
    Chemistry: {
      childType: 'relevance',
      statistics: {
        avgLastRepetitionBeforeDays: 4.75,
        notLearned: 2,
        learning: 1,
        learned: 0,
        forRepeat: 1,
      },
      children: {
        1: {
          statistics: {
            label: 'Atomic structure',
            mastery: 0.2,
            lastRepetitionBeforeDays: 2,
            numberOfRepetitions: 1,
            learningState: 'notLearned',
          },
        },
        2: {
          statistics: {
            label: 'Chemical reactions',
            mastery: 0.6,
            lastRepetitionBeforeDays: 10,
            numberOfRepetitions: 3,
            learningState: 'forRepeat',
          },
        },
        3: {
          statistics: {
            label: 'Periodic table',
            mastery: 0.45,
            lastRepetitionBeforeDays: 6,
            numberOfRepetitions: 2,
            learningState: 'learning',
          },
        },
        4: {
          statistics: {
            label: 'Acids and bases',
            mastery: 0.1,
            lastRepetitionBeforeDays: 1,
            numberOfRepetitions: 1,
            learningState: 'notLearned',
          },
        },
      },
    },
    Physics: {
      childType: 'relevance',
      statistics: {
        avgLastRepetitionBeforeDays: 29.5,
        notLearned: 0,
        learning: 1,
        learned: 2,
        forRepeat: 1,
      },
      children: {
        1: {
          statistics: {
            label: 'Forces and motion',
            mastery: 0.8,
            lastRepetitionBeforeDays: 6,
            numberOfRepetitions: 3,
            learningState: 'learned',
          },
        },
        2: {
          statistics: {
            label: 'Energy',
            mastery: 0.95,
            lastRepetitionBeforeDays: 8,
            numberOfRepetitions: 5,
            learningState: 'learned',
          },
        },
        3: {
          statistics: {
            label: 'Electricity',
            mastery: 0.5,
            lastRepetitionBeforeDays: 14,
            numberOfRepetitions: 2,
            learningState: 'learning',
          },
        },
        4: {
          statistics: {
            label: 'Optics',
            mastery: 0.65,
            lastRepetitionBeforeDays: 90,
            numberOfRepetitions: 4,
            learningState: 'forRepeat',
          },
        },
      },
    },
    History: {
      childType: 'relevance',
      statistics: {
        avgLastRepetitionBeforeDays: 43.75,
        notLearned: 1,
        learning: 1,
        learned: 1,
        forRepeat: 1,
      },
      children: {
        1: {
          statistics: {
            label: 'Roman Empire',
            mastery: 0.92,
            lastRepetitionBeforeDays: 20,
            numberOfRepetitions: 5,
            learningState: 'learned',
          },
        },
        2: {
          statistics: {
            label: 'Middle Ages',
            mastery: 0.4,
            lastRepetitionBeforeDays: 4,
            numberOfRepetitions: 2,
            learningState: 'learning',
          },
        },
        3: {
          statistics: {
            label: 'French Revolution',
            mastery: 0.15,
            lastRepetitionBeforeDays: 1,
            numberOfRepetitions: 1,
            learningState: 'notLearned',
          },
        },
        4: {
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
  },
};
