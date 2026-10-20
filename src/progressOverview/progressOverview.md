## ProgressOverview

The class ProgressOverview is a console tool to display the statistics of type Statistics<any, any, any> on the console.
The type Statistics is recursive. ProgressOverview only shows child statistics if they have been selected.

One layer is displayed in the following way.
It starts with the data listed in the statistics attribute of each layer. That is comma-separated without curly brackets and without line breaks.

Then there is a line `${childType} statistics`;
Underneath, it lists all the values of children, one per line. The focused child can be changed by the arrow keys up and down and is indicated by a yellow colored >.
Pressing on the arrow left key the view expands and shows the childrens data in the same way as already described for one layer. Its children can be expanded again and so on. The layers are indicated by an increasing number of indentation.
Having focused one expanded child and pressing the arrow down key the focus jumps to that child's first child. There is only one focus for all layers. The lines for statistics and `${childType} statistics` cannot be focused.

All actions that can be performed (which keys have which effect) should by explained by gray a console.log

ProgressOverview does not know the type StatisticsHierarchy, it only knows the type Statistics.
Try to use already existing libraries for that job.
Use a color scheme similar to that used in the file regExp.taskPresenter.ts

## Testing Scenario

The command npm run start-progress invokes ProgressOverview with testing data from progressOverview.exampleData.ts.
