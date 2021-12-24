const express = require('express');
const scholar = require("./api/scholar");
const database = require("./api/database");
const app = express();

const cors = require('cors');

app.use(express.urlencoded({extended : false}));
app.use(cors());
app.use(express.json({ extended: false }));
const PORT = process.env.PORT || 5000;


app.use("/api/scholar", scholar);
app.use("/api/database" , database );


app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));

