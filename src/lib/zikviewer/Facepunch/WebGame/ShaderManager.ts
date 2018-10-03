import { Material } from './Material';
import { IProgramCtor, ShaderProgram } from './ShaderProgram';

import * as FacepunchShaders from './Shaders/index';
import * as SourceUtilsShaders from './../../SourceUtils/Shaders/index';

export class ShaderManager {
  private namedPrograms: { [name: string]: ShaderProgram } = {};
  private ctorPrograms: {ctor: IProgramCtor, program: ShaderProgram}[] = [];

  readonly context: WebGLRenderingContext;
  readonly shaders = {
    ...SourceUtilsShaders,
    //...FacepunchShaders
  }
  constructor(context: WebGLRenderingContext) {
      this.context = context;
  }

  resetUniformCache(): void {
      for (let i = 0, iEnd = this.ctorPrograms.length; i < iEnd; ++i) {
          this.ctorPrograms[i].program.resetUniformCache();
      }
  }

  private getFromName(name: string): ShaderProgram {
      const program = this.namedPrograms[name];
      if (program !== undefined) return program;

      const nameParts = name.split(".");
      console.log("getFromName", nameParts);
      console.log("shader", this.shaders[nameParts[2]])
      let target: any = this.shaders[nameParts[2]];

      const Type: IProgramCtor = target;
      if (Type === undefined) {
          console.warn(`Unknown shader name '${name}'.`);
          return this.namedPrograms[name] = null;
      }
      return this.namedPrograms[name] = this.getFromCtor(Type);
  }

  private getFromCtor(ctor: IProgramCtor): ShaderProgram {
      for (let i = 0, iEnd = this.ctorPrograms.length; i < iEnd; ++i) {
          const ctorProgram = this.ctorPrograms[i];
          if (ctorProgram.ctor === ctor) return ctorProgram.program;
      }
      console.log("ctor", ctor)
      const program = new ctor(this.context);
      this.ctorPrograms.push({ctor: ctor, program: program});
      return program;
  }

  get(name: string): ShaderProgram;
  get(ctor: IProgramCtor): ShaderProgram;
  get(nameOrCtor: string | IProgramCtor): ShaderProgram {
      if (typeof nameOrCtor === "string") {
          return this.getFromName(nameOrCtor as string);
      } else {
          return this.getFromCtor(nameOrCtor as IProgramCtor);
      }
  }

  createMaterial(ctor: IProgramCtor, isDynamic: boolean): Material {
      return new Material(this.getFromCtor(ctor), isDynamic);
  }

  dispose(): void {
      for (let name in this.namedPrograms) {
          if (this.namedPrograms.hasOwnProperty(name)) {
              this.namedPrograms[name].dispose();
          }
      }

      this.namedPrograms = {};
  }
}
