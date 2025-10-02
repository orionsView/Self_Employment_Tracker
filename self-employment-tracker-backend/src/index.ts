import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from "openai";
import { Tiktoken } from "js-tiktoken/lite";

dotenv.config();

console.log("Cold start at", new Date().toISOString());

const app = express();
const PORT = 3000;

app.use(cors({
    origin: [
        'https://self-employment-tracker-frontend.netlify.app',
        'http://localhost:5173',
        'https://self-employment-tracker-backend-l9ew7c8y7.vercel.app'
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));

// Middleware to parse JSON
app.use(express.json());

// Example route
app.get('/', (req: Request, res: Response) => {
    console.log("base route hit");
    console.log("Current time:", new Date().toISOString());
    res.json({ 
        message: 'Hello i!',
        timestamp: new Date().toISOString(),
        coldStart: 'Should have logged if module initialized'
    });
});

// Example POST route
app.post('/api/data', (req: Request, res: Response) => {
    console.log(req.body);
    res.json({ message: 'Data received', data: req.body });
});

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

app.get("/distance", async (req, res) => {
    // console.log("test");
    const start = req.query.start;
    const end = req.query.end;

    const { GOOGLE_MAPS_API_KEY: apiKey } = process.env;



    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(start as string)}&destination=${encodeURIComponent(end as string)}&key=${apiKey}`;
    console.log(`fetching' ${url}`);

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch distance." });
    }
});


app.get("/shortlinkToLonglink", async (req, res) => {
    const shortLinkRaw = req.query.shortLink;
    console.log(`shortLinkRaw: ${shortLinkRaw}`);

    const response = await fetch(shortLinkRaw as string, {
        method: "GET",
        redirect: "manual",
    });
    console.log(`response' ${response}`);

    const longUrl = response.headers.get("Location");
    console.log(`longUrl: ${longUrl}`);
    // console.log("Redirected to:", location);

    res.json({ longUrl });
});



// AI RECOMMENDATIONS



// import { Tiktoken } from "js-tiktoken/lite";
// import OpenAI from "openai";

let enc: Tiktoken | null = null;
let o200k_base: any = null;

app.post("/getRecommendations", async (req, res) => {
    try {
        // ✅ Lazy load tokenizer only once
        if (!enc) {
            console.log("Loading tokenizer...");
            const result = await fetch("https://tiktoken.pages.dev/js/o200k_base.json");
            o200k_base = await result.json();
            enc = new Tiktoken(o200k_base);
        }

        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const { data, suggestionType } = req.body;

        const prompt = `Give the user the following analysis: ${suggestionType}. 
    Provide a 2 sentence analysis based on this data set: ${JSON.stringify(data)}`;

        // ✅ Safe because enc is guaranteed initialized
        const numTokens = enc.encode(prompt).length;

        console.log(`Prompt: ${prompt}`);
        console.log(`Number of tokens: ${numTokens}`);

        const response = await client.responses.create({
            model: "gpt-5-mini",
            input: prompt,
        });

        const numTokensResponse = enc.encode(response.output_text).length;

        console.log(`Response: ${response.output_text}`);
        console.log(`Number of tokens: ${numTokensResponse}`);

        res.json({ output: response.output_text });
    } catch (err) {
        console.error("Error in /getRecommendations:", err);
        res.status(500).json({ error: "Failed to get recommendations" });
    }
});



// Export for Vercel serverless deployment
export default app;
