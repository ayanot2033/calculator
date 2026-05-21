import { Calculator } from "./app/Calculator";
import { DomDisplay } from "./ui/DomDisplay";
import { KeyMapper } from "./ui/KeyMapper";

/**
 * DOM取得
 */
const resultScreen = document.getElementById("result-display");
const historyScreen = document.getElementById("history-display");

if (
  !(resultScreen instanceof HTMLElement) ||
  !(historyScreen instanceof HTMLElement)
) {
  throw new Error("display not found");
}

/**
 * 表示
 */
const display = new DomDisplay(resultScreen, historyScreen);

/**
 * 電卓本体
 */
const calculator = new Calculator(display);

/**
 * キーマッピング
 */
const mapper = new KeyMapper();

/**
 * ボタンイベント登録
 */
document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const el = e.currentTarget as HTMLElement;

    // ① data-key取得
    const key = el.dataset.key;
    if (!key) return;

    // ② KeyToken変換（ここ重要）
    const token = mapper.resolve(el);
    if (!token) return;

    // ③ Calculatorへ渡す
    calculator.handle(token);
  });
});