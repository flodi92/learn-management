## Definition

The `RegExpTaskPresenter` guides the user through a sequence of regular-expression tasks in the console. For each task, it displays the regular expression and a shuffled selection of its positive and negative examples. When the task contains examples of both kinds, the selection includes at least one of each; the number shown is limited by the configured maximum. Examples with an alternative display that alternative in angle brackets instead of the example value.

The user classifies every displayed example as positive (it matches) or negative (it does not match). Use **↑/↓** to move between examples; movement wraps from the last example to the first and vice versa. Use **←/→** to set the selected example to positive or negative, or press **p/n** to classify it and automatically move to the next example. The cursor also wraps when advancing with **p/n**.

Press **Enter** after classifying all examples to check the task. If any examples are still unclassified, the presenter asks the user to classify them first. Once checked, each example is shown in green if its classification is correct and red if it is incorrect. The presenter reports whether all answers were correct or some were wrong, and records the task result. Press **Enter** again to continue to the next task.

After the final task, the presenter displays a summary of the number of correctly and incorrectly answered tasks, then signals that the presentation has finished. If started with no tasks, it reports that no tasks are available.

## Relationship to `TaskPresenter`

The superclass defines the lifecycle shared by task presenters: `start(tasks)` begins presenting a list of tasks, `onAnswered` receives a `Result` whenever a task has been checked, and `onFinished` signals that the presentation is complete. `RegExpTaskPresenter.start` initializes the task sequence and starts the console interaction. After each check, it calls the registered `onAnswered` handler with the current task's ID and a correctness score of `1` when every example was classified correctly or `0` otherwise. After the last task, it shows the summary and calls the registered `onFinished` handler. When started with an empty task list, it reports that there are no tasks and returns without starting the interaction.
