function convertBaseToDecimal(inputStr, baseFrom) {
    const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";
    const inputAlphabet = alphabet.slice(0, baseFrom).split("");

    const decimalValue = inputStr.split("").reverse().reduce((acc, char, index) => {
            const digitValue = inputAlphabet.indexOf(char);
            if (digitValue !== -1) {
                acc += digitValue * Math.pow(baseFrom, index);
            }
            return acc;
        }, 0);

    return decimalValue;
}

function decode(obfuscatedStr, alphabet, offset, base) {
    let result = "";
    for (let i = 0; i < obfuscatedStr.length; i++) {
        let encodedChunk = "";

        while (obfuscatedStr[i] !== alphabet[base]) {
            encodedChunk += obfuscatedStr[i];
            i++;
        }

        for (let j = 0; j < alphabet.length; j++) {
            const regex = new RegExp(alphabet[j], "g");
            encodedChunk = encodedChunk.replace(regex, j);
        }

        const charCode = convertBaseToDecimal(encodedChunk, base) - offset;
        result += String.fromCharCode(charCode);
    }

    return result;
}

console.log(decode("npJuJeguJeDuJnJuJeguJeBunptuneDuJeBuJegunpguppupnunBpunptuJeBuJeBuJeguneBugpunDguJeguJnnuJeBunpBupeupnuneeu", "enJBtDgpu", 23, 8));
// Output: console.log("Hello, World!")