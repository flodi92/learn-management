import { regExpTasks } from '.';
import { Main } from '../../Main';
import { RegExpTask } from './regExp.model';
import { RegExpDataBase } from './regExpDataBase/regExpDataBase';
import { RegExpOverview } from './regExpOverview/regExpOverview';
import { RegExpTaskPresenter } from './regExpTaskPresenter/regExpTaskPresenter';

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
