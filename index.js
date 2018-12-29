import express from "express";
import dotenv from "dotenv";
import http from "http";
import routes from "./routes";
import path from "path";
import flash from "connect-flash";
dotenv.config();
const app = express();
app.use(routes);
app.use(flash());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 3000;
http.createServer(app).listen(port, () => {
  console.info(`Server running on port ${port}`);
});
