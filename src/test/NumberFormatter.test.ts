import { it, expect } from "vitest";
import { NumberFormatter } from "../domain/NumberFormatter";

// =========================
// 通常表示
// =========================

it("整数を表示できる", () => {
    const formatter = new NumberFormatter();

    expect(
        formatter.formatForDisplay(1)
    ).toBe("1");
});

it("小数を表示できる", () => {
    const formatter = new NumberFormatter();

    expect(
        formatter.formatForDisplay(0.3)
    ).toBe("0.3");
});


// =========================
// 桁数制限
// =========================

it("8桁以内は通常表示になる", () => {
    const formatter = new NumberFormatter();

    expect(
        formatter.formatForDisplay(12345678)
        
    ).toBe("12345678");
});

it("9桁以上は指数表記になる", () => {
    const formatter = new NumberFormatter();

    expect(
        formatter.formatForDisplay(123456789)
    ).toBe("1.2345679e+8");
});

// =========================
// エラー表示
// =========================

it("無限大はエラー表示になる", () => {
    const formatter = new NumberFormatter();

    expect(
        formatter.formatForDisplay(Infinity)
    ).toBe("エラー");
});