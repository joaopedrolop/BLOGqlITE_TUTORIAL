const express = require("express");
const sqlite3 = require("sqlite3");
const bodyParse =require("body-parse");

const PORT = 3000;

const app = express();

const db = new sqlite3.Database("user.db");

db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS users (id  INTEGER PRIMARY KEY AUTOINCREMENT, 
        username text, password TEXT, email TEXT, celular TEXT, cpf TEXT, rg TEXT)`
    );
});

app.use("/static", express.static(__dirname + "/static"));

app.use(bodyParse.urlencoded({extended: true}));

app.set("view engine", "ejs");

const index = "<a href='/sobre'>sobre</a> <br> <a href='/login' >login</a> <br> <a href='/cadastro'>cadastro</a> <br> <a href='/home'>home</a> <br> <a href='/dashboard'>dashboard</a> <br> <a href='/descricao'>descricao</a>";
const sobre = 'Vc esta na pagina "sobre" <br> <a href="/">Voltar</a>';
const login = 'Vc esta na pagina "login" <br> <a href="/">Voltar</a>';
const cadastro = 'Vc esta na pagina "cadastro" <br> <a href="/">Voltar</a>';
const home = 'Vc esta na pagina "home" <br> <a href="/">Voltar</a>';
const dashboard = 'Vc esta na pagina "dashboard" <br> <a href="/">Voltar</a>';
const descricao = 'Vc esta na pagina "descricao" <br> <a href="/">Voltar</a>';


app.get("/", (req, res) => {
    // res.send(index);
    res.render("login");
});

app.get("/sobre", (req, res) => {
    res.send(sobre);
})

app.get("/login", (req, res) => {
    res.render(login);
});

app.post("/login", (req, res) => {
    res.send("login ainda não implementado.");
});

app.get("/cadastro", (req, res) => {
    res.send(cadastro);
});

app.post("/cadastro", (req, res) => {
    res.body ? 
    console.log(JSON.stringify(req.body))
    : console.log(`Body vazio: ${req.body}`)
    
    res.send(
        `Bem-vindo usuario: ${req.body.username}, seu email é ${req.body.email}`
    );
});

app.get("/home", (req, res) => {
    res.send(home);
});

app.get("/dashboard", (req, res) => {
    res.send(dashboard);
});

app.get("/descricao", (req, res) => {
    res.send(descricao);
});

// app.get('/', (req, res) => {
//     res.send("olá senai");
// });

// app.get("/sobre", (req, res) => {
//     res.send("vc esta na pagina sobre");
// });

// app.get("/info", (req, res) => {
//     res.send("vc esta na pagina info");
// });


app.listen(PORT, () => {
    console.log(`servidor sendo execultado na portal 3000 ${PORT}!`);
});