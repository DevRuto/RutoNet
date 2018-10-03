import { Loader } from '../Loader';
import { Game } from './Game';
import { ModelLoadable } from './Model';

export class ModelLoader extends Loader<ModelLoadable> {
    private readonly game: Game;
    
    constructor(game: Game) {
        super();
        this.game = game;
    }

    protected onCreateItem(url: string): ModelLoadable {
        return new ModelLoadable(this.game, url);
    }
}
