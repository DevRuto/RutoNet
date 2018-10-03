import { Vector3 } from '../../Facepunch/Math';
import { ModelBase, ModelBaseMaterial } from './ModelBase';
import { Texture } from '../../Facepunch/WebGame/Texture';
import { VertexAttribute } from '../../Facepunch/WebGame/VertexAttribute';

export class VertexLitGenericMaterial extends ModelBaseMaterial {
  ambient: Vector3[];
  baseTexture: Texture = null;
  noFog = false;
  shadowCast = true;
  noCull = false;
}

export class VertexLitGeneric extends ModelBase<VertexLitGenericMaterial> {
  [x: string]: any;
    constructor(context: WebGLRenderingContext) {
        super(context, VertexLitGenericMaterial);

        const gl = context;

        this.includeShaderSource(gl.VERTEX_SHADER, `
            attribute vec3 aEncodedColors;

            varying vec3 vVertexLighting;
            varying vec3 vAlbedoModulation;

            void main()
            {
                vVertexLighting = ${this.uEmission} != 0 ? vec3(1.0, 1.0, 1.0) : floor(aEncodedColors) * (2.0 / 255.0);
                vAlbedoModulation = fract(aEncodedColors) * (256.0 / 255.0);

                ModelBase_main();
            }`);

        this.includeShaderSource(gl.FRAGMENT_SHADER, `
            precision mediump float;

            varying vec3 vVertexLighting;
            varying vec3 vAlbedoModulation;

            void main()
            {
                vec4 mainSample = ModelBase_main();
                gl_FragColor = vec4(ApplyFog(mainSample.rgb * vVertexLighting * vAlbedoModulation), mainSample.a);
            }`);

        this.addAttribute("aEncodedColors", VertexAttribute.rgb);

        this.compile();
    }
}

