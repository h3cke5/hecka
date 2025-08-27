// index.js
const express = require("express");
const Canvas = require("canvas");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/wanted", async (req, res) => {
  const avatarUrl = req.query.avatar;
  const username = req.query.username || "Suspeito";

  if (!avatarUrl) return res.status(400).send("Parâmetro 'avatar' é obrigatório");

  try {
    const canvas = Canvas.createCanvas(600, 800);
    const ctx = canvas.getContext("2d");

    // Template de fundo
    const template = await Canvas.loadImage(__dirname + "/assets/wanted-template.png");
    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

    // Avatar
    const avatar = await Canvas.loadImage(avatarUrl);
    ctx.drawImage(avatar, 150, 250, 300, 300);

    // Nome
    ctx.font = "bold 40px Arial";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText(username, canvas.width / 2, 600);

    res.setHeader("Content-Type", "image/png");
    res.send(canvas.toBuffer());
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao gerar cartaz");
  }
});

app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
