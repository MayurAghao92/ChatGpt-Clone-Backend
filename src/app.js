import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import chatRoutes from './routes/chat.routes.js';
import cors from 'cors';
import path from 'path';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.get('*name', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

export default app;