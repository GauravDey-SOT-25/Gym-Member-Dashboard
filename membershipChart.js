/**
 * Membership Chart Module
 * Gym Dashboard — Dark & Gold Theme
 * Fixed: chart no longer overlaps stat cards
 */

class MembershipChart {
    constructor(canvasId = 'membershipDoughnutChart') {
        this.canvasId = canvasId;
        this.chart = null;
        this.chartData = null;
        this.animationEnabled = true;
        this.selectedSegmentIndex = null;
        this.init();
    }

    async init() {
        try {
            this.showLoading(true);
            this.chartData = await fetchChartData('membership', 'distribution');
            const config = this.createChartConfig();

            const canvas = document.getElementById(this.canvasId);
            if (!canvas) throw new Error(`Canvas "${this.canvasId}" not found`);

            // Destroy any previous instance first
            if (this.chart) { this.chart.destroy(); this.chart = null; }

            this.chart = new Chart(canvas.getContext('2d'), config);
            this.updateStatistics();
            this.updateLegend();
            this.attachEventListeners();
            this.showLoading(false);
            console.log('✅ MembershipChart initialised');
        } catch (err) {
            console.error('❌ MembershipChart init error:', err);
            this.showLoading(false);
            if (typeof handleAPIError === 'function') handleAPIError(err, 'MembershipChart.init');
        }
    }

    createChartConfig() {
        const data   = this.chartData.data;
        const values = data.values;
        const total  = values.reduce((a, b) => a + b, 0);

        // Gym gold/dark palette (always applied regardless of api.js colors)
        const GYM_COLORS = ['#FFD700', '#FFA500', '#e67e00', '#b35900'];

        return {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: values,
                    backgroundColor: GYM_COLORS,
                    borderColor: '#1e2a3a',
                    borderWidth: 3,
                    hoverBorderColor: '#FFD700',
                    hoverBorderWidth: 3,
                    hoverOffset: 14
                }]
            },
            options: {
                /* KEY: responsive + aspectRatio means Chart.js draws itself
                   into whatever width its canvas has, keeping a 1:1 square.
                   The parent (.chart-wrapper) has max-width in CSS but NO fixed
                   height, so the canvas height = canvas width. Nothing overflows. */
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1,

                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(15,25,40,0.97)',
                        titleColor: '#FFD700',
                        bodyColor: '#e2e8f0',
                        borderColor: '#FFD700',
                        borderWidth: 1,
                        padding: 12,
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont:  { size: 13 },
                        bodySpacing: 6,
                        displayColors: true,
                        callbacks: {
                            title: ctx => ctx[0].label,
                            label: ctx => {
                                const pct = ((ctx.parsed / total) * 100).toFixed(1);
                                return [`  Members: ${ctx.parsed}`, `  Share:   ${pct}%`];
                            },
                            afterLabel: ctx => {
                                const prices = [599, 399, 199, 0];
                                const rev = ctx.parsed * (prices[ctx.dataIndex] || 0);
                                return `  Revenue: $${rev.toLocaleString()}`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: false,
                    duration: this.animationEnabled ? 750 : 0,
                    easing: 'easeInOutQuart'
                },
                onClick: (e, els) => this.handleChartClick(e, els),
                onHover:  (e, els) => {
                    const cv = document.getElementById(this.canvasId);
                    if (cv) cv.style.cursor = els.length ? 'pointer' : 'default';
                }
            }
        };
    }

    updateStatistics() {
        const grid = document.getElementById('statsGrid');
        if (!grid || !this.chartData) return;

        const { labels, values, colors } = this.chartData.data;
        const GYM_COLORS = ['#FFD700', '#FFA500', '#e67e00', '#b35900'];
        const total = values.reduce((a, b) => a + b, 0);

        grid.innerHTML = '';
        labels.forEach((label, i) => {
            const pct   = ((values[i] / total) * 100).toFixed(1);
            const color = GYM_COLORS[i] || colors[i];
            const isActive = this.selectedSegmentIndex === i;

            const card = document.createElement('div');
            card.className = 'stat-card' + (isActive ? ' active' : '');
            card.dataset.index = i;
            card.onclick = () => this.selectSegment(i);

            card.innerHTML = `
                <div class="stat-card-inner">
                    <div class="stat-dot" style="background:${isActive ? '#1a1a2e' : color}"></div>
                    <h3>${label}</h3>
                </div>
                <div class="stat-value">${values[i]}</div>
                <div class="stat-percentage">${pct}%</div>
            `;
            grid.appendChild(card);
        });
    }

    updateLegend() {
        const container = document.getElementById('legendItems');
        if (!container || !this.chartData) return;

        const { labels } = this.chartData.data;
        const GYM_COLORS = ['#FFD700', '#FFA500', '#e67e00', '#b35900'];

        container.innerHTML = '';
        labels.forEach((label, i) => {
            const item = document.createElement('div');
            item.className = 'legend-item';
            item.onclick   = () => this.selectSegment(i);
            item.innerHTML = `
                <div class="legend-color" style="background:${GYM_COLORS[i]}"></div>
                <span>${label}</span>
            `;
            container.appendChild(item);
        });
    }

    handleChartClick(event, elements) {
        if (elements.length > 0) this.selectSegment(elements[0].index);
    }

    selectSegment(index) {
        this.selectedSegmentIndex = index;
        this.updateStatistics();
        this.updateLegend();
        console.log('Segment selected:', this.chartData.data.labels[index]);
    }

    async refreshData() {
        try {
            this.showLoading(true);
            this.chartData = await fetchChartData('membership', 'distribution');

            if (this.chart) {
                const GYM_COLORS = ['#FFD700', '#FFA500', '#e67e00', '#b35900'];
                const d = this.chartData.data;
                this.chart.data.labels                           = d.labels;
                this.chart.data.datasets[0].data                 = d.values;
                this.chart.data.datasets[0].backgroundColor      = GYM_COLORS;
                this.chart.update(this.animationEnabled ? 'active' : 'none');
            }

            this.updateStatistics();
            this.updateLegend();
            this.showLoading(false);
            console.log('✅ Chart data refreshed');
        } catch (err) {
            console.error('❌ Refresh error:', err);
            this.showLoading(false);
            if (typeof handleAPIError === 'function') handleAPIError(err, 'MembershipChart.refreshData');
        }
    }

    toggleAnimation() {
        this.animationEnabled = !this.animationEnabled;
        if (this.chart) {
            this.chart.options.animation.duration = this.animationEnabled ? 750 : 0;
            this.chart.update();
        }
        return this.animationEnabled;
    }

    showLoading(show) {
        const el = document.getElementById('chartLoading');
        if (el) el.classList.toggle('show', show);
    }

    exportAsImage() {
        if (!this.chart) return;
        const a = document.createElement('a');
        a.href     = this.chart.toBase64Image();
        a.download = `membership-chart-${new Date().toISOString().split('T')[0]}.png`;
        a.click();
    }

    attachEventListeners() {
        let timer;
        window.addEventListener('resize', () => {
            clearTimeout(timer);
            timer = setTimeout(() => { if (this.chart) this.chart.resize(); }, 200);
        });
        window.addEventListener('orientationchange', () => {
            setTimeout(() => { if (this.chart) this.chart.resize(); }, 150);
        });
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.chart) this.chart.resize();
        });
    }

    getStatistics() {
        if (!this.chartData) return null;
        const { labels, values } = this.chartData.data;
        const total = values.reduce((a, b) => a + b, 0);
        return {
            total,
            segments: labels.map((name, i) => ({
                name,
                count: values[i],
                percentage: ((values[i] / total) * 100).toFixed(1)
            }))
        };
    }

    destroy() {
        if (this.chart) { this.chart.destroy(); this.chart = null; }
    }
}

/* ── globals ── */
let membershipChart = null;

document.addEventListener('DOMContentLoaded', () => {
    membershipChart = new MembershipChart('membershipDoughnutChart');
});

async function refreshMembershipChart() {
    if (membershipChart) await membershipChart.refreshData();
}

function toggleChartAnimation(event) {
    if (!membershipChart) return;
    const on = membershipChart.toggleAnimation();
    if (event && event.target) {
        event.target.textContent = on ? '✨ Toggle Animation' : '⏸ Animation Off';
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MembershipChart, refreshMembershipChart, toggleChartAnimation };
}
