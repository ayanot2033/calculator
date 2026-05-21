import { Config } from "../config/Config";
/**
* InputBuffer
* 電卓の「入力状態」を管理するクラス
* 役割：
* 数字・小数点・符号入力の制御
* 入力桁数制限（最大8桁）
* 不正入力の防止
* 表示用文字列の保持
*/
export class InputBuffer {
    /**
    * 現在の入力値（文字列として保持）
    */
    private value = "";




    /**
    * 数字部分の桁数を取得
    * （小数点・マイナスは除外）
    */
    private digitCount(): number {
        return this.value.replace(/[.\-]/g, "").length;
    }




    /**
    * 数字入力処理
    *
    * - 最大8桁制限
    * - 0の連続入力防止
    * - マイナス直後の0制御
    * - 先頭0の置き換え処理
    */
    pushDigit(d: number): void {


        if (this.digitCount() >= Config.MAX_DIGITS) return;


        // 0単体の連打防止
        if (this.value === "0" && d === 0) {
            return;
        }


        // - のあとに 0 は入力不可
        if (this.value === "-" && d === 0) {
            return;
        }


        // 0 のあと数字なら置き換え
        // ただし 0.xxx は除外
        if (
            this.value === "0" &&
            !this.value.includes(".")
        ) {
            this.value = String(d);
            return;
        }


            this.value += String(d);
    }






    /**
    * 小数点入力
    *
    * - 既に小数点がある場合は無視
    * - 空 or "-" の場合は "0." または "-0." に補正
    */
    pushDecimal(): void {


        if (this.value.includes(".")) return;


        if (this.value === "" || this.value === "-") {
            this.value = this.value === "-" ? "-0." : "0.";
            return;
        }


        this.value += ".";
    }




    /**
    * マイナス入力（符号入力）
    *
    * - 先頭のみ許可
    * - 2回目以降は無視
    
    */
    pushMinus(): void {


        // 既に - のときは何もしない
        if (this.value === "-") {
            return;
        }


        // 初回だけ -
        if (this.value === "") {
            this.value = "-";
        }
    }




    /**
    * クリア（リセット）
    */
    clear(): void {
        this.value = "";
    }




    /**
    * 数値として取得
    *
    * 空文字や "-" の場合は 0 を返す
    */
    toNumber(): number {


        if (
            this.value === "" ||
            this.value === "-"
        ) {
            return 0;
        }


        return Number(this.value);
    }




    /**
    * 入力値を取得（表示用）
    */
    getRawValue(): string {
        return this.value;
    } 




    /**
    * 入力が空かどうか
    */
    isEmpty(): boolean {
        return this.value === "";
    }




    backspace(): void {
        if (this.value.length <= 1) {
            this.value = "";
            return;
        }


        this.value = this.value.slice(0, -1);


        if (this.value === "-" || this.value === "." || this.value === "-.") {
            this.value = "";
        }
    }
}
