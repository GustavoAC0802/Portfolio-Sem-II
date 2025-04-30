const express = require("express");
const path = require("path");

const app = express();

// Configura o mecanismo de visualização EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Serve arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, "../public")));

// Rota principal
app.get("/", (req, res) => {
    const nome = 'Gustavo Almeida Camargo';
    const lang = 'C#';
    const faculdade = 'FATEC - SJC';
    const facul = 'Anhanguera';

    res.render("index", {
        nome,
        lang,
        faculdade,
        facul
    });
});

// Rota do projeto
app.get("/projeto", (req, res) => {
    res.render("projeto");
});

// Exporta o app para ser usado como função serverless na Vercel
module.exports = app;
