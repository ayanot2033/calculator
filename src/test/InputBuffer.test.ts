import { it, expect } from "vitest";
import { InputBuffer } from "../domain/InputBuffer";

// =========================
// 数値入力
// =========================
it("1を入力できる",() => {
    const buffer = new InputBuffer();

    buffer.pushDigit(1);

    expect(buffer.getRawValue()).toBe("1");
});




it("9桁目は入力できない", () => {
    const buffer = new InputBuffer();

    buffer.pushDigit(1);
    buffer.pushDigit(2);
    buffer.pushDigit(3);
    buffer.pushDigit(4);
    buffer.pushDigit(5);
    buffer.pushDigit(6);
    buffer.pushDigit(7);
    buffer.pushDigit(8);
    buffer.pushDigit(9);

    expect(buffer.getRawValue()).toBe("12345678");
});


//0を連続入力できない
it("0を連続入力できない", () => {
    const buffer = new InputBuffer();

    buffer.pushDigit(0);
    buffer.pushDigit(0);

    expect(buffer.getRawValue()).toBe("0");
});

//先頭の0は次の数字で上書きされる
it("先頭の0は次の数字で置き換わる", () => {
    const buffer = new InputBuffer();

    buffer.pushDigit(0);
    buffer.pushDigit(5);

    expect(buffer.getRawValue()).toBe("5");
});


//-直後に0は入力できない
it("マイナス直後に0は入力できない", () => {
    const buffer = new InputBuffer();

    buffer.pushMinus();
    buffer.pushDigit(0);

    expect(buffer.getRawValue()).toBe("-");
});






// =========================
// 小数点入力
// =========================

//空の状態で小数点

it("から状態で小数点を入力すると0.になる",() => {
    const buffer = new InputBuffer();

    buffer.pushDecimal();

    expect(buffer.getRawValue()).toBe("0.");
});


//マイナスの状態で小数点

it("マイナスの状態で小数点を入力すると-0.になる",() => {
    const buffer = new InputBuffer();
    
    buffer.pushMinus();
    buffer.pushDecimal();

    expect(buffer.getRawValue()).toBe("-0.");
});

//数字の後ろに小数点

it("数字の後ろに小数点を追加できる", () => {
    const buffer = new InputBuffer();

    buffer.pushDigit(1);
    buffer.pushDecimal();

    expect(buffer.getRawValue()).toBe("1.");
});


//小数点は２回入力できない

it("小数点は2回入力できない", () => {
    const buffer = new InputBuffer();

    buffer.pushDigit(1);
    buffer.pushDecimal();
    buffer.pushDecimal();

    expect(buffer.getRawValue()).toBe("1.");
});




// =========================
// clear
// =========================

it("clearで空になる", () => {
    const buffer = new InputBuffer();

    buffer.pushDigit(1);
    buffer.clear();

    expect(buffer.isEmpty()).toBe(true);
});




// =========================
// toNumber
// =========================
it("文字列を数値に変換できる", () => {
    const buffer = new InputBuffer();

    buffer.pushDigit(1);
    buffer.pushDigit(2);

    expect(buffer.toNumber()).toBe(12);
});

it("空文字は0になる", () => {
    const buffer = new InputBuffer();

    expect(buffer.toNumber()).toBe(0);
});


// =========================
// isEmpty
// =========================

it("初期状態は空", () => {
    const buffer = new InputBuffer();

    expect(buffer.isEmpty()).toBe(true);
});
it("入力後は空ではない", () => {
    const buffer = new InputBuffer();

    buffer.pushDigit(1);

    expect(buffer.isEmpty()).toBe(false);
});




// =========================
// backspace
// =========================

it("123から1文字削除すると12になる", () => {
    const buffer = new InputBuffer();

    buffer.pushDigit(1);
    buffer.pushDigit(2);
    buffer.pushDigit(3);

    buffer.backspace();

    expect(buffer.getRawValue()).toBe("12");
});