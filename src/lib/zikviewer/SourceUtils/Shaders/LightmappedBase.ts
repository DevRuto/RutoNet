import { CommandBuffer } from '../../Facepunch/WebGame/CommandBuffer';
import { VertexAttribute } from '../../Facepunch/WebGame/VertexAttribute';
import { ModelBase } from './ModelBase';
import { TextureUtils, Texture } from '../../Facepunch/WebGame/Texture';
import { UniformSampler, UniformMatrix4 } from '../../Facepunch/WebGame/Uniform';
import { ModelBaseMaterial } from './ModelBase';
import { Map } from '../Map';

export class LightmappedBaseMaterial extends ModelBaseMaterial {
  baseTexture: Texture = null;
  noFog = false;
  shadowCast = false;
}

export abstract class LightmappedBase<TMaterial extends LightmappedBaseMaterial> extends ModelBase<TMaterial> {
    readonly uLightmap = this.addUniform("uLightmap", UniformSampler);
    readonly uProjection = this.addUniform("uProjection", UniformMatrix4);
    constructor(context: WebGLRenderingContext, ctor: { new(): TMaterial }) {
        super(context, ctor);

        const gl = context;

        this.includeShaderSource(gl.VERTEX_SHADER, `
            attribute vec2 aLightmapCoord;

            varying vec2 vLightmapCoord;

            void LightmappedBase_main()
            {
                ModelBase_main();

                vLightmapCoord = aLightmapCoord;
            }`);

        this.includeShaderSource(gl.FRAGMENT_SHADER, `
            precision mediump float;

            varying vec2 vLightmapCoord;

            uniform sampler2D ${this.uLightmap};
            uniform vec4 ${this.uLightmap.getSizeUniform()};

            vec3 DecompressLightmapSample(vec4 sample)
            {
                float exp = sample.a * 255.0 - 128.0;
                return sample.rgb * pow(2.0, exp);
            }

            vec3 ApplyLightmap(vec3 inColor)
            {
                const float gamma = 1.0 / 2.2;

                vec2 size = ${this.uLightmap.getSizeUniform()}.xy;
                vec2 invSize = ${this.uLightmap.getSizeUniform()}.zw;
                vec2 scaledCoord = vLightmapCoord * size - vec2(0.5, 0.5);
                vec2 minCoord = floor(scaledCoord) + vec2(0.5, 0.5);
                vec2 maxCoord = minCoord + vec2(1.0, 1.0);
                vec2 delta = scaledCoord - floor(scaledCoord);

                minCoord *= invSize;
                maxCoord *= invSize;

                vec3 sampleA = DecompressLightmapSample(texture2D(${this.uLightmap}, vec2(minCoord.x, minCoord.y)));
                vec3 sampleB = DecompressLightmapSample(texture2D(${this.uLightmap}, vec2(maxCoord.x, minCoord.y)));
                vec3 sampleC = DecompressLightmapSample(texture2D(${this.uLightmap}, vec2(minCoord.x, maxCoord.y)));
                vec3 sampleD = DecompressLightmapSample(texture2D(${this.uLightmap}, vec2(maxCoord.x, maxCoord.y)));

                vec3 sample = mix(mix(sampleA, sampleB, delta.x), mix(sampleC, sampleD, delta.x), delta.y);

                return inColor * pow(sample, vec3(gamma, gamma, gamma));
            }`);

        this.addAttribute("aLightmapCoord", VertexAttribute.uv2);

        this.uLightmap.setDefault(TextureUtils.getWhiteTexture(context));
        
    }

    bufferSetup(buf: CommandBuffer): void {
        super.bufferSetup(buf);

        this.uLightmap.bufferParameter(buf, Map.lightmapParam);
    }
}

