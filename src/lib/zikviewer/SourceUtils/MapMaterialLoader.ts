﻿import {
    IMaterialInfo, Material, MaterialLoadable, MaterialPropertyType
} from '../Facepunch/WebGame/Material';
import { ITextureInfo } from '../Facepunch/WebGame/Texture';
import { IPageInfo } from './Map';
import { MapViewer } from './MapViewer';
import { PagedLoader, ResourcePage } from './PagedLoader';

export interface IMapMaterialPage {
    textures: ITextureInfo[];
    materials: IMaterialInfo[];
}

export class MapMaterialPage extends ResourcePage<IMapMaterialPage, IMaterialInfo> {
    private readonly viewer: MapViewer;

    private materials: IMaterialInfo[];

    constructor(viewer: MapViewer, page: IPageInfo) {
        super(page);

        this.viewer = viewer;
    }

    onLoadValues(page: IMapMaterialPage): void {
        this.materials = page.materials;

        const textures = page.textures;
        for (let i = 0, iEnd = this.materials.length; i < iEnd; ++i) {
            const mat = this.materials[i];
            if (mat == null) continue;
            const props = mat.properties;
            for (let j = 0, jEnd = props.length; j < jEnd; ++j) {
                const prop = props[j];
                if (prop.type !== MaterialPropertyType.TextureIndex) continue;
                prop.type = MaterialPropertyType.TextureInfo;
                prop.value = textures[prop.value as number];
            }
        }

        super.onLoadValues(page);
    }

    protected onGetValue(index: number): IMaterialInfo {
        return this.materials[index];
    }
}

export class MapMaterialLoader extends PagedLoader<IMapMaterialPage, IMaterialInfo, MapMaterialPage> {
    readonly viewer: MapViewer;

    private readonly materials: {[index: number]: MaterialLoadable} = {};

    constructor(viewer: MapViewer) {
        super();
        this.viewer = viewer;
    }

    loadMaterial(index: number): Material {
        let material = this.materials[index];
        if (material !== undefined) return material;
        this.materials[index] = material = new MaterialLoadable(this.viewer);
        this.load(index, info => info == null ? null : material.loadFromInfo(info));
        return material;
    }

    protected onCreatePage(page: IPageInfo): MapMaterialPage {
        return new MapMaterialPage(this.viewer, page);
    }
}
