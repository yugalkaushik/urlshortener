"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateShortCode = generateShortCode;
const nanoid_1 = require("nanoid");
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = (0, nanoid_1.customAlphabet)(alphabet, 7);
function generateShortCode() {
    return nanoid();
}
