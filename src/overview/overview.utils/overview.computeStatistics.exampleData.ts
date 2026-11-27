import { OverviewStatisticsTree } from './overview.toRecursiveStatistics.model';
import { toRecursiveStatistics } from './overview.toRecursiveStatistics';

const statisticsExampleTree: OverviewStatisticsTree = {
  defaultGroupType: 'category',
  statistics: {
    avgLastRepetitionBeforeDays: 19,
    selected: 0,
    selectionState: 'implicitNoSelection',
    notLearned: 6,
    learning: 5,
    learned: 9,
    forRepeat: 4,
  },
  children: {
    Mathematics: {
      defaultGroupType: 'relevance',
      statistics: {
        avgLastRepetitionBeforeDays: 10.5,
        selected: 0,
        selectionState: 'implicitNoSelection',
        notLearned: 1,
        learning: 1,
        learned: 3,
        forRepeat: 1,
      },
      children: {
        1: {
          defaultGroupType: 'taskDescription',
          statistics: {
            avgLastRepetitionBeforeDays: 2.5,
            selected: 0,
            selectionState: 'implicitNoSelection',
            notLearned: 0,
            learning: 0,
            learned: 2,
            forRepeat: 0,
          },
          children: {
            'Solving equations': {
              statistics: {
                id: 'Solving equations',
                label: 'Solving equations',
                mastery: 0.9,
                lastRepetitionBeforeDays: 3,
                numberOfRepetitions: 4,
                learningState: 'learned',
                examinations: [],
              },
            },
            Fractions: {
              statistics: {
                id: 'Fractions',
                label: 'Fractions',
                mastery: 0.95,
                lastRepetitionBeforeDays: 2,
                numberOfRepetitions: 5,
                learningState: 'learned',
                examinations: [
                  {
                    examinedBeforeDays: 2,
                    correctness: 1,
                    wasConfusedWith: [],
                  },
                  {
                    examinedBeforeDays: 6.5,
                    correctness: 0,
                    wasConfusedWith: ['Solving equations'],
                  },
                  {
                    examinedBeforeDays: 14,
                    correctness: 1,
                    wasConfusedWith: [],
                  },
                  {
                    examinedBeforeDays: 21,
                    correctness: 1,
                    wasConfusedWith: [],
                  },
                  {
                    examinedBeforeDays: 30,
                    correctness: 0,
                    wasConfusedWith: [],
                  },
                ],
              },
            },
          },
        },
        2: {
          defaultGroupType: 'taskDescription',
          statistics: {
            avgLastRepetitionBeforeDays: 22.5,
            selected: 0,
            selectionState: 'implicitNoSelection',
            notLearned: 0,
            learning: 1,
            learned: 0,
            forRepeat: 1,
          },
          children: {
            'Linear functions': {
              statistics: {
                id: 'Linear functions',
                label: 'Linear functions',
                mastery: 0.55,
                lastRepetitionBeforeDays: 5,
                numberOfRepetitions: 2,
                learningState: 'learning',
                examinations: [],
              },
            },
            Probability: {
              statistics: {
                id: 'Probability',
                label: 'Probability',
                mastery: 0.6,
                lastRepetitionBeforeDays: 40,
                numberOfRepetitions: 3,
                learningState: 'forRepeat',
                examinations: [],
              },
            },
          },
        },
        3: {
          defaultGroupType: 'taskDescription',
          statistics: {
            avgLastRepetitionBeforeDays: 6.5,
            selected: 0,
            selectionState: 'implicitNoSelection',
            notLearned: 1,
            learning: 0,
            learned: 1,
            forRepeat: 0,
          },
          children: {
            Geometry: {
              statistics: {
                id: 'Geometry',
                label: 'Geometry',
                mastery: 0.85,
                lastRepetitionBeforeDays: 12,
                numberOfRepetitions: 3,
                learningState: 'learned',
                examinations: [],
              },
            },
            Statistics: {
              statistics: {
                id: 'Statistics',
                label: 'Statistics',
                mastery: 0.1,
                lastRepetitionBeforeDays: 1,
                numberOfRepetitions: 1,
                learningState: 'notLearned',
                examinations: [],
              },
            },
          },
        },
      },
    },
    Chemistry: {
      defaultGroupType: 'relevance',
      statistics: {
        avgLastRepetitionBeforeDays: 7.17,
        selected: 0,
        selectionState: 'implicitNoSelection',
        notLearned: 2,
        learning: 2,
        learned: 1,
        forRepeat: 1,
      },
      children: {
        1: {
          defaultGroupType: 'taskDescription',
          statistics: {
            avgLastRepetitionBeforeDays: 6,
            selected: 0,
            selectionState: 'implicitNoSelection',
            notLearned: 1,
            learning: 0,
            learned: 0,
            forRepeat: 1,
          },
          children: {
            'Atomic structure': {
              statistics: {
                id: 'Atomic structure',
                label: 'Atomic structure',
                mastery: 0.2,
                lastRepetitionBeforeDays: 2,
                numberOfRepetitions: 1,
                learningState: 'notLearned',
                examinations: [],
              },
            },
            'Chemical reactions': {
              statistics: {
                id: 'Chemical reactions',
                label: 'Chemical reactions',
                mastery: 0.6,
                lastRepetitionBeforeDays: 10,
                numberOfRepetitions: 3,
                learningState: 'forRepeat',
                examinations: [],
              },
            },
          },
        },
        2: {
          defaultGroupType: 'taskDescription',
          statistics: {
            avgLastRepetitionBeforeDays: 7.5,
            selected: 0,
            selectionState: 'implicitNoSelection',
            notLearned: 0,
            learning: 1,
            learned: 1,
            forRepeat: 0,
          },
          children: {
            'Periodic table': {
              statistics: {
                id: 'Periodic table',
                label: 'Periodic table',
                mastery: 0.45,
                lastRepetitionBeforeDays: 6,
                numberOfRepetitions: 2,
                learningState: 'learning',
                examinations: [],
              },
            },
            Bonding: {
              statistics: {
                id: 'Bonding',
                label: 'Bonding',
                mastery: 0.8,
                lastRepetitionBeforeDays: 9,
                numberOfRepetitions: 4,
                learningState: 'learned',
                examinations: [],
              },
            },
          },
        },
        3: {
          defaultGroupType: 'taskDescription',
          statistics: {
            avgLastRepetitionBeforeDays: 8,
            selected: 0,
            selectionState: 'implicitNoSelection',
            notLearned: 1,
            learning: 1,
            learned: 0,
            forRepeat: 0,
          },
          children: {
            'Acids and bases': {
              statistics: {
                id: 'Acids and bases',
                label: 'Acids and bases',
                mastery: 0.1,
                lastRepetitionBeforeDays: 1,
                numberOfRepetitions: 1,
                learningState: 'notLearned',
                examinations: [],
              },
            },
            'Organic chemistry': {
              statistics: {
                id: 'Organic chemistry',
                label: 'Organic chemistry',
                mastery: 0.5,
                lastRepetitionBeforeDays: 15,
                numberOfRepetitions: 2,
                learningState: 'learning',
                examinations: [],
              },
            },
          },
        },
      },
    },
    Physics: {
      defaultGroupType: 'relevance',
      statistics: {
        avgLastRepetitionBeforeDays: 23.33,
        selected: 0,
        selectionState: 'implicitNoSelection',
        notLearned: 1,
        learning: 1,
        learned: 3,
        forRepeat: 1,
      },
      children: {
        1: {
          defaultGroupType: 'taskDescription',
          statistics: {
            avgLastRepetitionBeforeDays: 7,
            selected: 0,
            selectionState: 'implicitNoSelection',
            notLearned: 0,
            learning: 0,
            learned: 2,
            forRepeat: 0,
          },
          children: {
            'Forces and motion': {
              statistics: {
                id: 'Forces and motion',
                label: 'Forces and motion',
                mastery: 0.8,
                lastRepetitionBeforeDays: 6,
                numberOfRepetitions: 3,
                learningState: 'learned',
                examinations: [],
              },
            },
            Energy: {
              statistics: {
                id: 'Energy',
                label: 'Energy',
                mastery: 0.95,
                lastRepetitionBeforeDays: 8,
                numberOfRepetitions: 5,
                learningState: 'learned',
                examinations: [],
              },
            },
          },
        },
        2: {
          defaultGroupType: 'taskDescription',
          statistics: {
            avgLastRepetitionBeforeDays: 8,
            selected: 0,
            selectionState: 'implicitNoSelection',
            notLearned: 1,
            learning: 1,
            learned: 0,
            forRepeat: 0,
          },
          children: {
            Electricity: {
              statistics: {
                id: 'Electricity',
                label: 'Electricity',
                mastery: 0.5,
                lastRepetitionBeforeDays: 14,
                numberOfRepetitions: 2,
                learningState: 'learning',
                examinations: [],
              },
            },
            Waves: {
              statistics: {
                id: 'Waves',
                label: 'Waves',
                mastery: 0.3,
                lastRepetitionBeforeDays: 2,
                numberOfRepetitions: 1,
                learningState: 'notLearned',
                examinations: [],
              },
            },
          },
        },
        3: {
          defaultGroupType: 'taskDescription',
          statistics: {
            avgLastRepetitionBeforeDays: 55,
            selected: 0,
            selectionState: 'implicitNoSelection',
            notLearned: 0,
            learning: 0,
            learned: 1,
            forRepeat: 1,
          },
          children: {
            Optics: {
              statistics: {
                id: 'Optics',
                label: 'Optics',
                mastery: 0.65,
                lastRepetitionBeforeDays: 90,
                numberOfRepetitions: 4,
                learningState: 'forRepeat',
                examinations: [],
              },
            },
            Thermodynamics: {
              statistics: {
                id: 'Thermodynamics',
                label: 'Thermodynamics',
                mastery: 0.88,
                lastRepetitionBeforeDays: 20,
                numberOfRepetitions: 4,
                learningState: 'learned',
                examinations: [],
              },
            },
          },
        },
      },
    },
    History: {
      defaultGroupType: 'relevance',
      statistics: {
        avgLastRepetitionBeforeDays: 35,
        selected: 0,
        selectionState: 'implicitNoSelection',
        notLearned: 2,
        learning: 1,
        learned: 2,
        forRepeat: 1,
      },
      children: {
        1: {
          defaultGroupType: 'taskDescription',
          statistics: {
            avgLastRepetitionBeforeDays: 85,
            selected: 0,
            selectionState: 'implicitNoSelection',
            notLearned: 0,
            learning: 0,
            learned: 1,
            forRepeat: 1,
          },
          children: {
            'Roman Empire': {
              statistics: {
                id: 'Roman Empire',
                label: 'Roman Empire',
                mastery: 0.92,
                lastRepetitionBeforeDays: 20,
                numberOfRepetitions: 5,
                learningState: 'learned',
                examinations: [],
              },
            },
            'World War II': {
              statistics: {
                id: 'World War II',
                label: 'World War II',
                mastery: 0.7,
                lastRepetitionBeforeDays: 150,
                numberOfRepetitions: 4,
                learningState: 'forRepeat',
                examinations: [],
              },
            },
          },
        },
        2: {
          defaultGroupType: 'taskDescription',
          statistics: {
            avgLastRepetitionBeforeDays: 17,
            selected: 0,
            selectionState: 'implicitNoSelection',
            notLearned: 0,
            learning: 1,
            learned: 1,
            forRepeat: 0,
          },
          children: {
            'Middle Ages': {
              statistics: {
                id: 'Middle Ages',
                label: 'Middle Ages',
                mastery: 0.4,
                lastRepetitionBeforeDays: 4,
                numberOfRepetitions: 2,
                learningState: 'learning',
                examinations: [],
              },
            },
            Renaissance: {
              statistics: {
                id: 'Renaissance',
                label: 'Renaissance',
                mastery: 0.75,
                lastRepetitionBeforeDays: 30,
                numberOfRepetitions: 3,
                learningState: 'learned',
                examinations: [],
              },
            },
          },
        },
        3: {
          defaultGroupType: 'taskDescription',
          statistics: {
            avgLastRepetitionBeforeDays: 3,
            selected: 0,
            selectionState: 'implicitNoSelection',
            notLearned: 2,
            learning: 0,
            learned: 0,
            forRepeat: 0,
          },
          children: {
            'French Revolution': {
              statistics: {
                id: 'French Revolution',
                label: 'French Revolution',
                mastery: 0.15,
                lastRepetitionBeforeDays: 1,
                numberOfRepetitions: 1,
                learningState: 'notLearned',
                examinations: [],
              },
            },
            'Cold War': {
              statistics: {
                id: 'Cold War',
                label: 'Cold War',
                mastery: 0.3,
                lastRepetitionBeforeDays: 5,
                numberOfRepetitions: 1,
                learningState: 'notLearned',
                examinations: [],
              },
            },
          },
        },
      },
    },
  },
};

export const statisticsExample = toRecursiveStatistics(statisticsExampleTree);
