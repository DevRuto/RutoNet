import React from "react";
import { ReplayViewer } from "../lib/zikviewer/ReplayViewer";
import { CameraMode } from '../lib/zikviewer/SourceUtils/MapViewer';
import config from '../config';

class KzViewer extends React.Component {
    constructor(props) {
        super(props);
        this.mapView = React.createRef();
    }

    componentDidMount() {
        this.viewer = new ReplayViewer(this.mapView.current);

        this.viewer.cameraMode = CameraMode.Fixed;
        this.viewer.mapBaseUrl = config.mapBaseUrl;

        this.viewer.isPlaying = true;
        this.viewer.showDebugPanel = true;

        this.viewer.loadReplay('https://devruto.com/api/replay?map=kz_reach_v2&mode=1&course=0');
        this.viewer.animate();
    }

    render() {
        return <div ref={this.mapView} />
    }
}

export default KzViewer;