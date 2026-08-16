# LearningScheduler

## General function

LearningScheduler is a class that selects subjects to be learned during the next learning session aiming to optimize the selection based on analyzing former results.

## Principles

That optimization is based on the following prinziples which derive from the model of raise and decline of mastery [@todo link].

### 1 Limit the number of learning in progress subjects

Learning subjects will take some repetitions until the level of mastery has raised to the point where the learner is confident of performing correctly.

To ensure that the learner can focus on a number of learning in progress subjects the algorithm should only introduce new subjects when others have already reached a certain degree of mastery. The mastery is computed based on the number of repetitions, their correctness and temporal distance.

### 2 Assure constant repetition of learning in progress subjects

Subjects once introduced into the learning process should be repeated regularly with low temporal distance until the user has reached a certain level of mastery.

### 3 Avoids unnecessary repetitions

Subjects that have been answered with a high level of correctness for several times are considered of having a high level of mastery. They should be repeated with higher temporal distance to allow other subjects to be learned.

### 4 Repeat learned subjects

Subjects that have already reached a high level of mastery should be repeated from time to time in order to assure they are constantly kept by the learner. In case a repetition is successfull the temporal distance to the next repetition will even be greater. The oposite goes if the repetition shows a low correctness. In that case the repetitions will become more frequent.

## interface

### constructor

LearnScheduler's constructor is invoked with an array of subjects. It is just a string array of subject ids. The LearningScheduler does not concern on what concrete tasks are behind that subjects.

### nextSession

The method nextSession requests a subset of the given subjects to be learned in the next session which is based on the principles that are defined above. Count defines the number of subjects to be put into that session. Time defines when that learning happens. A difference of one means one day.

### get mastery

Returns the current level of mastery for each of the given subjects
