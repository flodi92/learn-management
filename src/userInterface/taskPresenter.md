## Definition

`TaskPresenter` is the abstract superclass of all task presenters. It guides the user through a sequence of task descriptions and owns the lifecycle that is shared by every presenter; subclasses only supply the task-specific presentation and evaluation.

The presenter is constructed with all task descriptions (`allTaskDescriptions`), which subclasses may use to look up related task descriptions. `start(taskDescriptions)` begins presenting the given list of task descriptions, which may be a subset of all task descriptions. It resets the position to the first task description and the summary to zero correct and zero incorrect answers. If the list is empty, it reports that no task descriptions are available and returns without loading or rendering anything. Otherwise, it loads and renders the first task description.

When a task description has been checked, `updateSummary` determines whether it was answered correctly, increments the matching counter of the summary and calls the registered `onAnswered` handler with a `Result`. The `Result` contains the ID of the current task description and a correctness score of `1` if it was answered correctly or `0` otherwise. If the task description was confused with other task descriptions, the `Result` additionally contains their ids as `wasConfusedWith`; otherwise the attribute is omitted.

`nextTaskDescription` advances to the next task description, loads and renders it. After the last task description, it calls `finish` instead. `finish` is expected to display the summary and to call the registered `onFinished` handler.

The handlers `onAnswered` and `onFinished` can be set and read via property accessors and may be unset.

## Hooks for subclasses

Subclasses implement:

- `loadTaskDescription()`: prepares the state for `currentTaskDescription`; called before each task description is rendered.
- `render()`: displays the current state.
- `isCurrentTaskDescriptionAnsweredCorrectly()`: tells whether the current task description was answered correctly.
- `currentTaskDescriptionWasConfusedWith()`: returns the ids of the task descriptions the current one was confused with (empty if none).
- `finish()`: displays the summary, ends the interaction and calls `onFinished`.

Subclasses decide when a task description counts as checked and call `updateSummary` and `nextTaskDescription` accordingly. They may extend `start` (e.g. to start listening for user input).
