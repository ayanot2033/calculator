import type { KeyToken } from "../types/KeyToken";
import  { Operation } from "../types/Operation";


/**
* KeyMapper
* キー入力を KeyToken に変換するクラス
*/
export class KeyMapper {


 // keyMap: クラス図通り
    private keyMap: Map<string, KeyToken> = new Map([
        ["+", { kind: "op", value: Operation.Add }],
        ["-", { kind: "op", value: Operation.Subtract }],
        ["*", { kind: "op", value: Operation.Multiply }],
        ["/", { kind: "op", value: Operation.Divide  }],
        ["=", { kind: "equal" }],
        ["C", { kind: "clear" }],
        [".", { kind: "decimal" }],
        ["Backspace", { kind: "backspace" }],
    ]);


   // クラス図: resolve(target: EventTarget)
    resolve(target: EventTarget): KeyToken | null {


        const el = target as HTMLElement;


       // data-key を使う想定（HTMLボタン側）
        const key = el.dataset.key;


        if (!key) return null;


       // 数字判定
        if (/^\d$/.test(key)) {
            return {
                kind: "digit",
                value: Number(key),
            };
        }


       // Mapから取得
        return this.keyMap.get(key) ?? null;
    }
}
