/**
 * Membership Chart Module
 * Responsible for: Doughnut chart visualization, percentage distributions, legends,
 * chart responsiveness, dynamic dataset rendering, and interactive hover states
 * 
 * Developer: Chart.js Integration Specialist
 * Coordinator: Dataset Management Module (realtime.js)
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

    /**
     * Initialize the chart
     */
    async init() {
        try {
            // Show loading state
            this.showLoading(true);

            // Fetch initial data
            this.chartData = await fetchChartData('membership', 'distribution');

            // Create chart configuration
            const config = this.createChartConfig();

            // Render chart
            const canvas = document.getElementById(this.canvasId);
            if (!canvas) {
                throw new Error(`Canvas element with id "${this.canvasId}" not found`);
            }

            const ctx = canvas.getContext('2d');
            this.chart = new Chart(ctx, config);

            // Update UI components
            this.updateStatistics();
            this.updateLegend();
            this.attachEventListeners();

            // Hide loading state
            this.showLoading(false);

            console.log('✅ Membership chart initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing membership chart:', error);
            this.showLoading(false);
            handleAPIError(error, 'MembershipChart.init');
        }
    }

    /**
     * Create Chart.js configuration object
     * @returns {Object} - Chart configuration
     */
    createChartConfig() {
        const data = this.chartData.data;
        const values = data.values;
        const total = values.reduce((a, b) => a + b, 0);

        return {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: values,
                    backgroundColor: data.colors,
                    borderColor: '#ffffff',
                    borderWidth: 3,
                    borderRadius: 0,
                    hoverOffset: 15,
                    hoverBorderColor: '#2d3748',
                    hoverBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                indexAxis: undefined,
                plugins: {
                    legend: {
                        display: false // Custom legend handled by updateLegend()
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(45, 55, 72, 0.95)',
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        padding: 12,
                        borderColor: '#667eea',
                        borderWidth: 1,
                        displayColors: true,
                        bodySpacing: 8,
                        callbacks: {
                            title: (context) => {
                                return context[0].label;
                            },
                            label: (context) => {
                                const value = context.parsed;
                                const percentage = ((value / total) * 100).toFixed(1);
                                return [
                                    `Members: ${value}`,
                                    `Percentage: ${percentage}%`
                                ];
                            },
                            afterLabel: (context) => {
                                const index = context.dataIndex;
                                const prices = [599, 399, 199, 0]; // Pricing per tier
                                const revenue = context.parsed * prices[index];
                                return `Revenue: $${revenue.toLocaleString()}`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: false,
                    duration: this.animationEnabled ? 800 : 0,
                    easing: 'easeInOutQuart'
                },
                onClick: (event, elements) => this.handleChartClick(event, elements),
                onHover: (event, elements) => this.handleChartHover(event, elements)
            }
        };
    }

    /**
     * Update statistics cards dynamically
     */
    updateStatistics() {
        const statsGrid = document.getElementById('statsGrid');
        if (!statsGrid) return;

        const data = this.chartData.data;
        const values = data.values;
        const total = values.reduce((a, b) => a + b, 0);

        statsGrid.innerHTML = '';

        data.labels.forEach((label, index) => {
            const value = values[index];
            const percentage = ((value / total) * 100).toFixed(1);
            const color = data.colors[index];

            const statCard = document.createElement('div');
            statCard.className = 'stat-card';
            if (this.selectedSegmentIndex === index) {
                statCard.classList.add('active');
            }

            statCard.dataset.index = index;
            statCard.onclick = () => this.selectSegment(index);

            statCard.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
                    <div style="width: 20px; height: 20px; background-color: ${color}; border-radius: 50%; margin-right: 8px;"></div>
                    <h3 style="margin: 0;">${label}</h3>
                </div>
                <div class="stat-value">${value}</div>
                <div class="stat-percentage">${percentage}%</div>
            `;

            statsGrid.appendChild(statCard);
        });
    }

    /**
     * Update legend items
     */
    updateLegend() {
        const legendItems = document.getElementById('legendItems');
        if (!legendItems) return;

        const data = this.chartData.data;
        legendItems.innerHTML = '';

        data.labels.forEach((label, index) => {
            const color = data.colors[index];
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.style.cursor = 'pointer';
            legendItem.onclick = () => this.selectSegment(index);

            legendItem.innerHTML = `
                <div class="legend-color" style="background-color: ${color};"></div>
                <span>${label}</span>
            `;

            legendItems.appendChild(legendItem);
        });
    }

    /**
     * Handle chart segment click
     */
    handleChartClick(event, elements) {
        if (elements.length > 0) {
            const index = elements[0].index;
            this.selectSegment(index);
        }
    }

    /**
     * Handle chart hover effects
     */
    handleChartHover(event, elements) {
        const canvas = document.getElementById(this.canvasId);
        if (elements.length > 0) {
            canvas.style.cursor = 'pointer';
        } else {
            canvas.style.cursor = 'default';
        }
    }

    /**
     * Select and highlight a segment
     */
    selectSegment(index) {
        this.selectedSegmentIndex = index;
        this.updateStatistics();
        this.updateLegend();

        // Highlight selected stat card
        document.querySelectorAll('.stat-card').forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });

        console.log(`Segment selected: ${this.chartData.data.labels[index]}`);
    }

    /**
     * Update chart with new data
     */
    async refreshData() {
        try {
            this.showLoading(true);

            // Fetch new data
            this.chartData = await fetchChartData('membership', 'distribution');

            if (this.chart && this.chartData) {
                // Update chart data
                const data = this.chartData.data;
                this.chart.data.labels = data.labels;
                this.chart.data.datasets[0].data = data.values;
                this.chart.data.datasets[0].backgroundColor = data.colors;

                // Animate update
                this.chart.update(this.animationEnabled ? 'active' : false);

                // Update UI
                this.updateStatistics();
                this.updateLegend();
            }

            this.showLoading(false);
            console.log('✅ Chart data refreshed');
        } catch (error) {
            console.error('❌ Error refreshing chart:', error);
            this.showLoading(false);
            handleAPIError(error, 'MembershipChart.refreshData');
        }
    }

    /**
     * Toggle animation
     */
    toggleAnimation() {
        this.animationEnabled = !this.animationEnabled;
        
        if (this.chart) {
            this.chart.options.animation.duration = this.animationEnabled ? 800 : 0;
            this.chart.update();
        }

        console.log(`Animation ${this.animationEnabled ? 'enabled' : 'disabled'}`);
        return this.animationEnabled;
    }

    /**
     * Show/hide loading state
     */
    showLoading(show) {
        const loadingEl = document.getElementById('chartLoading');
        if (loadingEl) {
            loadingEl.classList.toggle('show', show);
        }
    }

    /**
     * Export chart as image
     */
    exportAsImage() {
        if (this.chart) {
            const url = this.chart.toBase64Image();
            const link = document.createElement('a');
            link.href = url;
            link.download = `membership-chart-${new Date().toISOString().split('T')[0]}.png`;
            link.click();
            console.log('✅ Chart exported as image');
        }
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Window resize handling for responsiveness
        window.addEventListener('resize', () => {
            if (this.chart) {
                this.chart.resize();
            }
        });
    }

    /**
     * Get chart statistics
     */
    getStatistics() {
        if (!this.chartData) return null;

        const data = this.chartData.data;
        const values = data.values;
        const total = values.reduce((a, b) => a + b, 0);

        return {
            total: total,
            segments: data.labels.map((label, index) => ({
                name: label,
                count: values[index],
                percentage: ((values[index] / total) * 100).toFixed(1)
            }))
        };
    }

    /**
     * Destroy chart instance
     */
    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}

/**
 * Global instance of membership chart
 */
let membershipChart = null;

/**
 * Initialize membership chart when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    membershipChart = new MembershipChart('membershipDoughnutChart');
});

/**
 * Global function to refresh chart
 */
async function refreshMembershipChart() {
    if (membershipChart) {
        await membershipChart.refreshData();
    }
}

/**
 * Global function to toggle chart animation
 */
function toggleChartAnimation() {
    if (membershipChart) {
        const enabled = membershipChart.toggleAnimation();
        const button = event.target;
        button.textContent = enabled ? 'Toggle Animation' : 'Animation Disabled';
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MembershipChart, refreshMembershipChart, toggleChartAnimation };
}
