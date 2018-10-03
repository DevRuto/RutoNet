import { GlobalMode } from './ReplayFile';
import { Vector3, Vector2 } from "./Facepunch/Math";

export class Utils {

    static modeToModeName(mode: GlobalMode): String {
        switch (mode) {
            case GlobalMode.Vanilla: { return "Vanilla" };
            case GlobalMode.KzTimer: { return "KZTimer" };
            case GlobalMode.KzSimple: { return "SimpleKZ" };
            default: return "Unknown";
        }
    }

    static formatCourse(course: number): String {
        if (course <= 0) {
            return "Main Course";
        } else {
            return "Bonus " + course;
        }
    }

    static formatRecordTime(time: number): String {

        const recordTime = (time.toFixed(2)).toString().split(".");

        const timeFormat: Date = new Date();
        timeFormat.setHours(0, 0, parseInt(recordTime[0]), parseInt(recordTime[1]));

        const hoursDisplay = ("00" + timeFormat.getHours()).slice(-2);
        const minutesDisplay = ("00" + timeFormat.getMinutes()).slice(-2);
        const secondsDisplay = ("00" + timeFormat.getSeconds()).slice(-2);
        const milliSecondsDisplay = ("00" + timeFormat.getMilliseconds()).slice(-2);

        return `${hoursDisplay}:${minutesDisplay}:${secondsDisplay}:${milliSecondsDisplay}`;
    }

    static deltaAngle(a: number, b: number): number {
        return (b - a) - Math.floor((b - a + 180) / 360) * 360;
    }

    static hermiteValue(p0: number, p1: number, p2: number, p3: number, t: number): number {
        const m0 = (p2 - p0) * 0.5;
        const m1 = (p3 - p1) * 0.5;

        const t2 = t * t;
        const t3 = t * t * t;

        return (2 * t3 - 3 * t2 + 1) * p1 + (t3 - 2 * t2 + t) * m0
            + (-2 * t3 + 3 * t2) * p2 + (t3 - t2) * m1;
    }

    static hermitePosition(p0: Vector3, p1: Vector3,
        p2: Vector3, p3: Vector3, t: number, out: Vector3) {
        out.x = Utils.hermiteValue(p0.x, p1.x, p2.x, p3.x, t);
        out.y = Utils.hermiteValue(p0.y, p1.y, p2.y, p3.y, t);
        out.z = Utils.hermiteValue(p0.z, p1.z, p2.z, p3.z, t);
    }

    static hermiteAngles(a0: Vector2, a1: Vector2,
        a2: Vector2, a3: Vector2, t: number, out: Vector2) {
        out.x = Utils.hermiteValue(
            a1.x + Utils.deltaAngle(a1.x, a0.x),
            a1.x,
            a1.x + Utils.deltaAngle(a1.x, a2.x),
            a1.x + Utils.deltaAngle(a1.x, a3.x), t);
        out.y = Utils.hermiteValue(
            a1.y + Utils.deltaAngle(a1.y, a0.y),
            a1.y,
            a1.y + Utils.deltaAngle(a1.y, a2.y),
            a1.y + Utils.deltaAngle(a1.y, a3.y), t);
    }

    static escapeString(str: String): String {
      return str.toString().replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
        return '&#'+i.charCodeAt(0)+';';
      })
    }
}
