const express = require("express");
const path = require("path");
const mysql = require("mysql2");

const app = express();

// Middleware para ler JSON e dados de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJS e arquivos públicos
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));

// Conexão com o banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '74221701',
  database: 'MeuPortfolio'
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar no MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL!');
});

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

// FORMULÁRIO (CREATE)
app.get("/formulario", (req, res) => {
  res.render("Formulario"); // Formulario.ejs
});

app.post("/formulario", (req, res) => {
  const { nome, email, assunto } = req.body;
  const sql = 'INSERT INTO mensagens (nome, email, assunto) VALUES (?, ?, ?)';
  db.query(sql, [nome, email, assunto], (err) => {
    if (err) {
      console.error('Erro ao salvar mensagem:', err);
      return res.status(500).send('Erro ao salvar a mensagem.');
    }
    res.redirect("/mensagens");
  });
});

// LISTAR MENSAGENS (READ)
app.get("/mensagens", (req, res) => {
  const sql = 'SELECT * FROM mensagens ORDER BY data_envio DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.render("mensagens", { mensagens: results });
  });
});

// EDITAR MENSAGEM (UPDATE) - Formulário de edição
app.get("/editar/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM mensagens WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).send("Erro ao buscar a mensagem.");
    if (results.length === 0) return res.status(404).send("Mensagem não encontrada.");
    res.render("editar", { mensagem: results[0] });
  });
});

// EDITAR MENSAGEM (UPDATE) - Processa a edição
app.post("/editar/:id", (req, res) => {
  const { id } = req.params;
  const { nome, email, assunto } = req.body;
  const sql = "UPDATE mensagens SET nome = ?, email = ?, assunto = ? WHERE id = ?";
  db.query(sql, [nome, email, assunto, id], (err) => {
    if (err) return res.status(500).send("Erro ao atualizar a mensagem.");
    res.redirect("/mensagens");
  });
});

// DELETAR MENSAGEM (DELETE)
app.get("/deletar/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM mensagens WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).send("Erro ao deletar a mensagem.");
    res.redirect("/mensagens");
  });
});

module.exports = app;
