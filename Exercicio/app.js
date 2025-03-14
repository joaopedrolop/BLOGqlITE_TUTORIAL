const express = require("express");

const PORT = 3000;

const app = express();

const index = "<a href='/sobre'>Sobre</a><a href='/info'</a>";

app.get('/', (req, res) => {
    res.send("olá senai");
});

app.get("/sobre", (req, res) => {
    res.send("vc esta na pagina sobre");
});

app.get("/info", (req, res) => {
    res.send("vc esta na pagina info");
});


app.listen(PORT, () => {
    console.log(`servidor sendo execultado na portal 3000 ${PORT}!`);
});