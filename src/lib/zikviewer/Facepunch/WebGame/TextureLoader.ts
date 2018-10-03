import { Loader } from '../Loader';
import { TextureLoadable } from './Texture';

export class TextureLoader extends Loader<TextureLoadable> {
  private readonly context: WebGLRenderingContext;
  
  constructor(context: WebGLRenderingContext) {
      super();
      this.context = context;
  }

  protected onCreateItem(url: string): TextureLoadable {
      return new TextureLoadable(this.context, url);
  }
}
