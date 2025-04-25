const express = require("express");
const sqlite3 = require("sqlite3");
const bodyParser =require("body-parser");

const bodyParse =require("body-parser");


const PORT = 3000;

const app = express();

let config = { titulo: "", rodape: ""};

const db = new sqlite3.Database("user.db");

db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS users (id  INTEGER PRIMARY KEY AUTOINCREMENT, 
        username text, password TEXT, email TEXT, celular TEXT, cpf TEXT, rg TEXT)`
    );
});

app.use("/static", express.static(__dirname + "/static"));

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const index = "<a href='/sobre'>sobre</a> <br> <a href='/login' >login</a> <br> <a href='/cadastro'>cadastro</a> <br> <a href='/home'>home</a> <br> <a href='/dashboard'>dashboard</a> <br> <a href='/descricao'>descricao</a>";
const sobre = 'Vc esta na pagina "sobre" <br> <a href="/">Voltar</a>';
const login = 'Vc esta na pagina "login" <br> <a href="/">Voltar</a>';
const cadastro = 'Vc esta na pagina "cadastro" <br> <a href="/">Voltar</a>';
const home = 'Vc esta na pagina "home" <br> <a href="/">Voltar</a>';
//const dashboard = 'Vc esta na pagina "dashboard" <br> <a href="/">Voltar</a>';
const descricao = 'Vc esta na pagina "descricao" <br> <a href="/">Voltar</a>';

//const sobre = "sobre";
// const login = 'Vc esta na pagina "login" <br> <a href="/">Voltar</a>';
// const cadastro = 'Vc esta na pagina "cadastro" <br> <a href="/">Voltar</a>';
// const home = 'Vc esta na pagina "home" <br> <a href="/">Voltar</a>';
// const dashboard = 'Vc esta na pagina "dashboard" <br> <a href="/">Voltar</a>';
// const descricao = 'Vc esta na pagina "descricao" <br> <a href="/">Voltar</a>';


app.get("/", (req, res) => {
    // res.send(index);
    res.render("Pages/index");
});

app.get("/sobre", (req, res) => {
    res.render("Pages/sobre");
})

app.get("/login", (req, res) => {
    res.render("Pages/login");
});

app.post("/login", (req, res) => {
    res.send("login ainda não implementado.");
});

app.get("/dashboard", (req, res) => {
    res.render("Pages/dashboard");
});

app.get("/cadastro", (req, res) => {
    res.render("Pages/cadastro");
});

app.get("/cadastro", (req, res) => {
    res.send("Pages/cadastro");
    console.log("GET /index")
    res.render("index");
});

app.get("/sobre", (req, res) => {
    console.log("GET /index");
    res.render(sobre);

    config = {titulo: "blog da turma 12hna -sesi nova odessa", rodape: ""};
    res.render("Pages/index", config);
})

app.get("/login", (req, res) => {
    console.log("GET /login");
    res.render("login");
});

app.post("/login", (req, res) => {
    console.log("POST /login");
    res.send(cadastro);
});

app.get("/usuarios", (req, res) => {
    const query = "SELECT * FROM users";
    db.all(query, (err, row) =>{
        console.log(`GET /usuarios ${JSON.stringify(row)}`)
        //res.send("Lista de usuarios.")
        res.render("Partials/usertable", config);
    });
});

app.get("/cadastro", (req, res) => {
    console.log("GET /cadastro");
    res.render("cadastro");
});

app.post("/cadastro", (req, res) => {
    console.log("POST /cadastro")
    res.body ? 
    console.log(JSON.stringify(req.body))
    : console.log(`Body vazio: ${req.body}`)

    const { username, password, email, celular, cpf, rg}=res.body;

    const query=
    "SELECT * FROM users WHERE email=? OR cpf = ? OR rg= ? OR username=?";
    db.get(query,[email, cpf, rg, username], (err, row) => {
        if (err) throw err; 
        if (row) {
            res.send("Usuário já cadastrdo, refaça o cadastro!")
                }else{
                    const insertQuery = "INSERT INTO user (username, password, email, celular, cpf, rg) VALUES (?,?,?,?,?,?)"
                db.run(insertQuery, [username, password, email, celular, cpf, rg], err => {
                    if (err) throw err;
                    res.send("Usuário cadastado com sucesso!")
                });
                }
    });
    console.log(`${JSON.stringify}`)


    })
    
    // res.render(
    //     `Bem-vindo usuario: ${req.body.username}, seu email é ${req.body.email}`
    //);


app.get("/home", (req, res) => {
    
    res.send(home);
});

//app.get("/dashboard", (req, res) => {
    //res.send(dashboard);
//});

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