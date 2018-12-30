import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import dotenv from "dotenv";
import http from "http";
import routes from "./routes";
import path from "path";
import flash from "connect-flash";
dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(
  session({
    secret: "2341",
    key: "12",
    resave: false,
    saveUninitialized: false
  })
);
app.use((req, res, next) => {
  res.locals.flashes = req.flash();
  next();
});
app.use(routes);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 3000;
http.createServer(app).listen(port, () => {
  console.info(`Server running on port ${port}`);
});
