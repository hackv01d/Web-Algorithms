export interface ITitle {
    readonly wrapper: HTMLDivElement,
    readonly letterArray: string[],
    readonly lineBreakIndex?: number,
    readonly styleClass?: string,
    readonly displaySpeed: number,
    readonly isLast: boolean,
}