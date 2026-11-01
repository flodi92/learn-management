displayComputedStatistics should have three additional parameters:

- one arrow function that should be bounded to toggleSelection
- one observable for groupSelection and
- one observable for subjectSelection

Toggle selection should be invoked in the following way:

Pressing on space I want to toggle the selection of the currently focused group. There is a three value toggle between explicit selected (true), explicit unselected (false) or not specified(undefined) which means some of the items might be selected due to other specifications.

The state is indicated to the user (console.displayStatistics.ts) in the following way:
Explicitly selected groups have [+], unselected groups have [-],
if the selection is not defined then there are just three spaces

The state is not stored in console.displayStatistics.ts but only comes from groupSelection or subjectSelection from Overview.

groupSelection is applied to layers representing groups.

subjectSelection is applied to layers representing a single subject.

Update the markdown console.displayStatistics.md accordingly.
