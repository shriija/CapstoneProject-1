import exp from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import { userRoute } from "./APIs/UserAPI.js";
import cookieParser from "cookie-parser";
import { adminRoute } from "./APIs/AdminAPI.js";
import { authorRoute } from "./APIs/AuthorAPI.js";
import { commonRouter } from "./APIs/CommonAPI.js";

config(); //process.env (loads environment variables)

//create express application
const app = exp();

//add body parser middleware
app.use(exp.json()); //exp.json() → returns a middleware function

//add cookie parser middleware
app.use(cookieParser()); //parses cookies from request headers

//connect APIs (route-level middleware)
app.use("/user-api", userRoute);
app.use("/author-api", authorRoute);
app.use("/admin-api", adminRoute);
app.use("/common-api",commonRouter);

//connect to DB
const connectDB = async () => {
  try {
    await connect(process.env.DB_URL); //connect mongoose to MongoDB
    console.log("DB connection success");

    //start http server only after DB connects
    app.listen(
      process.env.PORT,
      () => console.log(`server started on port ${process.env.PORT}`)
    );
  } catch (err) {
    console.log("Err in DB connection", err);
  } //function expression (not declaration)
};

connectDB();

//invalid path handler (runs if no route matches)
app.use((req, res, next) => {
  res.json({ message: `${req.url} is Invalid path` });
});

//error handling middleware
app.use((err, req, res, next) => {
  //if we include `next`, express treats this as error middleware
  const status = err.status || err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  let message = err.message || "Unexpected error";
  let details;

  //mongoose validation errors
  if (err.name === "ValidationError") {
    message = "Validation error";
    details = Object.values(err.errors || {}).map(e => e.message);
  }

  //mongoose cast errors (invalid ObjectId)
  if (err.name === "CastError") {
    message = "Invalid value for field";
    details = [`${err.path} is invalid`];
  }

  //duplicate key error
  if (err.code === 11000) {
    message = "Duplicate value";
    const fields = Object.keys(err.keyValue || {});
    details = fields.length
      ? fields.map(f => `${f} already exists`)
      : undefined;
  }

  //strict mode errors (extra fields not allowed)
  if (err.name === "StrictModeError") {
    message = "Invalid fields provided";
    details = err.path ? [`${err.path} is not allowed`] : undefined;
  }

  //convert known errors to 400 instead of 500
  const finalStatus =
    status === 500 && (err.name || err.code) ? 400 : status;

  const response = {
    message,
    status: finalStatus
  };

  //send extra info only in development
  if (details) response.details = details;
  if (!isProduction) response.stack = err.stack;

  console.log("err :", err);
  res.status(finalStatus).json(response);
});
