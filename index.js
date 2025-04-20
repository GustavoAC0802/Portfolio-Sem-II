const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get("/", (req, res) => {
    var nome = 'Gustavo Almeida Camargo';
    var lang = 'C#';
    var faculdade = 'FATEC';
    var facul = 'Anhanguera'; 

    res.render("index", {
        nome: nome,
        lang: lang,
        faculdade:faculdade,
        facul:facul
        
    });
});

app.get("/projeto", (req, res) => {
    res.render("projeto");  
});

app.listen(3000, () => {
    console.log("App Rodando");
});
