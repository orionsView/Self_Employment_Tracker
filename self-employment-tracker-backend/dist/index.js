"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const openai_1 = __importDefault(require("openai"));
const lite_1 = require("js-tiktoken/lite");
dotenv_1.default.config();
console.log("Cold start at", new Date().toISOString());
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cors_1.default)({
    origin: [
        'https://self-employment-tracker-frontend.netlify.app',
        'http://localhost:5173',
        'https://self-employment-tracker-backend-l9ew7c8y7.vercel.app'
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));
// Middleware to parse JSON
app.use(express_1.default.json());
// Example route
app.get('/', (req, res) => {
    console.log("base route hit");
    console.log("Current time:", new Date().toISOString());
    res.json({
        message: 'Hello i!',
        timestamp: new Date().toISOString(),
        coldStart: 'Should have logged if module initialized'
    });
});
// Example POST route
app.post('/api/data', (req, res) => {
    console.log(req.body);
    res.json({ message: 'Data received', data: req.body });
});
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
app.get("/distance", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("test");
    const start = req.query.start;
    const end = req.query.end;
    const { GOOGLE_MAPS_API_KEY: apiKey } = process.env;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(end)}&key=${apiKey}`;
    console.log(`fetching' ${url}`);
    try {
        const response = yield fetch(url);
        const data = yield response.json();
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch distance." });
    }
}));
app.get("/shortlinkToLonglink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const shortLinkRaw = req.query.shortLink;
    console.log(`shortLinkRaw: ${shortLinkRaw}`);
    const response = yield fetch(shortLinkRaw, {
        method: "GET",
        redirect: "manual",
    });
    console.log(`response' ${response}`);
    const longUrl = response.headers.get("Location");
    console.log(`longUrl: ${longUrl}`);
    // console.log("Redirected to:", location);
    res.json({ longUrl });
}));
// AI RECOMMENDATIONS
// import { Tiktoken } from "js-tiktoken/lite";
// import OpenAI from "openai";
let enc = null;
let o200k_base = null;
app.post("/getRecommendations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // ✅ Lazy load tokenizer only once
        if (!enc) {
            console.log("Loading tokenizer...");
            const result = yield fetch("https://tiktoken.pages.dev/js/o200k_base.json");
            o200k_base = yield result.json();
            enc = new lite_1.Tiktoken(o200k_base);
        }
        const client = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const { data, suggestionType } = req.body;
        const prompt = `Give the user the following analysis: ${suggestionType}. 
    Provide a 2 sentence analysis based on this data set: ${JSON.stringify(data)}`;
        // ✅ Safe because enc is guaranteed initialized
        const numTokens = enc.encode(prompt).length;
        console.log(`Prompt: ${prompt}`);
        console.log(`Number of tokens: ${numTokens}`);
        const response = yield client.responses.create({
            model: "gpt-5-mini",
            input: prompt,
        });
        const numTokensResponse = enc.encode(response.output_text).length;
        console.log(`Response: ${response.output_text}`);
        console.log(`Number of tokens: ${numTokensResponse}`);
        res.json({ output: response.output_text });
    }
    catch (err) {
        console.error("Error in /getRecommendations:", err);
        res.status(500).json({ error: "Failed to get recommendations" });
    }
}));
// Export for serverless deployment
const serverless_http_1 = __importDefault(require("serverless-http"));
// Wrap the handler with debugging
const wrappedApp = (0, serverless_http_1.default)(app);
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Handler invoked!", new Date().toISOString());
    console.log("Request method:", event.httpMethod);
    console.log("Request path:", event.path);
    try {
        const result = yield wrappedApp(event, context);
        console.log("Handler result:", result.statusCode);
        return result;
    }
    catch (error) {
        console.error("Handler error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error" })
        };
    }
});
exports.handler = handler;
exports.default = exports.handler;
