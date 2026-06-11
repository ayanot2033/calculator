// ■ Calculator.ts：電卓の司令塔
// 役割：
// - 入力の受付（数字、演算子、イコール、クリアなど）
// - 状態管理（CalcState）
// - 計算処理の呼び出し（Evaluator）
// - 表示処理の指示（IDisplay）
// - 入力文字列の管理（InputBuffer）
// 設計思想：Calculatorは司令塔として各クラスを統括し、自分で計算や表示整形は行わない


//型だけを取り込む
import type { KeyToken } from "../types/KeyToken";
import { Operation } from "../types/Operation";
import type { IDisplay } from "../ui/IDisplay";


//通常 import
import { InputBuffer } from "../domain/InputBuffer";
import { Evaluator } from "../domain/Evaluator";
import { NumberFormatter } from "../domain/NumberFormatter";
import { ERROR_MESSAGE } from "../config/Config";
import { CalcState } from "../state/CalcState";


export class Calculator {
 // ■ 左辺値（計算対象）
 // Calculator外から触れられないようにprivate

  private left: number | null = null;


 // ■ 現在の演算子
 // Calculator外から触れられない

  private operator: Operation | null = null;


 // ■ 現在の状態
 // CalcStateによって入力中・演算子入力済み・エラーなどを管理
  private state: CalcState = CalcState.Ready;


 // ■ 入力管理
 // 数字や小数点などの入力文字列を管理する
  private buffer = new InputBuffer();


 // ■ 計算処理専用
  private evaluator = new Evaluator();


 // ■ 数値表示整形専用
  private formatter = new NumberFormatter();


 // ■ 計算履歴表示
  private history = "";


 // ■ 画面表示の抽象化
  private display: IDisplay;


 // ■ コンストラクタ
  constructor(display: IDisplay) {
   // 画面表示用オブジェクトを受け取る
    this.display = display;
  }


 // ■ 演算子を表示用に整形
  private formatOperator(op: Operation): string {
    const map: Record<Operation, string> = {
      "+": "+",
      "-": "-",
      "*": "×", // UIでは掛け算記号(×)に変換
      "/": "÷", // UIでは割り算記号(÷)に変換
    };
    return map[op];
  }


 // ■ キー入力処理
  handle(key: KeyToken): void {
    try {
     // =========================
     // エラー状態の復帰
     // =========================
      if (this.state === CalcState.Error) {
       // Cキーは全消去
        if (key.kind === "clear") {
          this.handleAllClear();
          return;
        }


       // エラー状態でも負数入力を可能にする
        if (key.kind === "op" && key.value === "-") {
          this.handleAllClear();
          this.buffer.pushMinus();
          this.display.renderResult("-");
          return;
        }


       // エラー状態で数字入力があれば初期化して再入力
        if (key.kind === "digit") {
          this.handleAllClear();
          this.buffer.pushDigit(key.value);
          this.display.renderResult(this.buffer.getRawValue());
          return;
        }


       // エラー状態で小数点入力
        if (key.kind === "decimal") {
          this.handleAllClear();
          this.buffer.pushDecimal();
          this.display.renderResult(this.buffer.getRawValue());
          return;
        }


       // + × ÷ = は無視
        return;
      }


     // =========================
     // 初期状態・負数入力中
     // =========================
      if (this.left === null && (this.buffer.isEmpty() || this.buffer.getRawValue() === "-")) {
        if (key.kind === "equal" || (key.kind === "op" && key.value !== "-")) {
         // 初期状態でイコールや負数以外の演算子は無視
          this.display.renderResult(this.buffer.getRawValue() === "-" ? "-" : "0");
          this.display.renderHistory("");
          return;
        }


       // 負の符号入力
        if (key.kind === "op" && key.value === "-") {
          this.buffer.pushMinus();
          this.display.renderResult("-");
          this.display.renderHistory("");
          return;
        }


       // 小数点入力
        if (key.kind === "decimal") {
          this.buffer.pushDecimal();
          this.display.renderResult(this.buffer.getRawValue());
          this.display.renderHistory("");
          return;
        }
      }


     // =========================
     // 通常入力処理
     // =========================
      switch (key.kind) {
        case "digit":
          this.buffer.pushDigit(key.value);
          this.display.renderResult(this.buffer.getRawValue());
          return;


        case "decimal":
          this.buffer.pushDecimal();
          this.display.renderResult(this.buffer.getRawValue());
          return;


        case "op":
          this.handleOperator(key.value);
          return;


        case "equal":
          this.handleEqual();
          return;


        case "clear":
          this.handleAllClear();
          return;


        case "backspace":
          this.handleBackSpace();
          return;
      }
    } catch (e) {
     // =========================
     // 予期せぬエラー処理
     // =========================
      console.error(e);
      this.state = CalcState.Error;
      this.display.renderError(ERROR_MESSAGE);
    }
  }


 // ■ 演算子入力時の処理
  private handleOperator(op: Operation): void {
   // 演算子連打時は上書き
    if (this.buffer.isEmpty() && this.left !== null) {
      this.operator = op;
      this.history = this.formatter.formatForDisplay(this.left) + " " + this.formatOperator(op);
      this.display.renderHistory(this.history);
      return;
    }


    const current = this.buffer.toNumber();


   // 数値未入力なら無視
    if (this.buffer.isEmpty() || this.buffer.getRawValue() === "-") return;


    if (this.left === null) {
      this.left = current; // 左辺に初期値をセット
    } else if (this.operator) {
     // 左辺と右辺を計算
      this.left = this.evaluator.compute(this.left, this.operator, current);
    }


    this.operator = op;
    this.buffer.clear();
    this.state = CalcState.OperatorEntered;
    this.history = this.formatter.formatForDisplay(this.left) + " " + this.formatOperator(op);
    this.display.renderHistory(this.history);
    this.display.renderResult(this.formatter.formatForDisplay(this.left));
  }


 // ■ イコール（計算実行）
  private handleEqual(): void {
    if (this.left === null || this.operator === null || this.buffer.isEmpty()) return;


    const right = this.buffer.toNumber();


    try {
      const leftValue = this.left;
      const opValue = this.operator;
      const result = this.evaluator.compute(leftValue, opValue, right);


     // 計算履歴を作成
      this.history =
        this.formatter.formatForDisplay(leftValue) +
        " " +
        this.formatOperator(opValue) +
        " " +
        this.buffer.getRawValue() +
        "=";


      this.display.renderHistory(this.history);
      this.display.renderResult(this.formatter.formatForDisplay(result));


      this.left = result; // 計算結果を左辺に保持
      this.operator = null;
      this.buffer.clear();
      this.state = CalcState.ResultShown;
    } catch (e) {
      console.error(e);
      this.state = CalcState.Error;
      if (!this.operator) return;
      this.history =
        this.formatter.formatForDisplay(this.left) +
        " " +
        this.formatOperator(this.operator) +
        " " +
        this.formatter.formatForDisplay(right) +
        "=";
      this.display.renderHistory(this.history);
      this.display.renderError(ERROR_MESSAGE);
    }
  }


 // ■ 全消去（AC）
  private handleAllClear(): void {
    this.handleClear(); // 入力部分をリセット
    this.left = null;
    this.operator = null;
    this.buffer.clear();
    this.history = "";
    this.state = CalcState.Ready;
    this.display.renderHistory("");
  }


 // ■ 入力クリア（C）
  private handleClear(): void {
    this.buffer.clear();
    this.state = CalcState.Ready;
    this.display.renderResult("0");
  }


 // ■ バックスペース（1文字削除）
  private handleBackSpace(): void {
    // エラー中は無効
    if (this.state === CalcState.Error) {
        return;
    }

    // 演算子入力直後 → 演算子を消して左辺に戻す
    if (this.state === CalcState.OperatorEntered) {
        this.operator = null;
        this.state = CalcState.Ready;

        const displayValue =
            this.left !== null ? String(this.left) : "0";

        this.display.renderHistory(displayValue);
        this.display.renderResult(displayValue);
        return;
    }

    // 入力を1文字削除
    this.buffer.backspace();

    const value = this.buffer.getRawValue();

    // ここが重要：空なら必ず "0"
    if (value === "") {
      this.display.renderResult("0");
      return;
    }

    this.display.renderResult(value);
  }
}
