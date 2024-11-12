import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import chatRoutes from "./routes/chatRoutes";
import * as mongoose from "mongoose";
import http from "http";
import WebSocket from "ws";
import {handleWebSocketConnection} from "./services/wsService";

dotenv.config();

const app = express();
const server = http.createServer(app)
const wss = new WebSocket.Server({server});
const port = process.env.PORT || 5000;
import cors from 'cors';

app.use(cors());
app.use('/api/chat', chatRoutes)

wss.on('connection', handleWebSocketConnection)

// database connect
async function main() {
    try {
        await mongoose.connect(
            "mongodb://127.0.0.1:27017/santa"
        );
        console.log("database connection successfully");
        server.listen(port, () => {
            console.log(`server listening on port ${port}`);
        });
    } catch (error) {
        console.log(`failed to connect database ${error}`);
    }
}

main();