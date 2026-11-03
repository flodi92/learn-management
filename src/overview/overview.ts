import { LearnSubject, TimedResult } from '../model';
import { getToday } from '../utils';
import {
  OverviewRecursiveStatistics,
  RelevanceCategoryGroupType,
} from './overview.model';
import { computeAggregatedStatistics } from './overview.utils/overview.computeAggregatedStatistics';
import { computeStatistics } from './overview.utils/overview.computeStatistics';
import { GroupTypeOrSubject } from './overview.utils/overview.computeStatistics.model';
import { computeSubjectsStatistics } from './overview.utils/overview.computeSubjectsStatistics';
import { getGroupsForRelevanceAndCategory } from './overview.utils/overview.getGroupsForRelevanceAndCategory';

export abstract class Overview<Subject extends LearnSubject> {
  private statistics: OverviewRecursiveStatistics | undefined;
  private groupSelection: Record<string, boolean | undefined> = {};
  private subjectSelection: Record<string, true | undefined> = {};

  constructor(public getLabelFromId: (id: string) => string) {}

  abstract askForNumberOfTasks(): Promise<number>;
  abstract showSessionFinishedView(): Promise<void>;

  public async displayStatistics(
    idSubjectMapping: Record<string, Subject>,
    results: TimedResult[],
    preselectedSubjects: Subject[],
  ): Promise<Subject[]> {
    this.groupSelection = Object.fromEntries(
      preselectedSubjects.map(({ id }) => [
        JSON.stringify([['subject', id]]),
        true,
      ]),
    );

    this.statistics = computeStatistics(
      idSubjectMapping,
      results,
      getToday(),
      this.getLabelFromId,
      ['category', 'relevance'] satisfies RelevanceCategoryGroupType[],
      getGroupsForRelevanceAndCategory,
      computeSubjectsStatistics,
      computeAggregatedStatistics,
    );
    this.updateSubjectSelection();
    await this.displayComputedStatistics(
      this.statistics,
      this.toggleSelection.bind(this),
      () => this.groupSelection,
      () => this.subjectSelection,
      () => this.numberOfSelectedItems,
    );

    return this.selectedItems.map((id) => idSubjectMapping[id]);
  }

  protected abstract displayComputedStatistics(
    statistics: OverviewRecursiveStatistics,
    toggleSelection: (path: [string, string | number][]) => void,
    groupSelection: () => Record<string, boolean | undefined>,
    subjectSelection: () => Record<string, true | undefined>,
    numberOfSelectedItems: () => number,
  ): Promise<void>;

  private get selectedItems() {
    return Object.entries(this.subjectSelection)
      .filter(([, selected]) => selected)
      .map(([id]) => id);
  }

  private get numberOfSelectedItems() {
    return this.selectedItems.length;
  }

  private toggleSelection(path: [string, string | number][]) {
    const pathStr = JSON.stringify(path);
    this.groupSelection[pathStr] =
      this.groupSelection[pathStr] === undefined
        ? true
        : this.groupSelection[pathStr] === true
          ? false
          : undefined;

    this.updateSubjectSelection();
  }

  private updateSubjectSelection() {
    if (!this.statistics) return;

    const entries = Object.entries(this.groupSelection).map(
      ([pathStr, selected]) =>
        [
          JSON.parse(pathStr) as [
            GroupTypeOrSubject<RelevanceCategoryGroupType>,
            string | number,
          ][],
          selected,
        ] as const,
    );

    const [subjectSelection, pureGroupSelection] = entries.reduce(
      (acc, entry): [typeof entries, typeof entries] => {
        const [subjectSelection, pureGroupSelection] = acc;
        const [path] = entry;
        const [lastGroupType] = path[path.length - 1];

        return lastGroupType === 'subject'
          ? [[...subjectSelection, entry], pureGroupSelection]
          : [subjectSelection, [...pureGroupSelection, entry]];
      },
      [[], []] as [typeof entries, typeof entries],
    );

    const sortedPureGroupSelection = pureGroupSelection.sort(
      ([pathA], [pathB]) => pathA.length - pathB.length,
    );

    this.subjectSelection = subjectSelection.reduce(
      (acc, [path, selected]) => {
        const [, lastId] = path[path.length - 1];
        acc[lastId] = selected ? true : undefined;
        return acc;
      },
      {} as Record<string, true | undefined>,
    );

    this.subjectSelection = sortedPureGroupSelection.reduce(
      (acc, [path, selected]) => {
        const childrenIds = this.statistics!.getChildrenIds!(path);

        childrenIds.forEach((id) => {
          if (selected === true) {
            acc[id] = true;
          }
        });

        return acc;
      },
      this.subjectSelection,
    );

    this.subjectSelection = sortedPureGroupSelection
      .reverse()
      .reduce((acc, [path, selected]) => {
        const childrenIds = this.statistics!.getChildrenIds!(path);

        childrenIds.forEach((id) => {
          if (selected === false) {
            acc[id] = undefined;
          }
        });

        return acc;
      }, this.subjectSelection);
  }
}
