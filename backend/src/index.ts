import express from 'express';
import cors from 'cors';
import { PrismaClient } from "@prisma/client";
import userRouter from './routehandler/router';
export const prisma = new PrismaClient();

const app = express();
app.use(cors());

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("hi there from tablesprint")
})

app.use('/',userRouter);

  
async function startServer() {
    try {
        await prisma.$connect();
        console.log('Connected to the database');

        app.listen(3000, () => {
            console.log('Backend running on Port 3000');
        });
    } catch (error) {
        console.error('Failed to connect to the database', error);
        process.exit(1);
    }
}

startServer(); 