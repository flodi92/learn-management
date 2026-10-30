import { LearnSubject } from '../../model';

export type GroupTypeOrSubject<GroupType extends string> =
  GroupType | 'subject';

export type GetGroups<
  Subject extends LearnSubject,
  GroupType extends string,
> = (
  GroupTypeOrSubject: GroupTypeOrSubject<GroupType>,
  subject: Subject,
) => string[] | number[];

export type RelevanceCategoryGroupType = 'relevance' | 'category';
