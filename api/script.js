let truths = [];
let dares = [];

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    truths = data.truths;
    dares = data.dares;
  });

document.getElementById('truthBtn').addEventListener('click', () => {
  if (truths.length === 0) return;
  const randomTruth = truths[Math.floor(Math.random() * truths.length)];
  document.getElementById('result').innerText = `🗣️ Verdade:\n${randomTruth}`;
});

document.getElementById('dareBtn').addEventListener('click', () => {
  if (dares.length === 0) return;
  const randomDare = dares[Math.floor(Math.random() * dares.length)];
  document.getElementById('result').innerText = `🎯 Desafio:\n${randomDare}`;
});
