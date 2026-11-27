import { TaskDescription, TimedResult } from '../../model';
import { OverviewGroupType } from '../overview.model';
import { computeAggregatedStatistics } from './overview.computeAggregatedStatistics';
import { computeStatistics } from './overview.computeStatistics';
import { computeTaskDescriptionsStatistics } from './overview.computeTaskDescriptionsStatistics';
import { getOverviewGroups } from './overview.getOverviewGroups';

const tasks: Record<string, TaskDescription> = {
  repeat: { id: 'repeat', categories: ['a'], relevance: 2 },
  learning: { id: 'learning', categories: ['a', 'b'] },
  dropped: { id: 'dropped', categories: ['b'] },
};
const results: TimedResult[] = [
  ...[0, 1, 3, 7].map((day) => ({ id: 'repeat', day, correctness: 1 })),
  { id: 'repeat', day: 8, correctness: 0 },
  { id: 'learning', day: 14, correctness: 1 },
  { id: 'dropped', day: 0, correctness: 1 },
];

const createStatistics = (getSelectedIds: () => string[] = () => []) =>
  computeStatistics(
    tasks,
    results,
    15,
    (id) => `Label ${id}`,
    ['category', 'relevance'] as OverviewGroupType[],
    ['learningState', 'selectionState'] as OverviewGroupType[],
    getOverviewGroups,
    computeTaskDescriptionsStatistics,
    computeAggregatedStatistics,
    getSelectedIds,
    () => undefined,
  );

describe('computeStatistics with optional group types', () => {
  it('offers optional group types besides the default ones', () => {
    const root = createStatistics();

    expect(root.defaultGroupType).toBe('category');
    expect(root.possibleGroupTypes).toEqual([
      'category',
      'relevance',
      'learningState',
      'selectionState',
      'taskDescription',
    ]);
  });

  it('groups by the learning state of the task descriptions', () => {
    const groups = createStatistics().getChildren('learningState')!;

    expect(Object.keys(groups).sort()).toEqual([
      'forRepeat',
      'learning',
      'notLearned',
    ]);
    expect(groups.forRepeat.statistics).toMatchObject({ forRepeat: 1 });
    expect(groups.learning.statistics).toMatchObject({ learning: 1 });
    expect(groups.notLearned.statistics).toMatchObject({ notLearned: 1 });
  });

  it('groups by whether the task descriptions are selected', () => {
    const groups = createStatistics(() => ['learning']).getChildren(
      'selectionState',
    )!;

    expect(Object.keys(groups).sort()).toEqual(['notSelected', 'selected']);
    expect(groups.selected.statistics).toMatchObject({
      selected: 1,
      learning: 1,
    });
    expect(groups.notSelected.statistics).toMatchObject({
      selected: 0,
      forRepeat: 1,
      notLearned: 1,
    });
  });

  it('puts all task descriptions into one selectionState group if the selection is uniform', () => {
    expect(
      Object.keys(createStatistics().getChildren('selectionState')!),
    ).toEqual(['notSelected']);
    expect(
      Object.keys(
        createStatistics(() => Object.keys(tasks)).getChildren(
          'selectionState',
        )!,
      ),
    ).toEqual(['selected']);
  });

  it('regroups by the selection when the selection changes', () => {
    let selectedIds: string[] = [];
    const root = createStatistics(() => selectedIds);

    expect(Object.keys(root.getChildren('selectionState')!)).toEqual([
      'notSelected',
    ]);

    selectedIds = ['repeat'];
    const groups = root.getChildren('selectionState')!;
    expect(Object.keys(groups).sort()).toEqual(['notSelected', 'selected']);
    expect(root.getChildrenIds!([['selectionState', 'selected']])).toEqual([
      'repeat',
    ]);
  });

  it('removes only the chosen group type for the children', () => {
    const root = createStatistics();

    const byCategory = root.getChildren('category')!.a;
    expect(byCategory.defaultGroupType).toBe('relevance');
    expect(byCategory.possibleGroupTypes).toEqual([
      'relevance',
      'learningState',
      'selectionState',
      'taskDescription',
    ]);

    const byLearningState = root.getChildren('learningState')!.learning;
    expect(byLearningState.defaultGroupType).toBe('category');
    expect(byLearningState.possibleGroupTypes).toEqual([
      'category',
      'relevance',
      'selectionState',
      'taskDescription',
    ]);
  });

  it('can group by the optional type after all default types are used', () => {
    const root = createStatistics();

    const lastLayer = root
      .getChildren('category')!
      .b.getChildren('relevance')![1];
    expect(lastLayer.defaultGroupType).toBe('taskDescription');
    expect(lastLayer.possibleGroupTypes).toEqual([
      'learningState',
      'selectionState',
      'taskDescription',
    ]);
    expect(Object.keys(lastLayer.getChildren('learningState')!)).toEqual([
      'learning',
      'notLearned',
    ]);
  });

  it('resolves child ids along a path of an optional group type', () => {
    const root = createStatistics();

    expect(root.getChildrenIds!([['learningState', 'learning']])).toEqual([
      'learning',
    ]);
    expect(
      root.getChildrenIds!([
        ['learningState', 'notLearned'],
        ['category', 'b'],
      ]),
    ).toEqual(['dropped']);
  });

  it('rejects group types that are neither default nor optional', () => {
    expect(() =>
      createStatistics().getChildren('unknown' as OverviewGroupType),
    ).toThrow('Unknown group type "unknown"');
  });
});
