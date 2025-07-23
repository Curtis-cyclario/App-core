/**
 * Comprehensive Settings Management System
 * Modular configuration for all application aspects
 */

class SettingsManager {
    constructor() {
        this.settings = this.getDefaultSettings();
        this.callbacks = {};
        this.loadSettings();
    }

    getDefaultSettings() {
        return {
            rendering: {
                quality: 'high',
                shadows: true,
                antialiasing: true,
                lodEnabled: true,
                wireframe: false,
                pointSize: 1.0,
                lineWidth: 1.0
            },
            display: {
                gridVisible: true,
                coordinatesVisible: true,
                depthIndicator: true,
                fpsCounter: true,
                compassVisible: true,
                scaleBar: true,
                statusBar: true
            },
            layers: {
                terrain: true,
                geology: true,
                miningSites: true,
                satellite: false,
                drillHoles: true,
                crossSections: false,
                historicalMaps: false
            },
            navigation: {
                mouseSensitivity: 1.0,
                zoomSpeed: 1.0,
                panSpeed: 1.0,
                autoRotate: false,
                invertY: false,
                smoothNavigation: true
            },
            visualization: {
                xrayMode: false,
                xrayOpacity: 0.3,
                materialQuality: 'high',
                lightingIntensity: 1.0,
                ambientStrength: 0.4,
                shadowQuality: 'medium'
            },
            data: {
                autoLoad: true,
                cacheEnabled: true,
                updateInterval: 30000,
                compressionLevel: 'medium'
            },
            interface: {
                theme: 'dark',
                panelSize: 'medium',
                tooltips: true,
                animations: true,
                language: 'en'
            }
        };
    }

    async loadSettings() {
        try {
            const response = await fetch('/api/settings/load');
            const savedSettings = await response.json();
            this.settings = { ...this.settings, ...savedSettings };
            this.applySettings();
        } catch (error) {
            console.log('Using default settings');
            this.applySettings();
        }
    }

    async saveSettings() {
        try {
            await fetch('/api/settings/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.settings)
            });
        } catch (error) {
            console.warn('Settings save failed:', error);
        }
    }

    get(category, key) {
        return key ? this.settings[category]?.[key] : this.settings[category];
    }

    set(category, key, value) {
        if (!this.settings[category]) {
            this.settings[category] = {};
        }
        this.settings[category][key] = value;
        this.saveSettings();
        this.triggerCallbacks(category, key, value);
    }

    onChange(category, callback) {
        if (!this.callbacks[category]) {
            this.callbacks[category] = [];
        }
        this.callbacks[category].push(callback);
    }

    triggerCallbacks(category, key, value) {
        if (this.callbacks[category]) {
            this.callbacks[category].forEach(callback => {
                callback(key, value, this.settings[category]);
            });
        }
    }

    applySettings() {
        // Apply all current settings
        Object.keys(this.settings).forEach(category => {
            if (this.callbacks[category]) {
                this.callbacks[category].forEach(callback => {
                    callback(null, null, this.settings[category]);
                });
            }
        });
    }

    reset() {
        this.settings = this.getDefaultSettings();
        this.saveSettings();
        this.applySettings();
    }

    export() {
        return JSON.stringify(this.settings, null, 2);
    }

    import(settingsJson) {
        try {
            const imported = JSON.parse(settingsJson);
            this.settings = { ...this.getDefaultSettings(), ...imported };
            this.saveSettings();
            this.applySettings();
            return true;
        } catch (error) {
            console.error('Settings import failed:', error);
            return false;
        }
    }
}

window.SettingsManager = SettingsManager;