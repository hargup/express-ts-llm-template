import app from "./app";
import compression from "compression";
import helmet from "helmet";
import { config } from 'dotenv';
config();

app.use(helmet()); // set well-known security-related HTTP headers
app.use(compression());
console.log(process.env.PORTKEY_API_KEY)
app.disable("x-powered-by");

const server = app.listen(3000, () =>
    console.log("Starting ExpressJS server on Port 3000"));

export default server;
