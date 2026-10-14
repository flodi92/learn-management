## definition

The TaskPresenter is a console tool that is invoked with all the tasks in [[../index.ts]].

It can be started with npm start-regExp.

Now, the console tool processes the 10 randomly chosen examples in the following way.

It presents the expression to the user.

Then it presents the concated and shuffled array of positiveExamples and negativeExamples. Each example in one line.
The user is asked to categorize each example as positive or negative by pressing p or n. When an example is categorized "positive" or "negative" is written in brackets behind the example The cursor then jumps to the next line. A console text explains that principle. When the last example is categorized the cursor jumps back to the first example which then can be overridden.

When the user hits enter all the user's categorizations are checked. False positive categorizations and false negative categorizations are marked as red.

When all is correct the console will tell. All correct.

When hitting enter again then the next task is examined.

When the last task has been resolved a summary is presented of how many tasks have been answered correctly and how many tasks have been answered incorrectly.
