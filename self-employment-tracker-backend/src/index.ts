import express, { Request, Response } from 'express';
const app = express();
const PORT = 3000;

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
