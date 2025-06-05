const fs = require("fs");
const file = "obfuscated.js";

/*
    var _0xc5e = ["", "split", "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/", "slice", "indexOf", "", "", ".", "pow", "reduce", "reverse", "0"];

    function _0xe52c(d, e, f) {
        var g = _0xc5e[2][_0xc5e[1]](_0xc5e[0]);
        var h = g[_0xc5e[3]](0, e);
        var i = g[_0xc5e[3]](0, f);
        var j = d[_0xc5e[1]](_0xc5e[0])[_0xc5e[10]]()[_0xc5e[9]](function (a, b, c) {
            if (h[_0xc5e[4]](b) !== -1) return a += h[_0xc5e[4]](b) * (Math[_0xc5e[8]](e, c));
        }, 0);
        var k = _0xc5e[0];
        while (j > 0) { // I removed it because it was useless. All the samples I had were in decimal directly :3
            k = i[j % f] + k;
            j = (j - (j % f)) / f;
        }
        return k || _0xc5e[11];
    }
*/
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

/*
    (function (h, u, n, t, e, r) {
        r = "";
        for (var i = 0, len = h.length; i < len; i++) {
            var s = "";
            while (h[i] !== n[e]) {
                s += h[i];
                i++;
            }
            for (var j = 0; j < n.length; j++) s = s.replace(new RegExp(n[j], "g"), j);
            r += String.fromCharCode(_0xe52c(s, e, 10) - t);
        }
        return decodeURIComponent(escape(r));
    }("npJuJeguJeDuJnJuJeguJeBunptuneDuJeBuJegunpguppupnunBpunptuJeBuJeBuJeguneBugpunDguJeguJnnuJeBunpBupeupnuneeu", 55, "enJBtDgpu", 23, 8, 20));
*/
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

// console.log(decode("npJuJeguJeDuJnJuJeguJeBunptuneDuJeBuJegunpguppupnunBpunptuJeBuJeBuJeguneBugpunDguJeguJnnuJeBunpBupeupnuneeu", "enJBtDgpu", 23, 8));
// Output: console.log("Hello, World!")

fs.readFile(file, "utf8", (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }

    /* A simple regular expression to retrieve the values ​​as parameters of the decoding function */
    var parameters = data.match(/\s*"[0-9A-Z+/]+"\s*,\s*[0-9]+\s*,\s*"[0-9A-Z+/]+"\s*,\s*[0-9]+\s*,\s*[0-9]+\s*,\s*[0-9]+\s*/i);

    if (!parameters) {
        console.error("No parameters found in the file.");
        return;
    }

    // console.log(parameters[0])
    // Output: "npJuJeguJeDuJnJuJeguJeBunptuneDuJeBuJegunpguppupnunBpunptuJeBuJeBuJeguneBugpunDguJeguJnnuJeBunpBupeupnuneeu",55,"enJBtDgpu",23,8,20

    parameters = parameters[0].split(/\s*,\s*/);

    // wtf i tried GitHub Copilot and it immediately wrote this block,
    // skipping the dead parameters like [1] and [5] and picking only the useful ones.
    // Honestly, I didn’t expect that to work.
    obfuscatedStr = parameters[0].replace(/"/g, ""); // Remove quotes
    const alphabet = parameters[2].replace(/"/g, ""); // Remove quotes
    const offset = parseInt(parameters[3], 10);
    const base = parseInt(parameters[4], 10);

    // console.log(decode(obfuscatedStr, alphabet, offset, base));
    // Output: console.log("Hello, World!")

    console.log(decode(obfuscatedStr, alphabet, offset, base));

})