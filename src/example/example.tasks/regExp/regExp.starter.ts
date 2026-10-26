import { regExpTasks } from './regExp.tasks/regExp.tasks';
import { Starter } from '../../../starter';
import { RegExpTask } from './regExp.model';
import { ConsoleOverview } from '../../example.overview/regExp.overview/console.overview';
import { RegExpTaskPresenter } from './regExp.taskPresenter/regExp.taskPresenter';
import { RegExpDataBase } from '../../example.dataBase/sqlite.dataBase';

export class RegExpStarter extends Starter<RegExpTask> {
  constructor() {
    super(
      new RegExpTaskPresenter(),
      regExpTasks,
      new RegExpDataBase(),
      new ConsoleOverview(),
    );
  }
}
