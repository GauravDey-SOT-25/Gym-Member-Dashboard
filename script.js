const root = document.body;
const savedTheme = localStorage.getItem('gym-theme');
if (savedTheme === 'light') root.classList.add('light-theme');

const themeBtn = document.querySelector('[data-theme-toggle]');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    root.classList.toggle('light-theme');
    localStorage.setItem('gym-theme', root.classList.contains('light-theme') ? 'light' : 'dark');
  });
}

const lineCanvas = document.getElementById('lineChart');
const pieCanvas = document.getElementById('pieChart');

if (lineCanvas && window.Chart) {
  new Chart(lineCanvas, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Workout Minutes',
        data: [40, 55, 45, 70, 60, 80, 68],
        borderColor: '#D9FF00',
        backgroundColor: 'rgba(217,255,0,.12)',
        fill: true,
        tension: .4
      }]
    },
    options: {responsive:true, maintainAspectRatio:false, plugins:{legend:{labels:{color:'#B8B8B8'}}}, scales:{x:{ticks:{color:'#B8B8B8'},grid:{color:'#333'}}, y:{ticks:{color:'#B8B8B8'},grid:{color:'#333'}}}}
  });
}

if (pieCanvas && window.Chart) {
  new Chart(pieCanvas, {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'Remaining'],
      datasets: [{data: [72, 28], backgroundColor: ['#D9FF00', '#333333'], borderWidth: 0}]
    },
    options: {responsive:true, maintainAspectRatio:false, plugins:{legend:{labels:{color:'#B8B8B8'}}}}
  });
}
