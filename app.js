const express = require("express");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const session = require("express-session")

const bodyParse = require("body-parser");


const PORT = 3000;

const app = express();

let config = { titulo: "", rodape: "" };

const db = new sqlite3.Database("user.db");

db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS users (id  INTEGER PRIMARY KEY AUTOINCREMENT, 
        username text, password TEXT, email TEXT, celular TEXT, cpf TEXT, rg TEXT)`
    );
});

app.use(
    session({
        secret: "qualquersenha",
        resave: true,
        saveUninitialized: true,
    })
);

app.use("/static", express.static(__dirname + "/static"));

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const index = "<a href='/sobre'>sobre</a> <br> <a href='/login' >login</a> <br> <a href='/cadastro'>cadastro</a> <br> <a href='/home'>home</a> <br> <a href='/dashboard'>dashboard</a> <br> <a href='/descricao'>descricao</a>";
const sobre = 'Vc esta na pagina "sobre" <br> <a href="/">Voltar</a>';
// const login = 'Vc esta na pagina "login" <br> <a href="/">Voltar</a>';
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
    // res.render("Pages/index");
    res.render("Pages/index", { ...config, req: req });
});

app.get("/sobre", (req, res) => {
    res.render("Pages/sobre", { ...config, req: req });
})


app.get("/cadastro", (req, res) => {
    console.log("GET /cadastro");
    res.render("Pages/cadastro", { ...config, req: req });
})

app.get("/sobre", (req, res) => {
    console.log("GET /index");
    res.render("Pages/sobre", { ...config, req: req });

    config = { titulo: "blog da turma 12hna -sesi nova odessa", rodape: "" };
    res.render("Pages/index", config);
})

app.get("/login", (req, res) => {
    console.log("GET /login");
    res.render("Pages/login", { ...config, req: req });
});

app.post("/login", (req, res) => {
    console.log("POST /login");
    // res.send(cadastro);
    const { username, password } = req.body;
    console.log(`req.body: ${JSON.stringify(req.body)}`)

    const query = "SELECT * FROM users WHERE username=? AND password=?"
    //consultar o usuario no banco de dados 
    db.get(query, [username, password], (err, row) => {
        if (err) throw err;
        console.log(`SELECT: ${JSON.stringify(row)}`);

        if (row) {
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect("/dashboard");
        }
        else {
            res.send("Usuario invalido.");
        }
    });
    //se o ussuario valido -> registra a sessão e redireciona par o dashborad
    //se não enviar mensagem de erro
});

app.get("/usuarios", (req, res) => {
    const query = "SELECT * FROM users";
    db.all(query, (err, row) => {
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
    !res.body ?
        console.log(JSON.stringify(req.body))
        : console.log(`Body vazio: ${JSON.stringify(req.body)}`)

    const { username, password, email, celular, cpf, rg } = req.body;

    const query =
        "SELECT * FROM users WHERE email=? OR cpf = ? OR rg= ? OR username=?";
    db.get(query, [email, cpf, rg, username], (err, row) => {
        if (err) throw err;
        if (row) {
            res.send("Usuário já cadastrado, refaça o cadastro!")
        } else {
            const insertQuery = "INSERT INTO users (username, password, email, celular, cpf, rg) VALUES (?,?,?,?,?,?)"
            db.run(insertQuery, [username, password, email, celular, cpf, rg], (err) => {
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

    res.redirect("/");
});

//app.get("/dashboard", (req, res) => {
//res.send(dashboard);
//});

app.get("/descricao", (req, res) => {
    res.send(descricao);
});


app.get("/logout", (req, res) => {
    req.session.destroy((login) => {
        res.redirect("/cadastro");
    });
});


app.get("/dashboard", (req, res) => {
    console.log("GET/dashboard");
    console.log(`${JSON.stringify(req.session)}`);

    if (req.session.loggedin) {
        const query = "SELECT * FROM users";

        db.all(query, (err, rows) => {
            if (err) throw err;
            //if (row) {
            console.log(rows);
            res.render("Pages/dashboard", { ...config, row: rows, req: req });
            //}
        });
    } else {
        res.redirect("/");
    }
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
app.use('*', (req, res) => {
    res.status(404).render('Pages/404', { ...config, req: req});
});


app.listen(PORT, () => {
    console.log(`servidor sendo execultado na portal 3000 ${PORT}!`);
});