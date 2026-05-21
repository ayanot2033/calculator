import  { Operation } from "../types/Operation";

// ボタン入力 → 意味あるトークンへ変換
export type KeyToken =
    | { kind: "digit"; value: number }
    | { kind: "decimal" }
    | { kind: "op"; value: Operation }
    | { kind: "equal" }
    | { kind: "clear" }
    | { kind: "backspace" };