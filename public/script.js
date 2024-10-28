// Fetch the CSV data from the server
fetch('/data')
  .then(response => response.json())
  .then(excelData => {
    createLeaderboard(excelData);
    createPlasmaEffect();
  })
  .catch(error => console.error('Error fetching data:', error));

function createLeaderboardItem(rank, name, score) {
  const item = document.createElement('div');
  item.className = 'leaderboard-item';
  item.innerHTML = `
    <div>
      <span class="rank">${rank}</span>
      <span class="name">${name}</span>
    </div>
    <div>
      <span class="score">${score.toLocaleString()} </span>
    </div>
  `;
  return item;
}

function createLeaderboard(excelData) {
  const container = document.createElement('div');
  container.className = 'leaderboard-container';

  const leaderboard = document.createElement('div');
  leaderboard.className = 'leaderboard';

  const title = document.createElement('h1');
  title.textContent = 'Leaderboard';
  leaderboard.appendChild(title);

  const sortedData = [...excelData].sort((a, b) => b.score - a.score);

  // Create top 3 section
  const top3 = document.createElement('div');
  top3.className = 'top-3';
  sortedData.slice(0, 3).forEach((item, index) => {
    const leaderboardItem = createLeaderboardItem(index + 1, item.name, item.score);
    top3.appendChild(leaderboardItem);
  });
  leaderboard.appendChild(top3);

  // Create scrollable section for the rest
  const scrollableLeaderboard = document.createElement('div');
  scrollableLeaderboard.className = 'scrollable-leaderboard';
  sortedData.slice(3).forEach((item, index) => {
    const leaderboardItem = createLeaderboardItem(index + 4, item.name, item.score);
    scrollableLeaderboard.appendChild(leaderboardItem);
  });
  leaderboard.appendChild(scrollableLeaderboard);

  const updateText = document.createElement('div');
  updateText.className = 'update-text';
  updateText.textContent = 'Final game results';
  leaderboard.appendChild(updateText);

  container.appendChild(leaderboard);
  document.getElementById('root').appendChild(container);
}

function createPlasmaEffect() {
  const leaderboard = document.querySelector('.leaderboard');
  const plasmaCanvas = document.createElement('canvas');
  plasmaCanvas.width = window.innerWidth;
  plasmaCanvas.height = window.innerHeight;
  plasmaCanvas.style.position = 'fixed';
  plasmaCanvas.style.top = '0';
  plasmaCanvas.style.left = '0';
  plasmaCanvas.style.pointerEvents = 'none';
  plasmaCanvas.style.zIndex = '-1';
  document.body.appendChild(plasmaCanvas);

  const ctx = plasmaCanvas.getContext('2d');
  let time = 0;

  function animate() {
    ctx.clearRect(0, 0, plasmaCanvas.width, plasmaCanvas.height);
    
    const leaderboardRect = leaderboard.getBoundingClientRect();
    const centerX = leaderboardRect.left + leaderboardRect.width / 2;
    const centerY = leaderboardRect.top + leaderboardRect.height / 2;

    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 100 + 50;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      const size = Math.random() * 20 + 10;
      const alpha = Math.random() * 0.5 + 0.1;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
      ctx.fill();
    }

    time += 0.05;
    requestAnimationFrame(animate);
  }

  animate();
}

// Call the function when the page loads
window.addEventListener('load', () => {
  // We'll create the plasma effect after the leaderboard is created
});

// Resize event listener to adjust canvas size
window.addEventListener('resize', () => {
  const plasmaCanvas = document.querySelector('canvas');
  if (plasmaCanvas) {
    plasmaCanvas.width = window.innerWidth;
    plasmaCanvas.height = window.innerHeight;
  }
});