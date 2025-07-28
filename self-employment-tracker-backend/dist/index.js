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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cors_1.default)());
// Middleware to parse JSON
app.use(express_1.default.json());
// Example route
app.get('/', (req, res) => {
    res.send('Hello i!');
});
// Example POST route
app.post('/api/data', (req, res) => {
    console.log(req.body);
    res.json({ message: 'Data received', data: req.body });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
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
