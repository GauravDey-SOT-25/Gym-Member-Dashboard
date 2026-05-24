/**
 * Main Application Module
 * Orchestrates all gym dashboard components
 * Coordinates: API, Data Manager, Real-time Updates, Chart Rendering
 */

class GymDashboardApp {
    constructor() {
        this.initialized = false;
        this.modules = {
            api: null,
            dataManager: null,
            realtimeManager: null,
            membershipChart: null
        };
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('🚀 Initializing Gym Dashboard...');

            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Initialize components
            this.setupErrorHandling();
            this.setupAccessibility();
            this.setupPerformanceMonitoring();

            // Wait for chart to initialize
            await this.waitForChart();

            // Setup real-time updates
            initializeRealtimeUpdates();

            this.initialized = true;
            console.log('✅ Gym Dashboard initialized successfully');
            this.logInitializationInfo();
        } catch (error) {
            console.error('❌ Error initializing application:', error);
            this.showInitializationError(error);
        }
    }

    /**
     * Wait for membership chart to initialize
     */
    async waitForChart() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (membershipChart && membershipChart.chart) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);

            // Timeout after 10 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                console.warn('⚠️ Membership chart initialization timeout');
                resolve();
            }, 10000);
        });
    }

    /**
     * Setup global error handling
     */
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error caught:', event.error);
            handleAPIError(event.error, 'Global');
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            handleAPIError(event.reason, 'Unhandled Promise');
        });
    }

    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        // Add ARIA labels for buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach((btn, index) => {
            if (!btn.getAttribute('aria-label')) {
                btn.setAttribute('aria-label', btn.textContent || `Button ${index}`);
            }
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Ctrl+R to refresh chart
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                refreshMembershipChart();
            }

            // Ctrl+E to export chart
            if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
                e.preventDefault();
                if (membershipChart) {
                    membershipChart.exportAsImage();
                }
            }
        });

        console.log('✅ Accessibility features enabled');
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor chart performance
        if (window.performance && window.performance.measure) {
            window.addEventListener('load', () => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`⏱️  Page load time: ${pageLoadTime}ms`);
            });
        }

        // Monitor memory usage (if available)
        if (performance.memory) {
            setInterval(() => {
                const memUsage = {
                    usedJSHeapSize: (performance.memory.usedJSHeapSize / 1048576).toFixed(2),
                    totalJSHeapSize: (performance.memory.totalJSHeapSize / 1048576).toFixed(2),
                    jsHeapSizeLimit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2)
                };
                console.log(`💾 Memory usage: ${memUsage.usedJSHeapSize}MB / ${memUsage.totalJSHeapSize}MB`);
            }, 30000); // Check every 30 seconds
        }

        console.log('✅ Performance monitoring enabled');
    }

    /**
     * Log initialization information
     */
    logInitializationInfo() {
        console.group('📊 Dashboard Status');
        console.log('Chart Instance:', membershipChart !== null);
        console.log('Chart Ready:', membershipChart?.chart !== null);
        console.log('Real-time Status:', getRealtimeStatus());
        console.log('Keyboard Shortcuts:', {
            'Ctrl+R': 'Refresh Chart',
            'Ctrl+E': 'Export Chart'
        });
        console.groupEnd();
    }

    /**
     * Show initialization error
     */
    showInitializationError(error) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            right: 20px;
            background: #f56565;
            color: white;
            padding: 20px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            line-height: 1.6;
        `;
        errorDiv.innerHTML = `
            <strong>❌ Initialization Error</strong><br>
            ${error.message}<br>
            <small style="opacity: 0.9;">Check console for details</small>
        `;
        document.body.appendChild(errorDiv);

        setTimeout(() => errorDiv.remove(), 10000);
    }

    /**
     * Get dashboard status
     */
    getStatus() {
        return {
            initialized: this.initialized,
            chartReady: membershipChart?.chart !== null,
            realtimeStatus: getRealtimeStatus(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Reset dashboard
     */
    async reset() {
        console.log('🔄 Resetting dashboard...');
        
        stopRealtimeUpdates();
        if (membershipChart) {
            membershipChart.destroy();
        }
        clearDataCache();

        // Reinitialize
        setTimeout(() => this.init(), 500);
    }
}

/**
 * Global application instance
 */
let gymDashboardApp = null;

/**
 * Initialize app when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        gymDashboardApp = new GymDashboardApp();
        gymDashboardApp.init();
    });
} else {
    gymDashboardApp = new GymDashboardApp();
    gymDashboardApp.init();
}

/**
 * Global functions for external use
 */

/**
 * Get app status
 */
function getAppStatus() {
    return gymDashboardApp?.getStatus();
}

/**
 * Reset app
 */
async function resetApp() {
    if (gymDashboardApp) {
        await gymDashboardApp.reset();
    }
}

/**
 * Log system information
 */
function logSystemInfo() {
    console.group('🖥️  System Information');
    console.log('User Agent:', navigator.userAgent);
    console.log('Platform:', navigator.platform);
    console.log('Language:', navigator.language);
    console.log('Screen Resolution:', `${window.innerWidth}x${window.innerHeight}`);
    console.log('Chart.js Version:', Chart.version);
    console.log('App Status:', getAppStatus());
    console.groupEnd();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GymDashboardApp,
        gymDashboardApp,
        getAppStatus,
        resetApp,
        logSystemInfo
    };
}
