import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Example route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello i!');
});

// Example POST route
app.post('/api/data', (req: Request, res: Response) => {
    console.log(req.body);
    res.json({ message: 'Data received', data: req.body });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


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