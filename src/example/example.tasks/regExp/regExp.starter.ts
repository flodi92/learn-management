import { regExpTasks } from './regExp.tasks/regExp.tasks';
import { Starter } from '../../../starter';
import { RegExpTask } from './regExp.model';
import { ConsoleOverview } from '../../example.overview/console.overview';
import { RegExpTaskPresenter } from './regExp.taskPresenter/regExp.taskPresenter';
import { SQLiteDataBase } from '../../example.dataBase/sqlite.dataBase';

export class RegExpStarter extends Starter<RegExpTask> {
  constructor() {
    let getLabelFromId!: (id: string) => string;

    super(
      new RegExpTaskPresenter(),
      regExpTasks,
      new SQLiteDataBase(),
      new ConsoleOverview((id) => getLabelFromId(id)),
    );

    getLabelFromId = this.getLabelFromId.bind(this);
  }

  private getLabelFromId(id: string): string {
    return `${super.idSubjectMapping[id].expression}`;
  }
}
