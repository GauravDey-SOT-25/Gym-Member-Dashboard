// js/membershipChart.js
// Refactored Membership Chart Module for FitMatrix Gym SaaS Dashboard

import API from './data.js';

export class MembershipChart {
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
            
            // Call our modular data layer instead of a global function
            this.chartData = await API.getMembershipDistribution();
            
            const config = this.createChartConfig();
            const canvas = document.getElementById(this.canvasId);
            if (!canvas) throw new Error(`Canvas "${this.canvasId}" not found`);

            // Destroy any previous instance first
            if (this.chart) {
                this.chart.destroy();
                this.chart = null;
            }

            this.chart = new Chart(canvas.getContext('2d'), config);

            // Re-apply active highlighting on the newly created chart instance
            if (this.selectedSegmentIndex !== null) {
                this.chart.setActiveElements([{
                    datasetIndex: 0,
                    index: this.selectedSegmentIndex
                }]);
            }

            this.updateStatistics();
            this.updateLegend();
            this.attachEventListeners();
            this.showLoading(false);
            console.log('✅ MembershipChart initialized');
        } catch (err) {
            console.error('❌ MembershipChart init error:', err);
            this.showLoading(false);
        }
    }

    createChartConfig() {
        const data = this.chartData.data;
        const values = data.values;
        const total = values.reduce((a, b) => a + b, 0);

        // Gym gold/dark palette
        const GYM_COLORS = ['#FFD700', '#FFA500', '#e67e00', '#b35900'];
        
        // Resolve theme colors manually for Chart.js 2D Canvas context
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        const resolvedBorderColor = isDark ? '#1e2a3a' : '#FFFFFF';
        const resolvedTooltipBg = isDark ? '#111111' : '#FFFFFF';
        const resolvedTooltipBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
        const resolvedTooltipText = isDark ? '#FFFFFF' : '#111111';

        return {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: values,
                    backgroundColor: GYM_COLORS,
                    borderColor: resolvedBorderColor,
                    borderWidth: 3,
                    hoverBorderColor: '#FFD700',
                    hoverBorderWidth: 3,
                    hoverOffset: 14
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        backgroundColor: resolvedTooltipBg,
                        titleColor: '#FFD700',
                        bodyColor: resolvedTooltipText,
                        borderColor: resolvedTooltipBorder,
                        borderWidth: 1,
                        padding: 12,
                        titleFont: { family: 'Lexend', size: 14, weight: 'bold' },
                        bodyFont: { family: 'Manrope', size: 13 },
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
                onHover: (e, els) => {
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
            const pct = ((values[i] / total) * 100).toFixed(1);
            const color = GYM_COLORS[i] || colors[i];
            const isActive = this.selectedSegmentIndex === i;

            const card = document.createElement('div');
            card.className = 'membership-stat-mini-card' + (isActive ? ' active' : '');
            card.dataset.index = i;
            card.onclick = () => this.selectSegment(i);

            card.innerHTML = `
                <div class="membership-stat-inner">
                    <div class="membership-stat-dot" style="background:${isActive ? '#111111' : color}"></div>
                    <h3>${label}</h3>
                </div>
                <div class="membership-stat-value">${values[i]}</div>
                <div class="membership-stat-percentage">${pct}%</div>
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
            item.className = 'membership-legend-item' + (this.selectedSegmentIndex === i ? ' active' : '');
            item.onclick = () => this.selectSegment(i);
            item.innerHTML = `
                <div class="membership-legend-color" style="background:${GYM_COLORS[i]}"></div>
                <span>${label}</span>
            `;
            container.appendChild(item);
        });
    }

    handleChartClick(event, elements) {
        if (elements.length > 0) {
            this.selectSegment(elements[0].index);
        } else {
            this.selectSegment(null); // Clear selection if clicking outside
        }
    }

    selectSegment(index) {
        if (this.selectedSegmentIndex === index) {
            this.selectedSegmentIndex = null; // Toggle off if clicked again
        } else {
            this.selectedSegmentIndex = index;
        }
        
        this.updateStatistics();
        this.updateLegend();
        
        // Apply visual offset/highlighting on the chart itself
        if (this.chart) {
            const activeElements = [];
            if (this.selectedSegmentIndex !== null) {
                activeElements.push({
                    datasetIndex: 0,
                    index: this.selectedSegmentIndex
                });
            }
            this.chart.setActiveElements(activeElements);
            this.chart.update('active');
        }
    }

    async refreshData() {
        try {
            this.showLoading(true);
            this.chartData = await API.getMembershipDistribution();

            if (this.chart) {
                const GYM_COLORS = ['#FFD700', '#FFA500', '#e67e00', '#b35900'];
                const d = this.chartData.data;
                this.chart.data.labels = d.labels;
                this.chart.data.datasets[0].data = d.values;
                this.chart.data.datasets[0].backgroundColor = GYM_COLORS;
                this.chart.update(this.animationEnabled ? 'active' : 'none');

                // Re-apply active highlighting on the chart after update
                if (this.selectedSegmentIndex !== null) {
                    this.chart.setActiveElements([{
                        datasetIndex: 0,
                        index: this.selectedSegmentIndex
                    }]);
                    this.chart.update('none'); // silent update
                }
            }

            this.updateStatistics();
            this.updateLegend();
            this.showLoading(false);
        } catch (err) {
            console.error('❌ MembershipChart refresh error:', err);
            this.showLoading(false);
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
        a.href = this.chart.toBase64Image();
        a.download = `membership-distribution-${new Date().toISOString().split('T')[0]}.png`;
        a.click();
    }

    attachEventListeners() {
        let timer;
        const resizeHandler = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (this.chart) this.chart.resize();
            }, 200);
        };
        window.addEventListener('resize', resizeHandler);
        
        // Save handler references to destroy properly
        this._resizeHandler = resizeHandler;
    }

    destroy() {
        if (this._resizeHandler) {
            window.removeEventListener('resize', this._resizeHandler);
        }
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}
