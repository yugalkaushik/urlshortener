"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
async function connectDB() {
    if (global.mongooseConnection && global.mongooseConnection.conn) {
        return;
    }
    if (!global.mongooseConnection) {
        global.mongooseConnection = { conn: null, promise: null };
    }
    if (!global.mongooseConnection.promise) {
        global.mongooseConnection.promise = mongoose_1.default
            .connect(env_1.ENV.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 30000,
        })
            .then((m) => {
            global.mongooseConnection.conn = mongoose_1.default;
            return mongoose_1.default;
        })
            .catch((err) => {
            console.error("MongoDB connection failed:", err);
            throw err;
        });
    }
    await global.mongooseConnection.promise;
    console.log("MongoDB connected");
}
