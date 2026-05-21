/**
 * IDisplay（表示層インターフェース）
*/
export interface IDisplay {
    renderResult(text: string): void;
    renderHistory(text: string): void;
    renderError(message: string): void;
}