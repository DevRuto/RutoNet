import { Box3, Quaternion, Vector3, Vector4 } from '../Math';
import { Camera, OrthographicCamera, PerspectiveCamera } from './Camera';
import { Game } from './Game';

export class ShadowCamera extends OrthographicCamera {
    readonly game: Game;

    private readonly targetCamera: Camera;

    constructor(game: Game, targetCamera: Camera) {
        super(game, 1, 1, 0, 1);

        this.game = game;
        this.targetCamera = targetCamera;
    }

    private addToFrustumBounds(vec: Vector4, bounds: Box3): void {
        vec.applyMatrix4(this.targetCamera.getMatrix());
        vec.applyMatrix4(this.getInverseMatrix());

        bounds.addPoint(vec);
    }

    private static readonly getFrustumBounds_vec = new Vector4();
    private getFrustumBounds(near: number, far: number, bounds: Box3): void {
        bounds.min.set(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
        bounds.max.set(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);

        const perspCamera = this.targetCamera as PerspectiveCamera;
        if (perspCamera.getFov === undefined) {
            throw "Not implement for non-perspective cameras";
        }

        const yScale = Math.tan(perspCamera.getFov() * 0.5);
        const xScale = yScale * perspCamera.getAspect();

        const xNear = xScale * near;
        const yNear = yScale * near;

        const xFar = xScale * far;
        const yFar = yScale * far;

        const vec = ShadowCamera.getFrustumBounds_vec;

        this.addToFrustumBounds(vec.set( xNear,  yNear, near, 1), bounds);
        this.addToFrustumBounds(vec.set(-xNear,  yNear, near, 1), bounds);
        this.addToFrustumBounds(vec.set( xNear, -yNear, near, 1), bounds);
        this.addToFrustumBounds(vec.set(-xNear, -yNear, near, 1), bounds);

        this.addToFrustumBounds(vec.set( xFar,  yFar, far, 1), bounds);
        this.addToFrustumBounds(vec.set(-xFar,  yFar, far, 1), bounds);
        this.addToFrustumBounds(vec.set( xFar, -yFar, far, 1), bounds);
        this.addToFrustumBounds(vec.set(-xFar, -yFar, far, 1), bounds);
    }

    private static readonly renderShadows_bounds = new Box3();
    private static readonly renderShadows_vec1 = new Vector3();
    private static readonly renderShadows_vec2 = new Vector3();
    bufferCascadeBegin(lightRotation: Quaternion, near: number, far: number): void {
        const bounds = ShadowCamera.renderShadows_bounds;
        const vec1 = ShadowCamera.renderShadows_vec1;
        const vec2 = ShadowCamera.renderShadows_vec2;

        vec1.set(0, 0, 1);
        this.targetCamera.applyRotationTo(vec1);
        vec1.multiplyScalar((near + far) * 0.5);

        this.targetCamera.getPosition(vec2);

        vec1.add(vec2);

        this.setRotation(lightRotation);
        this.setPosition(vec1);
        
        this.getFrustumBounds(near, far, bounds);

        const xDiff = bounds.max.x - bounds.min.x;
        const yDiff = bounds.max.y - bounds.min.y;
        const zDiff = bounds.max.z - bounds.min.z;

        // TODO: Reposition based on bounds
        this.setSize(zDiff);
        this.setAspect(xDiff / zDiff);
    }

    bufferCascadeEnd(): void {
        
    }
}
