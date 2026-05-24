/**
 * Data Management Module
 * Handles dataset coordination for real-time chart updates
 * Coordinator: Dataset Management Module for Chart Integration
 */

class DataManager {
    constructor() {
        this.datasets = {};
        this.updateListeners = [];
        this.cacheTimeout = 30000; // 30 seconds
        this.lastUpdate = {};
    }

    /**
     * Register a dataset
     * @param {string} key - Dataset key
     * @param {Object} data - Dataset object
     */
    registerDataset(key, data) {
        this.datasets[key] = {
            data: data,
            timestamp: new Date(),
            isFresh: true
        };
        console.log(`✅ Dataset registered: ${key}`);
    }

    /**
     * Fetch and cache dataset
     * @param {string} type - Chart type
     * @param {string} view - View type
     * @returns {Promise<Object>}
     */
    async fetchDataset(type, view) {
        const key = `${type}:${view}`;
        const cached = this.datasets[key];

        // Check if cache is still fresh
        if (cached && this.isCacheFresh(key)) {
            console.log(`📦 Using cached data: ${key}`);
            return cached.data;
        }

        // Fetch new data
        try {
            const freshData = await fetchChartData(type, view);
            this.registerDataset(key, freshData);
            this.notifyListeners(key, freshData);
            return freshData;
        } catch (error) {
            console.error(`❌ Error fetching dataset ${key}:`, error);
            // Return cached data as fallback
            return cached ? cached.data : null;
        }
    }

    /**
     * Check if cache is fresh
     * @param {string} key - Dataset key
     * @returns {boolean}
     */
    isCacheFresh(key) {
        const dataset = this.datasets[key];
        if (!dataset) return false;

        const age = new Date() - dataset.timestamp;
        return age < this.cacheTimeout;
    }

    /**
     * Subscribe to dataset updates
     * @param {Function} callback - Callback function
     */
    onDataUpdate(callback) {
        if (typeof callback === 'function') {
            this.updateListeners.push(callback);
        }
    }

    /**
     * Notify all listeners of data update
     * @param {string} key - Dataset key
     * @param {Object} data - Updated data
     */
    notifyListeners(key, data) {
        this.updateListeners.forEach(callback => {
            try {
                callback({ key, data, timestamp: new Date() });
            } catch (error) {
                console.error('Error in update listener:', error);
            }
        });
    }

    /**
     * Clear all cached data
     */
    clearCache() {
        this.datasets = {};
        console.log('✅ Cache cleared');
    }

    /**
     * Get dataset info
     * @param {string} key - Dataset key
     * @returns {Object}
     */
    getDatasetInfo(key) {
        const dataset = this.datasets[key];
        if (!dataset) return null;

        return {
            key: key,
            lastUpdate: dataset.timestamp,
            isFresh: this.isCacheFresh(key),
            size: JSON.stringify(dataset.data).length
        };
    }
}

/**
 * Global data manager instance
 */
const dataManager = new DataManager();

/**
 * Helper function to get data for chart
 * @param {string} type - Chart type
 * @param {string} view - View type
 * @returns {Promise<Object>}
 */
async function getChartData(type, view) {
    return await dataManager.fetchDataset(type, view);
}

/**
 * Helper function to watch for data updates
 * @param {Function} callback - Callback function
 */
function watchDataUpdates(callback) {
    dataManager.onDataUpdate(callback);
}

/**
 * Clear all data cache
 */
function clearDataCache() {
    dataManager.clearCache();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DataManager,
        dataManager,
        getChartData,
        watchDataUpdates,
        clearDataCache
    };
}
