let motivational = [];
let demotivational = [];

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    motivational = data.motivational;
    demotivational = data.demotivational;
  });

document.getElementById('motBtn').addEventListener('click', () => {
  if (motivational.length === 0) return;
  const randomMot = motivational[Math.floor(Math.random() * motivational.length)];
  document.getElementById('result').innerText = `💪 Motivacional:\n${randomMot}`;
});

document.getElementById('desBtn').addEventListener('click', () => {
  if (demotivational.length === 0) return;
  const randomDes = demotivational[Math.floor(Math.random() * demotivational.length)];
  document.getElementById('result').innerText = `😓 Desmotivacional:\n${randomDes}`;
});
