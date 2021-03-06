﻿import { DrawListItem } from '../Facepunch/WebGame/DrawListItem';
import { Material } from '../Facepunch/WebGame/Material';
import { IMeshData } from '../Facepunch/WebGame/MeshGroup';
import { DrawMode } from '../Facepunch/WebGame/MeshHandle';
import { VertexAttribute } from '../Facepunch/WebGame/VertexAttribute';
import { MapViewer } from './MapViewer';

export class SkyCube extends DrawListItem {
    constructor(viewer: MapViewer, material: Material) {
        super();

        const meshData: IMeshData = {
            attributes: [VertexAttribute.uv, VertexAttribute.alpha],
            elements: [
                {
                    mode: DrawMode.Triangles,
                    material: material,
                    indexOffset: 0,
                    indexCount: 36
                }
            ],
            vertices: [],
            indices: []
        };

        for (let face = 0; face < 6; ++face) {
            meshData.vertices.push(0, 0, face);
            meshData.vertices.push(1, 0, face);
            meshData.vertices.push(1, 1, face);
            meshData.vertices.push(0, 1, face);

            const index = face * 4;
            meshData.indices.push(index + 0, index + 1, index + 2);
            meshData.indices.push(index + 0, index + 2, index + 3);
        }

        this.addMeshHandles(viewer.meshes.addMeshData(meshData));
    }
}
