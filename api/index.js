require("dotenv").config();

const express = require("express");
const path = require("path");
const supabase = require("../supabaseClient");


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJS + arquivos estáticos
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));

// Página inicial com habilidades separadas
app.get("/", async (req, res) => {
  const { data: resultados, error } = await supabase
    .from("Habilidades")
    .select("*");

  if (error) return res.status(500).send("Erro ao buscar habilidades.");

  const programacao = resultados.filter(h => h.categoria === "Programação");
  const ferramentas = resultados.filter(h => h.categoria === "Ferramentas");

  res.render("index", {
    nome: 'Gustavo Almeida Camargo',
    lang: 'C#',
    faculdade: 'FATEC - SJC',
    facul: 'Anhanguera',
    programacao,
    ferramentas
  });
});

// Página de projeto
app.get("/projeto", async (req, res) => {
  const { data: resultados, error } = await supabase
    .from("Habilidades")
    .select("*");

  if (error) return res.status(500).send("Erro ao buscar habilidades.");

  const programacao = resultados.filter(h => h.categoria === "Programação");
  const ferramentas = resultados.filter(h => h.categoria === "Ferramentas");

  res.render("projeto", { programacao, ferramentas });
});

// Página de formulário
app.get("/crudH", async (req, res) => {
  const sucesso = req.query.sucesso === '1';
  res.render("crudH", { sucesso });
});

// Adicionar nova habilidade
app.post("/habilidades/nova", async (req, res) => {
  const { nome, categoria, icone } = req.body;

  const { error } = await supabase
    .from("Habilidades")
    .insert([{ nome, categoria, icone }]);

  if (error) {
    console.error("Erro ao adicionar:", error);
    return res.status(500).send("Erro ao adicionar habilidade.");
  }

  res.redirect("/crudH?sucesso=1");
});

// Listar habilidades
app.get("/habilidades", async (req, res) => {
  const { data, error } = await supabase
    .from("Habilidades")
    .select("*")
    .order("id", { ascending: false });

  if (error) return res.status(500).send("Erro ao buscar habilidades.");

  res.render("habilidades", { habilidades: data });
});

// Editar habilidade (formulário)
app.get("/habilidades/editar/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("Habilidades")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return res.status(500).send("Habilidade não encontrada.");
  res.render("editarHabilidade", { habilidade: data });
});

// Atualizar habilidade
app.post("/habilidades/editar/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, categoria, icone } = req.body;

  const { error } = await supabase
    .from("Habilidades")
    .update({ nome, categoria, icone })
    .eq("id", id);

  if (error) return res.status(500).send("Erro ao atualizar.");

  res.redirect("/habilidades");
});

// Deletar habilidade
app.get("/habilidades/deletar/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("Habilidades")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).send("Erro ao deletar.");

  res.redirect("/habilidades");
});

module.exports = app;
