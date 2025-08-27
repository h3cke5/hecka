// index.js
const express = require("express");
const Canvas = require("canvas");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/wanted", async (req, res) => {
  const avatarUrl = req.query.avatar;
  const username = req.query.username || "Suspeito";

  if (!avatarUrl) return res.status(400).send("Parâmetro 'avatar' obrigatório.");

  try {
    const canvas = Canvas.createCanvas(600, 800);
    const ctx = canvas.getContext("2d");

    // Template do cartaz
    const template = await Canvas.loadImage(path.join(__dirname, "wanted-template.png"));
    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

    // Avatar do usuário
    const avatar = await Canvas.loadImage(avatarUrl);
    ctx.drawImage(avatar, 150, 250, 300, 300); // Ajuste posição/tamanho conforme o template

    // Nome do usuário
    ctx.font = "bold 40px Arial";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText(username, canvas.width / 2, 600);

    res.setHeader("Content-Type", "image/png");
    res.send(canvas.toBuffer());

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao gerar cartaz.");
  }
});

app.listen(PORT, () => console.log(`API de Wanted rodando em http://localhost:${PORT}`));
