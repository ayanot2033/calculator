import { MAX_DIGITS } from "../config/Config";

export class NumberFormatter {
    private maxDigits: number = MAX_DIGITS;

    formatForDisplay(n: number): string {
        if (!isFinite(n)) {
            return "エラー";
        }

        const rounded =
            Math.round(n * 100000000) / 100000000;

        let str = String(rounded);

        if (str.includes(".")) {
            str = str.replace(/\.?0+$/, "");
        }

        const digitCount =
            str.replace(/[.\-]/g, "").length;

        if (digitCount > this.maxDigits) {
            return rounded.toExponential(7);
        }

        return str;
    }
}