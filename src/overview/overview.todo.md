I want you to create another file overview.displaySelectableComputedStatistics.ts in overview/utils folder.

That file implements a class of that name. Migrate all the behaviour that refers to selection from Overview to that class but keep displayStatistics and displayComputedStatistics.

Write an arrow function in that file of the same name that creates an instance of that class and invokes the display function so that that class does not necessarily need to be referenced from outsite.

That arrow function is invoked in the Overview class in displayStatistics in the place where currently this.displayComputedStatistics is invoked.

It takes as parameter a reference to this.displayComputedStatistics and this.statistics but nothing else.

It returns an array of selected items.

This is a refactoring. It is very important that the behaviour of that program does not change.
