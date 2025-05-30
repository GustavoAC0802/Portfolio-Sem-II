const express = require("express");
const path = require("path");
const mysql = require("mysql2");

const app = express();

// Middleware, EJS, banco, rotas — copie tudo o que você tem no index.js aqui

// Ou (mais organizado):
const rotas = require("./api/index");
app.use("/", rotas); // monta as rotas diretamente na raiz

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
