/**
 * DomDisplay
 * 電卓の「画面表示」を担当するクラス
 */

import type { IDisplay } from "../ui/IDisplay";

export class DomDisplay implements IDisplay {
    private resultScreen: HTMLElement;
    private historyScreen: HTMLElement;

    constructor(resultScreen: HTMLElement, historyScreen: HTMLElement) {
        this.resultScreen = resultScreen;
        this.historyScreen = historyScreen;
    }

    // 現在の表示（結果）
    renderResult(text: string): void {
        this.resultScreen.classList.remove("error");
        this.resultScreen.textContent = text;
    }

    // 履歴表示
    renderHistory(text: string): void {
        this.historyScreen.textContent = text;
    }

    // エラー表示（結果エリアに出す）
    renderError(message: string): void {
        this.resultScreen.classList.add("error");
        this.resultScreen.textContent = message;
    }

    
}