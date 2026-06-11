import { it, expect } from "vitest";
import { Evaluator } from "../domain/Evaluator";
import { Operation } from "../types/Operation";
import { DivisionByZeroError } from "../errors/DivisionByZeroError";


//加算
it("1 + 2 = 3", () => {
    const evaluator = new Evaluator();

    expect(
        evaluator.compute(1, Operation.Add, 2)
    ).toBe(3);
});

//減算
it("10-4 = 6",() => {
    const evaluator = new Evaluator();
    
    expect(
        evaluator.compute(10,Operation.Subtract,4)
    ).toBe(6);
});

//乗算
it("3 * 12",() => {
    const evaluator = new Evaluator();

    expect(
        evaluator.compute(3,Operation.Multiply,12)
    ).toBe(36);
});

//除算
it("12 / 4 = 3",() => {
    const evaluator = new Evaluator();

    expect(
        evaluator.compute(12,Operation.Divide,4)
    ).toBe(3);
});


//0除算エラー
it("0除算で例外を投げる",() => {
    const evaluator = new Evaluator();

    expect(() =>
        evaluator.compute(1,Operation.Divide,0)
    ).toThrow(DivisionByZeroError);
});
