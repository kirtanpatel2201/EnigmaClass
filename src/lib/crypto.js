export function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
}

export function modInverse(a, m) {
    a = ((a % m) + m) % m;
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
            return x;
        }
    }
    return null;
}

export function modExp(base, exp, mod) {
    let res = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 === 1) {
            res = (res * base) % mod;
        }
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }
    return res;
}

// ------------------------------------------------
// CAESAR
// ------------------------------------------------
export function caesar(text, shift, decrypt = false) {
    if (decrypt) {
        shift = (26 - (shift % 26)) % 26;
    } else {
        shift = (shift % 26 + 26) % 26;
    }

    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        }
        if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
        return char;
    }).join('');
}

// ------------------------------------------------
// VIGENERE
// ------------------------------------------------
export function vigenere(text, key, decrypt = false) {
    if (!key || key.length === 0) return text;
    
    key = key.toUpperCase().replace(/[^A-Z]/g, '');
    if (key.length === 0) return text;

    let keyIndex = 0;
    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        let shift = key.charCodeAt(keyIndex % key.length) - 65;
        
        if (decrypt) {
            shift = (26 - shift) % 26;
        }

        if (code >= 65 && code <= 90) {
            keyIndex++;
            return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        }
        if (code >= 97 && code <= 122) {
            keyIndex++;
            return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
        return char;
    }).join('');
}

// ------------------------------------------------
// HILL
// ------------------------------------------------
export function getHillDeterminant(matrix) {
    const a = matrix[0][0];
    const b = matrix[0][1];
    const c = matrix[1][0];
    const d = matrix[1][1];
    let det = (a * d - b * c) % 26;
    if (det < 0) det += 26;
    return det;
}

export function isHillKeyValid(matrix) {
    const det = getHillDeterminant(matrix);
    return gcd(det, 26) === 1;
}

export function hill(text, matrix, decrypt = false) {
    const filteredText = text.toUpperCase().replace(/[^A-Z]/g, '');
    let paddedText = filteredText;
    if (paddedText.length % 2 !== 0) {
        paddedText += 'X';
    }

    if (paddedText.length === 0) return '';

    let workingMatrix = [[matrix[0][0], matrix[0][1]], [matrix[1][0], matrix[1][1]]];

    if (decrypt) {
        const det = getHillDeterminant(workingMatrix);
        const invDet = modInverse(det, 26);
        if (invDet === null) {
            throw new Error("Matrix is not invertible mod 26");
        }
        
        const a = workingMatrix[0][0];
        const b = workingMatrix[0][1];
        const c = workingMatrix[1][0];
        const d = workingMatrix[1][1];

        workingMatrix = [
            [
                ((d * invDet) % 26 + 26) % 26,
                (((-b) * invDet) % 26 + 26) % 26
            ],
            [
                (((-c) * invDet) % 26 + 26) % 26,
                (((a * invDet) % 26 + 26) % 26)
            ]
        ];
    }

    let result = '';
    for (let i = 0; i < paddedText.length; i += 2) {
        const x1 = paddedText.charCodeAt(i) - 65;
        const x2 = paddedText.charCodeAt(i + 1) - 65;

        const y1 = (workingMatrix[0][0] * x1 + workingMatrix[0][1] * x2) % 26;
        const y2 = (workingMatrix[1][0] * x1 + workingMatrix[1][1] * x2) % 26;

        result += String.fromCharCode(y1 + 65) + String.fromCharCode(y2 + 65);
    }

    return result;
}

// ------------------------------------------------
// RAIL FENCE
// ------------------------------------------------
export function getRailFencePattern(textLength, railsCount) {
    const pattern = [];
    let rail = 0;
    let directionDown = false;

    for (let i = 0; i < textLength; i++) {
        pattern.push(rail);
        if (rail === 0 || rail === railsCount - 1) {
            directionDown = !directionDown;
        }
        rail += directionDown ? 1 : -1;
    }
    return pattern;
}

export function railFence(text, rails, decrypt = false) {
    if (rails <= 1 || text.length <= 1) return text;

    const pattern = getRailFencePattern(text.length, rails);

    if (!decrypt) {
        const rows = Array.from({ length: rails }, () => []);
        for (let i = 0; i < text.length; i++) {
            rows[pattern[i]].push(text[i]);
        }
        return rows.map(row => row.join('')).join('');
    } else {
        const grid = Array.from({ length: rails }, () => Array(text.length).fill(null));
        
        for (let i = 0; i < text.length; i++) {
            grid[pattern[i]][i] = '*';
        }

        let textIdx = 0;
        for (let r = 0; r < rails; r++) {
            for (let c = 0; c < text.length; c++) {
                if (grid[r][c] === '*' && textIdx < text.length) {
                    grid[r][c] = text[textIdx++];
                }
            }
        }

        let decryptedText = '';
        for (let i = 0; i < text.length; i++) {
            decryptedText += grid[pattern[i]][i];
        }
        return decryptedText;
    }
}

// ------------------------------------------------
// PLAYFAIR
// ------------------------------------------------
export function generatePlayfairGrid(key) {
    const cleanedKey = key.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    const seen = new Set();
    const grid = [];

    for (let char of cleanedKey) {
        if (!seen.has(char)) {
            seen.add(char);
            grid.push(char);
        }
    }

    for (let i = 0; i < 26; i++) {
        const char = String.fromCharCode(65 + i);
        if (char === 'J') continue;
        if (!seen.has(char)) {
            seen.add(char);
            grid.push(char);
        }
    }

    const matrix = [];
    for (let i = 0; i < 25; i += 5) {
        matrix.push(grid.slice(i, i + 5));
    }
    return matrix;
}

export function playfair(text, key, decrypt = false) {
    const matrix = generatePlayfairGrid(key);
    const positions = {};
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            positions[matrix[r][c]] = { r, c };
        }
    }

    let cleanText = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    if (cleanText.length === 0) return '';

    const pairs = [];
    for (let i = 0; i < cleanText.length; ) {
        const char1 = cleanText[i];
        let char2 = '';
        
        if (i + 1 < cleanText.length) {
            char2 = cleanText[i + 1];
            if (char1 === char2) {
                pairs.push([char1, 'X']);
                i += 1;
            } else {
                pairs.push([char1, char2]);
                i += 2;
            }
        } else {
            pairs.push([char1, 'X']);
            i += 1;
        }
    }

    const shift = decrypt ? 4 : 1;

    return pairs.map(([c1, c2]) => {
        const p1 = positions[c1];
        const p2 = positions[c2];

        if (!p1 || !p2) return c1 + c2;

        let newC1, newC2;

        if (p1.r === p2.r) {
            newC1 = matrix[p1.r][(p1.c + shift) % 5];
            newC2 = matrix[p2.r][(p2.c + shift) % 5];
        } else if (p1.c === p2.c) {
            newC1 = matrix[(p1.r + shift) % 5][p1.c];
            newC2 = matrix[(p2.r + shift) % 5][p2.c];
        } else {
            newC1 = matrix[p1.r][p2.c];
            newC2 = matrix[p2.r][p1.c];
        }

        return newC1 + newC2;
    }).join('');
}

// ------------------------------------------------
// ONE TIME PAD
// ------------------------------------------------
export function otp(text, key, decrypt = false) {
    const plainText = text.toUpperCase().replace(/[^A-Z]/g, '');
    const padKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (plainText.length === 0 || padKey.length === 0) return '';
    
    let result = '';
    for (let i = 0; i < plainText.length; i++) {
        const pCode = plainText.charCodeAt(i) - 65;
        const kCode = padKey.charCodeAt(i % padKey.length) - 65; 
        
        let cCode;
        if (decrypt) {
            cCode = (pCode - kCode + 26) % 26;
        } else {
            cCode = (pCode + kCode) % 26;
        }
        result += String.fromCharCode(cCode + 65);
    }
    return result;
}

// ------------------------------------------------
// RSA
// ------------------------------------------------
export function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

export function rsaGenerateKeys(p, q) {
    if (!isPrime(p) || !isPrime(q)) throw new Error("p and q must be prime numbers.");
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    
    let e = 3;
    while (gcd(e, phi) !== 1 && e < phi) {
        e += 2;
    }
    
    const d = modInverse(e, phi);
    return { n, phi, e, d };
}

export function rsaEncrypt(m, e, n) {
    return modExp(m, e, n);
}

export function rsaDecrypt(c, d, n) {
    return modExp(c, d, n);
}

// ------------------------------------------------
// DIFFIE-HELLMAN
// ------------------------------------------------
export function diffieHellmanCalculate(base, secret, prime) {
    return modExp(base, secret, prime);
}
