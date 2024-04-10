const express = require("express");
const cors = require("cors");

const mainRouter = require(`./routes`);



app.use(cors());
app.use(express.json()); // Middleware para parsear


app.use("/api/v1", mainRouter);

const app = express();

app.listen(3000);