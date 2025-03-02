

export function EncryptData(textToBeEncrypt: string, salt: string): string {
    // Convert the text to an array of character codes
    const textChars = textToBeEncrypt.split('').map(char => char.charCodeAt(0));

    // Convert salt to an array of character codes for XOR operation
    const saltChars = salt.split('').map(char => char.charCodeAt(0));

    // Encrypt by XORing each character with the corresponding salt character
    const encryptedChars = textChars.map((char, index) => {
        // Use modulo to ensure we cycle through the salt if text is longer
        const saltIndex = index % saltChars.length;
        return char ^ saltChars[saltIndex];
    });

    // Convert encrypted char codes to hex string for safe storage
    const encryptedHex = encryptedChars.map(code => code.toString(16).padStart(4, '0')).join('');

    return encryptedHex;
}

export function DecryptData(textToBeDecrypt: string, salt: string): string {
    // Convert salt to an array of character codes
    const saltChars = salt.split('').map(char => char.charCodeAt(0));

    // Parse the encrypted hex string back to character codes
    const encryptedChars = [];
    for (let i = 0; i < textToBeDecrypt.length; i += 4) {
        const hexChunk = textToBeDecrypt.substring(i, i + 4);
        encryptedChars.push(parseInt(hexChunk, 16));
    }

    // Decrypt by XORing each character with the corresponding salt character
    const decryptedChars = encryptedChars.map((char, index) => {
        // Use modulo to ensure we cycle through the salt if text is longer
        const saltIndex = index % saltChars.length;
        return char ^ saltChars[saltIndex];
    });

    // Convert decrypted char codes back to a string
    const decryptedText = String.fromCharCode(...decryptedChars);

    return decryptedText;
}

export function GenerateSalt(noOfChar: number): string {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?";
    let salt = "";

    for (let i = 0; i < noOfChar; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        salt += charset[randomIndex];
    }

    return salt;
}
