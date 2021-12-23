const express = require('express');
const product = require("./api/product");
const app = express();

const cors = require('cors');

app.use(express.urlencoded({extended : false}));
app.use(cors());
app.use(express.json({ extended: false }));
const PORT = process.env.PORT || 5000;


app.use("/api/product", product);


app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));

