## ConsoleDisplayStatistics

The class ConsoleDisplayStatistics is a console tool to display the statistics of type Statistics<any, any, any> on the console.
The type Statistics is recursive. ConsoleDisplayStatistics only shows child statistics if they have been selected.

One layer is displayed in the following way.
It starts with the data listed in the statistics attribute of each layer. That is comma-separated without curly brackets and without line breaks.

Then there is a line `${childType} statistics`;
Underneath, it lists all the values of children, one per line. The focused child can be changed by the arrow keys up and down and is indicated by a yellow colored >.
Pressing the arrow right key expands the focused child and shows the children's data in the same way as already described for one layer. Its children can be expanded again and so on. Pressing the arrow right key again on an expanded child collapses it again (toggle). A child without children of its own only shows its statistics when expanded.
All lines that appear when expanding (statistics, `${childType} statistics` and the children) are indented one level deeper than the line that triggered the expansion. The layers are therefore indicated by an increasing number of indentation.
Having focused one expanded child and pressing the arrow down key the focus jumps to that child's first child. There is only one focus for all layers. The lines for statistics and `${childType} statistics` cannot be focused.

All actions that can be performed (which keys have which effect) should by explained by gray a console.log

Try to use already existing libraries for that job.
Use a color scheme similar to that used in the file regExp.taskPresenter.ts
