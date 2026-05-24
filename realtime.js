/**
 * Real-time Updates Module
 * Handles continuous data synchronization for live chart updates
 * Coordinates with: MembershipChart for smooth updates
 */

class RealtimeManager {
    constructor() {
        this.updateInterval = null;
        this.updateFrequency = 10000; // 10 seconds
        this.isRunning = false;
        this.updateCallbacks = [];
        this.wsConnection = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    /**
     * Start real-time updates
     * @param {number} frequency - Update frequency in milliseconds
     */
    start(frequency = 10000) {
        if (this.isRunning) {
            console.log('⚠️ Real-time updates already running');
            return;
        }

        this.updateFrequency = frequency;
        this.isRunning = true;

        // Try WebSocket connection first
        this.attemptWebSocketConnection();

        // Fallback to polling
        this.startPolling();

        console.log(`✅ Real-time updates started (interval: ${frequency}ms)`);
    }

    /**
     * Stop real-time updates
     */
    stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }

        if (this.wsConnection) {
            this.wsConnection.close();
            this.wsConnection = null;
        }

        this.isRunning = false;
        console.log('⏸️  Real-time updates stopped');
    }

    /**
     * Attempt WebSocket connection
     */
    attemptWebSocketConnection() {
        // WebSocket URL - Update based on your backend
        const wsUrl = 'ws://localhost:3000/api/realtime/membership';

        try {
            this.wsConnection = new WebSocket(wsUrl);

            this.wsConnection.onopen = () => {
                console.log('🔌 WebSocket connected');
                this.reconnectAttempts = 0;
            };

            this.wsConnection.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleUpdate(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            this.wsConnection.onerror = (error) => {
                console.error('❌ WebSocket error:', error);
                this.wsConnection = null;
            };

            this.wsConnection.onclose = () => {
                console.log('⚠️ WebSocket disconnected');
                this.attemptReconnect();
            };
        } catch (error) {
            console.warn('WebSocket not available, falling back to polling:', error);
            this.wsConnection = null;
        }
    }

    /**
     * Attempt to reconnect WebSocket
     */
    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts && this.isRunning) {
            this.reconnectAttempts++;
            const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
            console.log(`⏳ Attempting WebSocket reconnect in ${delay}ms...`);
            setTimeout(() => this.attemptWebSocketConnection(), delay);
        }
    }

    /**
     * Start polling for updates
     */
    startPolling() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.updateInterval = setInterval(async () => {
            try {
                // Fetch latest membership data
                const data = await fetchChartData('membership', 'distribution');
                this.handleUpdate(data);
            } catch (error) {
                console.error('❌ Error fetching update:', error);
            }
        }, this.updateFrequency);
    }

    /**
     * Handle incoming data update
     * @param {Object} data - Update data
     */
    handleUpdate(data) {
        // Notify all registered callbacks
        this.updateCallbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error('Error in update callback:', error);
            }
        });

        // Log update
        if (data && data.data && data.data.labels) {
            console.log(`📊 Real-time update: ${data.data.labels.join(', ')}`);
        }
    }

    /**
     * Register update callback
     * @param {Function} callback - Callback function to execute on update
     */
    onUpdate(callback) {
        if (typeof callback === 'function') {
            this.updateCallbacks.push(callback);
        }
    }

    /**
     * Remove update callback
     * @param {Function} callback - Callback to remove
     */
    offUpdate(callback) {
        this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
    }

    /**
     * Clear all callbacks
     */
    clearCallbacks() {
        this.updateCallbacks = [];
    }

    /**
     * Get current status
     * @returns {Object}
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            updateFrequency: this.updateFrequency,
            wsConnected: this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN,
            callbackCount: this.updateCallbacks.length
        };
    }

    /**
     * Set update frequency
     * @param {number} frequency - New frequency in milliseconds
     */
    setUpdateFrequency(frequency) {
        this.updateFrequency = frequency;
        if (this.isRunning) {
            this.startPolling(); // Restart with new frequency
        }
        console.log(`⏱️  Update frequency changed to ${frequency}ms`);
    }
}

/**
 * Global real-time manager instance
 */
const realtimeManager = new RealtimeManager();

/**
 * Initialize real-time updates for membership chart
 */
function initializeRealtimeUpdates() {
    if (!membershipChart) {
        console.warn('⚠️ Membership chart not initialized yet');
        return;
    }

    // Register update callback
    realtimeManager.onUpdate((data) => {
        // Update membership chart with new data
        if (membershipChart && membershipChart.chart) {
            membershipChart.chartData = data;
            membershipChart.updateStatistics();
            membershipChart.updateLegend();

            // Update chart with animation
            const chartData = data.data;
            membershipChart.chart.data.labels = chartData.labels;
            membershipChart.chart.data.datasets[0].data = chartData.values;
            membershipChart.chart.data.datasets[0].backgroundColor = chartData.colors;
            membershipChart.chart.update(membershipChart.animationEnabled ? 'active' : false);
        }
    });

    // Start real-time updates
    realtimeManager.start(10000); // Update every 10 seconds
}

/**
 * Stop real-time updates
 */
function stopRealtimeUpdates() {
    realtimeManager.stop();
}

/**
 * Get real-time status
 */
function getRealtimeStatus() {
    return realtimeManager.getStatus();
}

/**
 * Change update frequency
 * @param {number} frequency - New frequency in milliseconds
 */
function setRealtimeFrequency(frequency) {
    realtimeManager.setUpdateFrequency(frequency);
}

// Initialize real-time updates when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a moment for membershipChart to initialize
    setTimeout(() => {
        initializeRealtimeUpdates();
    }, 500);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopRealtimeUpdates();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        RealtimeManager,
        realtimeManager,
        initializeRealtimeUpdates,
        stopRealtimeUpdates,
        getRealtimeStatus,
        setRealtimeFrequency
    };
}
