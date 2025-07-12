export const DECIMAL_PLACES = 2;

// export function toFixedNumber(num: number, digits: number = DECIMAL_PLACES, base: number = 10) {
//     const pow = Math.pow(base, digits);
//     return Math.round(num * pow) / pow;
// }

// convert ms to seconds in a string, formatted to always display digits decimal places.
export function msToSecF(ms: number, digits: number = DECIMAL_PLACES): string {
    return (ms / 1000).toFixed(digits)
    
    // let digit = ms / 1000
    // let decimal = ms % 1000
    // let str_decimal = "";
    // if (decimal) {
    //     str_decimal = String(decimal).slice(0, digits);
    // }
    // else {
    //     str_decimal = "00";
    // }
    // return `${digit}.${str_decimal}`
}