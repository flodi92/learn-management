import { regExpTasks } from './regExp.tasks/regExp.tasks';
import { Starter } from '../../../starter';
import { RegExpTask } from './regExp.model';
import { ConsoleOverview } from '../../example.overview/console.overview';
import { RegExpTaskPresenter } from './regExp.taskPresenter/regExp.taskPresenter';
import { SQLiteDataBase } from '../../example.dataBase/sqlite.dataBase';

export class RegExpStarter extends Starter<RegExpTask> {
  constructor() {
    super(
      new RegExpTaskPresenter(),
      regExpTasks,
      new SQLiteDataBase(),
      new ConsoleOverview(),
    );
  }
}
