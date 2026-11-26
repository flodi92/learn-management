I want you to reflect the new typings of OverviewRecursiveUndeterminedStatistics for displaying them in the overview.

On each layer before showing the individual children of that layer I want that the label e.g. "relevance statistics" or "taskDescription statistics" is a focusable line with the yellow ">". Currently it cannot be focused. It shows per default the value "defaultGroupType". Pressing the arrow keys left and right toggles through the array possibleGroupTypes. The attribute children should not be referenced anymore. Instead use getChildren with the currently chosen groupType.

You can assume that defaultGroupType is always in possibleGroupTypes except for taskDescription. Find an elegant way to deal with that.

Make sure that the selection works as expected on every layer.
You might want to rewrite getChildrenIds in order to support every path, not only the path of defaultGroupType.
