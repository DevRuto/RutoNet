import { Loader } from '../Loader';
import { Game } from './Game';
import { MaterialLoadable } from './Material';

export class MaterialLoader extends Loader<MaterialLoadable> {
    private readonly game: Game;
    
    constructor(game: Game) {
        super();
        this.game = game;
    }

    protected onCreateItem(url: string): MaterialLoadable {
        return new MaterialLoadable(this.game, url);
    }
}
