import { ReplayViewer } from "./ReplayViewer";
import { CameraMode } from "./SourceUtils/MapViewer";

import { Utils } from './Utils';

export class InfoDisplay {

    private readonly viewer: ReplayViewer;

    private readonly element: HTMLElement;

    private readonly titleElem: HTMLElement;
    private readonly infoContainer: HTMLElement;

    constructor(viewer: ReplayViewer, container?: HTMLElement) {
        this.viewer = viewer;

        if (container === undefined) container = viewer.container;

        const element = this.element = document.createElement("div");
        element.classList.add("info-display");
        element.innerHTML = `<div class="info-title">Replay Info</div><div class="info-list"></div>`;

        container.appendChild(element);

        this.titleElem = element.getElementsByClassName("info-title")[0] as HTMLSpanElement;
        this.infoContainer = element.getElementsByClassName("info-list")[0] as HTMLElement;

        this.viewer.replayLoaded.addListener(replay => {
            this.addInfo("Map", replay.mapName);
            this.addInfo("Course", Utils.formatCourse(replay.course));
            this.addInfo("Mode", Utils.modeToModeName(replay.mode));
            this.addInfo("Player", `${replay.playerName} (${replay.steamId})`);
            this.addInfo("Time", Utils.formatRecordTime(replay.time));
            this.addInfo("Teleports", replay.teleportsUsed);
        });

        viewer.showInfoDisplayChanged.addListener(showInfoDisplay => {
            if (showInfoDisplay && viewer.cameraMode === CameraMode.Fixed) this.show();
            else this.hide();
        });

        viewer.cameraModeChanged.addListener(cameraMode => {
            if (viewer.showInfoDisplay && cameraMode === CameraMode.Fixed) this.show();
            else this.hide();
        });
    }

    show(): void {
        this.element.style.display = "block";
    }
    
    hide(): void {
        this.element.style.display = "none";
    }

    private addInfo(title: String, value: any): void {
        const info = document.createElement("div");
        info.classList.add("info");
        info.innerHTML = `
            <div class="info-item">
            <span class="info-item-title">${Utils.escapeString(title)}:
            </span><div class="info-item-value">${Utils.escapeString(value)}</div></div>`;

        this.infoContainer.appendChild(info);
    }
}
