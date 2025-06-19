const app = require("./api/index"); // Importa sua aplicação Express

const PORT = process.env.PORT || 3000; // Usa a porta da Vercel, se existir

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
