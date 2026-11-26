import { Starter } from '../../../starter';
import { ConsoleOverview } from '../../example.overview/console.overview';
import { RegExpTaskPresenter } from './regExp.taskPresenter/regExp.taskPresenter';
import { SQLiteDataBase } from '../../example.dataBase/sqlite.dataBase';
import { taskDescriptions } from './regExp.tasks/regExp.taskDescriptions';
import { RegExpTaskDescription } from './regExp.tasks/regExp.model';

export class RegExpStarter extends Starter<RegExpTaskDescription> {
  constructor() {
    let getLabelFromId!: (id: string) => string;

    super(
      new RegExpTaskPresenter(),
      taskDescriptions,
      new SQLiteDataBase(),
      new ConsoleOverview((id) => getLabelFromId(id)),
    );

    getLabelFromId = this.getLabelFromId.bind(this);
  }

  private getLabelFromId(id: string): string {
    return `${super.idTaskDescriptionMapping[id].expression}`;
  }
}
