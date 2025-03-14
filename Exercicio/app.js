const express = require("express");

const PORT = 3000;

const app = express();

app.get('/', (req, res) => {
    res.send("olá senai")
});

app.listen(PORT, () => {
    console.log(`servidor sendo execultado na portal 3000 ${PORT}!`);
});