const express = require("express");
const path = require("path");
require("dotenv").config();

const supabase = require("../supabaseClient");
const app = express();

// Middleware para JSON e formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine + arquivos estáticos
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));

// Rota principal — mostra habilidades por categoria
app.get("/", async (req, res) => {
  const { data, error } = await supabase.from("Habilidades").select("*");
  if (error) return res.status(500).send("Erro ao buscar habilidades.");

  const programacao = data.filter(h => h.categoria === 'Programação');
  const ferramentas = data.filter(h => h.categoria === 'Ferramentas');

  res.render("index", {
    nome: 'Gustavo Almeida Camargo',
    lang: 'C#',
    faculdade: 'FATEC - SJC',
    facul: 'Anhanguera',
    programacao,
    ferramentas
  });
});

// Página do projeto
app.get("/projeto", async (req, res) => {
  const { data, error } = await supabase.from("Habilidades").select("*");
  if (error) return res.status(500).send("Erro ao buscar habilidades.");

  const programacao = data.filter(h => h.categoria === 'Programação');
  const ferramentas = data.filter(h => h.categoria === 'Ferramentas');

  res.render("projeto", { programacao, ferramentas });
});

// Página de cadastro
app.get("/crudH", (req, res) => {
  const sucesso = req.query.sucesso === '1';
  res.render("CrudH", { sucesso });
});

// POST nova habilidade
app.post("/habilidades/nova", async (req, res) => {
  const { nome, categoria, icone } = req.body;
  const { error } = await supabase.from("Habilidades").insert([{ nome, categoria, icone }]);
  if (error) return res.status(500).send("Erro ao adicionar habilidade.");
  res.redirect("/crudH?sucesso=1");
});

// Listar habilidades
app.get("/habilidades", async (req, res) => {
  const { data, error } = await supabase.from("Habilidades").select("*").order("id", { ascending: false });
  if (error) return res.status(500).send("Erro ao buscar habilidades.");
  res.render("habilidades", { habilidades: data });
});

// Editar habilidade - GET
app.get("/habilidades/editar/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("Habilidades").select("*").eq("id", id).single();
  if (error) return res.status(500).send("Erro ao buscar habilidade.");
  res.render("editarHabilidade", { habilidade: data });
});

// Editar habilidade - POST
app.post("/habilidades/editar/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, categoria, icone } = req.body;
  const { error } = await supabase
    .from("Habilidades")
    .update({ nome, categoria, icone })
    .eq("id", id);
  if (error) return res.status(500).send("Erro ao editar habilidade.");
  res.redirect("/habilidades");
});

// Deletar habilidade
app.get("/habilidades/deletar/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("Habilidades").delete().eq("id", id);
  if (error) return res.status(500).send("Erro ao deletar habilidade.");
  res.redirect("/habilidades");
});

module.exports = app;
