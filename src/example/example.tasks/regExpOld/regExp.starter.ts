import { regExpTaskDescriptions } from './regExp.taskDescriptions/regExp.taskDescriptions';
import { Starter } from '../../../starter';
import { RegExpTaskDescription } from './regExp.model';
import { ConsoleOverview } from '../../example.overview/console.overview';
import { RegExpTaskPresenter } from './regExp.taskPresenter/regExp.taskPresenter';
import { SQLiteDataBase } from '../../example.dataBase/sqlite.dataBase';

export class RegExpStarter extends Starter<RegExpTaskDescription> {
  constructor() {
    let getLabelFromId!: (id: string) => string;

    super(
      new RegExpTaskPresenter(),
      regExpTaskDescriptions,
      new SQLiteDataBase('regExpOld.sqlite'),
      new ConsoleOverview((id) => getLabelFromId(id)),
    );

    getLabelFromId = this.getLabelFromId.bind(this);
  }

  private getLabelFromId(id: string): string {
    return `${super.idTaskDescriptionMapping[id].expression}`;
  }
}
