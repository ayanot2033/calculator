import { describe, it, expect, beforeEach, vi } from "vitest";
import { Calculator } from "../app/Calculator";
import { KeyMapper } from "../ui/KeyMapper";

let calculator: Calculator;
let mapper: KeyMapper;

let display: {
    renderResult: ReturnType<typeof vi.fn>;
    renderHistory: ReturnType<typeof vi.fn>;
    renderError: ReturnType<typeof vi.fn>;
};

const press = (key: string) => {
    const button = {
        dataset: {
            key,
        },
    } as unknown as HTMLElement;

    const token = mapper.resolve(button);

    if (token) {
        calculator.handle(token);
    }
};

beforeEach(() => {
    display = {
        renderResult: vi.fn(),
        renderHistory: vi.fn(),
        renderError: vi.fn(),
    };

    calculator = new Calculator(display as any);
    mapper = new KeyMapper();

    vi.clearAllMocks();
});

describe("Calculator テスト", () => {

    // =========================
    // 基本四則演算
    // =========================

    it("1 + 2 = 3", () => {
        press("1");
        press("+");
        press("2");
        press("=");

        expect(display.renderResult)
            .toHaveBeenLastCalledWith("3");
    });

    it("10 - 4 = 6", () => {
        press("1");
        press("0");
        press("-");
        press("4");
        press("=");

        expect(display.renderResult)
            .toHaveBeenLastCalledWith("6");
    });

    it("3 * 4 = 12", () => {
        press("3");
        press("*");
        press("4");
        press("=");

        expect(display.renderResult)
            .toHaveBeenLastCalledWith("12");
    });

    it("12 / 4 = 3", () => {
        press("1");
        press("2");
        press("/");
        press("4");
        press("=");

        expect(display.renderResult)
            .toHaveBeenLastCalledWith("3");
    });

    // =========================
    // 小数
    // =========================

    it("0.1 + 0.2 = 0.3", () => {
        press("0");
        press(".");
        press("1");
        press("+");
        press("0");
        press(".");
        press("2");
        press("=");

        expect(display.renderResult)
            .toHaveBeenLastCalledWith("0.3");
    });

    it("小数点は1回しか入力できない", () => {
        press("1");
        press(".");
        press(".");
        press("2");

        expect(display.renderResult)
            .toHaveBeenLastCalledWith("1.2");
    });

    it("符号後の小数点は-0.になる", () => {
        press("-");
        press(".");

        expect(display.renderResult)
            .toHaveBeenLastCalledWith("-0.");
    });

    // =========================
    // 負数
    // =========================

    it("負数入力できる", () => {
        press("-");
        press("3");

        expect(display.renderResult)
            .toHaveBeenLastCalledWith("-3");
    });

    // =========================
    // 演算子
    // =========================

    it("途中で演算子を変更できる", () => {
        press("5");
        press("+");
        press("-");
        press("2");
        press("=");

        expect(display.renderResult)
            .toHaveBeenLastCalledWith("3");
    });

    it("演算子連打でも壊れない", () => {
        press("5");
        press("+");
        press("+");
        press("+");
        press("2");
        press("=");

        expect(display.renderResult)
            .toHaveBeenLastCalledWith("7");
    });

    it("演算子直後の=は無効", () => {
        press("5");
        press("+");
        press("=");

        expect(display.renderResult)
            .toHaveBeenLastCalledWith("5");
    });

    it("先頭の+は無効", () => {
        press("+");
        press("3");

        expect(display.renderResult)
            .toHaveBeenLastCalledWith("3");
    });

    // =========================
    // 連続計算
    // =========================

    it("左から順に計算される", () => {
        press("1");
        press("0");
        press("+");
        press("5");
        press("*");
        press("2");
        press("=");

        expect(display.renderResult)
            .toHaveBeenLastCalledWith("30");
    });

    // =========================
    // BackSpace
    // =========================

    it("BackSpaceで1文字削除できる", () => {
        press("1");
        press("2");
        press("3");

        press("Backspace");

        expect(display.renderResult)
            .toHaveBeenLastCalledWith("12");
    });


    it("BackSpaceを連続で押すと最終的に0になる", () => {
    press("1");
    press("+");
    press("2");

    press("Backspace");
    press("Backspace");
    press("Backspace");

    expect(display.renderResult)
        .toHaveBeenLastCalledWith("0");
});


    it("全て削除すると0に戻る", () => {
        press("1");
        press("Backspace");

        expect(display.renderResult)
            .toHaveBeenLastCalledWith("0");
    });

    it("小数入力中も削除できる", () => {
        press("1");
        press(".");
        press("2");

        press("Backspace");

        expect(display.renderResult)
            .toHaveBeenLastCalledWith("1.");
    });

    it("小数点だけ削除できる", () => {
        press("0");
        press(".");

        press("Backspace");

        expect(display.renderResult)
            .toHaveBeenLastCalledWith("0");
    });

    it("演算子直後のBackSpaceで演算子だけ消える", () => {
        press("5");
        press("+");

        press("Backspace");

        expect(display.renderResult)
            .toHaveBeenLastCalledWith("5");
    });

    it("初期状態のBackSpaceは無効（0のまま）", () => {
        press("Backspace");

        expect(display.renderResult)
            .toHaveBeenLastCalledWith("0");
    });

    // =========================
    // エラー
    // =========================

    it("0除算でエラー表示される", () => {
        press("1");
        press("/");
        press("0");
        press("=");

        expect(display.renderError)
            .toHaveBeenCalledWith("エラー");
    });

    it("エラー後に数字入力で復帰できる", () => {
        press("1");
        press("/");
        press("0");
        press("=");
        press("5");

        expect(display.renderResult)
            .toHaveBeenLastCalledWith("5");
    });

    it("エラー後にCでリセットできる", () => {
        press("1");
        press("/");
        press("0");
        press("=");

        press("C");

        expect(display.renderResult)
            .toHaveBeenLastCalledWith("0");
    });

    it("エラー中は小数点入力を無視する", () => {
        press("1");
        press("/");
        press("0");
        press("=");
        
        const before = display.renderResult.mock.calls.length;

        press(".");

        expect(display.renderResult.mock.calls.length).toBe(before);
    });



    it("エラー中は演算子入力を無視する", () => {
        press("1");
        press("/");
        press("0");
        press("=");
        
        const before = display.renderResult.mock.calls.length;

        press("+");

        expect(display.renderResult.mock.calls.length).toBe(before);
    });


    


    it("エラー中のBackSpaceは無効", () => {
        press("1");
        press("/");
        press("0");
        press("=");

        const before = display.renderResult.mock.calls.length;

        press("Backspace");

        expect(display.renderResult.mock.calls.length).toBe(before);
    });

    // =========================
    // Clear
    // =========================

    it("Cで初期化される", () => {
        press("1");
        press("+");
        press("2");

        press("C");

        expect(display.renderResult)
            .toHaveBeenLastCalledWith("0");
    });




    // =========================
    // 境界値
    // =========================

    it("桁超過で指数表記になる", () => {
        press("9");
        press("9");
        press("9");
        press("9");
        press("9");
        press("9");
        press("9");
        press("9");

        press("+");
        press("1");
        press("=");

        expect(display.renderResult)
            .toHaveBeenCalledWith("1.0000000e+8");
    });

    // =========================
    // 更新
    // =========================

    it("履歴が更新される", () => {
        press("5");
        press("+");

        expect(display.renderHistory)
            .toHaveBeenLastCalledWith("5 +");
    });

});