import { regExpTasks } from './regExp.tasks/regExp.tasks';
import { Main } from '../../../main';
import { RegExpTask } from './regExp.model';
import { RegExpOverview } from './regExp.overview/regExp.overview';
import { RegExpTaskPresenter } from './regExp.taskPresenter/regExp.taskPresenter';
import { RegExpDataBase } from '../../example.dataBase/sqlite.dataBase';

export class RegExpMain extends Main<RegExpTask> {
  constructor() {
    super(
      new RegExpTaskPresenter(),
      regExpTasks,
      new RegExpDataBase(),
      new RegExpOverview(),
    );
  }
}

const main = new RegExpMain();
main.start();
