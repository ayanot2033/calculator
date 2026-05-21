import { Operation } from "../types/Operation";
import { DivisionByZeroError } from "../errors/DivisionByZeroError";

export class Evaluator {
    compute(a: number, op: Operation, b: number): number {
        switch (op) {
            case Operation.Add:
                return a + b;

            case Operation.Subtract:
                return a - b;

            case Operation.Multiply:
                return a * b;

            case Operation.Divide:
                if (b === 0) {
                    throw new DivisionByZeroError("0では割れません");
                }
                return a / b;

        }
    }
}