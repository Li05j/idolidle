export function toFixedNumber(num: number, digits: number, base: number = 10){
    const pow = Math.pow(base ?? 10, digits);
    return Math.round(num*pow) / pow;
}