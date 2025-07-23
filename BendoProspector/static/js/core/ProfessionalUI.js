/**
 * Professional UI Manager
 * Clean, functional interface for 3D geo-interfacing
 */

class ProfessionalUI {
    constructor(geoApp) {
        this.geoApp = geoApp;
        this.panels = new Map();
        this.activeTools = new Set();
        this.messageSystem = null;
        
        this.init();
    }

    init() {
        this.createLayout();
        this.setupToolbar();
        this.setupStatusBar();
        this.setupMessageSystem();
        this.setupKeyboardShortcuts();
    }

    createLayout() {
        const layout = `
            <div id="geo-interface" class="h-screen flex flex-col bg-gray-900 text-gray-100">
                <!-- Header Toolbar -->
                <div id="toolbar" class="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <h1 class="text-lg font-semibold text-gray-100">3D Geo Interface</h1>
                        <div id="tool-buttons" class="flex space-x-2"></div>
                    </div>
                    <div id="view-controls" class="flex items-center space-x-4">
                        <div class="text-sm text-gray-400">
                            <span id="coordinate-display">Local XYZ</span>
                        </div>
                    </div>
                </div>

                <!-- Main Content Area -->
                <div class="flex-1 flex">
                    <!-- Left Panel -->
                    <div id="left-panel" class="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
                        <div id="panel-tabs" class="flex border-b border-gray-700">
                            <button class="panel-tab active px-4 py-2 text-sm font-medium" data-panel="data">Data</button>
                            <button class="panel-tab px-4 py-2 text-sm font-medium" data-panel="layers">Layers</button>
                            <button class="panel-tab px-4 py-2 text-sm font-medium" data-panel="tools">Tools</button>
                        </div>
                        <div id="panel-content" class="p-4"></div>
                    </div>

                    <!-- 3D Viewport -->
                    <div class="flex-1 relative">
                        <div id="viewport-container" class="w-full h-full bg-gray-900"></div>
                        
                        <!-- Viewport Controls Overlay -->
                        <div id="viewport-controls" class="absolute top-4 right-4 space-y-2">
                            <button id="reset-view" class="control-btn" title="Reset View (R)">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
                                </svg>
                            </button>
                            <button id="focus-terrain" class="control-btn" title="Focus on Terrain (F)">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h3a1 1 0 011 1v3a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-3zm13-1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13H17a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                                </svg>
                            </button>
                            <button id="toggle-grid" class="control-btn" title="Toggle Grid (G)">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Status Bar -->
                <div id="status-bar" class="bg-gray-800 border-t border-gray-700 px-4 py-2 flex items-center justify-between text-sm">
                    <div class="flex items-center space-x-4">
                        <span id="status-message" class="text-gray-300">Ready</span>
                        <span id="camera-position" class="text-gray-400"></span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span id="performance-info" class="text-gray-400"></span>
                        <span id="data-info" class="text-gray-400"></span>
                    </div>
                </div>
            </div>
        `;

        document.body.innerHTML = layout;
        this.setupPanelSystem();
    }

    setupToolbar() {
        const toolButtons = document.getElementById('tool-buttons');
        
        const tools = [
            { id: 'load-terrain', label: 'Load Terrain', icon: '🗻' },
            { id: 'load-data', label: 'Load Data', icon: '📊' },
            { id: 'measure', label: 'Measure', icon: '📏' },
            { id: 'cross-section', label: 'Cross Section', icon: '✂️' }
        ];

        tools.forEach(tool => {
            const button = document.createElement('button');
            button.className = 'tool-btn px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-medium rounded border border-gray-600';
            button.innerHTML = `${tool.icon} ${tool.label}`;
            button.addEventListener('click', () => this.activateTool(tool.id));
            toolButtons.appendChild(button);
        });
    }

    setupPanelSystem() {
        const tabs = document.querySelectorAll('.panel-tab');
        const content = document.getElementById('panel-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.showPanel(tab.dataset.panel);
            });
        });

        // Show default panel
        this.showPanel('data');
    }

    showPanel(panelName) {
        const content = document.getElementById('panel-content');
        
        switch(panelName) {
            case 'data':
                content.innerHTML = this.createDataPanel();
                break;
            case 'layers':
                content.innerHTML = this.createLayersPanel();
                break;
            case 'tools':
                content.innerHTML = this.createToolsPanel();
                break;
        }

        this.setupPanelEvents(panelName);
    }

    createDataPanel() {
        return `
            <div class="space-y-4">
                <div class="border border-gray-600 rounded p-3">
                    <h3 class="font-semibold mb-2 text-gray-200">Terrain Data</h3>
                    <div class="space-y-2">
                        <button id="load-geological-terrain" class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">
                            Load Geological Terrain
                        </button>
                        <div class="text-xs text-gray-400">
                            <div>Resolution: 256x256</div>
                            <div>Format: Heightmap/DXF</div>
                        </div>
                    </div>
                </div>

                <div class="border border-gray-600 rounded p-3">
                    <h3 class="font-semibold mb-2 text-gray-200">Geological Data</h3>
                    <div class="space-y-2">
                        <button id="load-formations" class="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded">
                            Load Formations
                        </button>
                        <button id="load-drill-holes" class="w-full px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded">
                            Load Drill Holes
                        </button>
                        <button id="load-structures" class="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded">
                            Load Structures
                        </button>
                    </div>
                </div>

                <div id="data-summary" class="border border-gray-600 rounded p-3">
                    <h3 class="font-semibold mb-2 text-gray-200">Data Summary</h3>
                    <div class="text-xs text-gray-400 space-y-1">
                        <div>No data loaded</div>
                    </div>
                </div>
            </div>
        `;
    }

    createLayersPanel() {
        return `
            <div class="space-y-4">
                <div class="border border-gray-600 rounded p-3">
                    <h3 class="font-semibold mb-2 text-gray-200">Terrain Layers</h3>
                    <div id="terrain-layers" class="space-y-2">
                        <label class="flex items-center">
                            <input type="checkbox" class="mr-2" checked>
                            <span class="text-sm">Base Terrain</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" class="mr-2">
                            <span class="text-sm">Geological Overlay</span>
                        </label>
                    </div>
                </div>

                <div class="border border-gray-600 rounded p-3">
                    <h3 class="font-semibold mb-2 text-gray-200">Data Layers</h3>
                    <div id="data-layers" class="space-y-2">
                        <label class="flex items-center">
                            <input type="checkbox" class="mr-2">
                            <span class="text-sm">Drill Holes</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" class="mr-2">
                            <span class="text-sm">Formations</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" class="mr-2">
                            <span class="text-sm">Structures</span>
                        </label>
                    </div>
                </div>

                <div class="border border-gray-600 rounded p-3">
                    <h3 class="font-semibold mb-2 text-gray-200">Visual Settings</h3>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm text-gray-300 mb-1">Terrain Opacity</label>
                            <input type="range" class="w-full" min="0" max="1" step="0.1" value="1">
                        </div>
                        <div>
                            <label class="block text-sm text-gray-300 mb-1">Height Scale</label>
                            <input type="range" class="w-full" min="0.1" max="3" step="0.1" value="1">
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createToolsPanel() {
        return `
            <div class="space-y-4">
                <div class="border border-gray-600 rounded p-3">
                    <h3 class="font-semibold mb-2 text-gray-200">Measurement Tools</h3>
                    <div class="space-y-2">
                        <button class="tool-button w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded" data-tool="distance">
                            Distance Measurement
                        </button>
                        <button class="tool-button w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded" data-tool="area">
                            Area Calculation
                        </button>
                        <button class="tool-button w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded" data-tool="elevation">
                            Elevation Profile
                        </button>
                    </div>
                </div>

                <div class="border border-gray-600 rounded p-3">
                    <h3 class="font-semibold mb-2 text-gray-200">Analysis Tools</h3>
                    <div class="space-y-2">
                        <button class="tool-button w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded" data-tool="cross-section">
                            Cross Section
                        </button>
                        <button class="tool-button w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded" data-tool="volume">
                            Volume Calculation
                        </button>
                    </div>
                </div>

                <div class="border border-gray-600 rounded p-3">
                    <h3 class="font-semibold mb-2 text-gray-200">Export Tools</h3>
                    <div class="space-y-2">
                        <button class="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded">
                            Export View
                        </button>
                        <button class="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded">
                            Export Data
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupPanelEvents(panelName) {
        switch(panelName) {
            case 'data':
                this.setupDataPanelEvents();
                break;
            case 'layers':
                this.setupLayersPanelEvents();
                break;
            case 'tools':
                this.setupToolsPanelEvents();
                break;
        }
    }

    setupDataPanelEvents() {
        document.getElementById('load-geological-terrain')?.addEventListener('click', () => {
            this.geoApp.loadTerrain();
        });

        document.getElementById('load-formations')?.addEventListener('click', () => {
            this.geoApp.loadGeologicalData();
        });

        document.getElementById('load-drill-holes')?.addEventListener('click', () => {
            this.geoApp.loadDrillHoles();
        });

        document.getElementById('load-structures')?.addEventListener('click', () => {
            this.geoApp.loadStructures();
        });
    }

    setupLayersPanelEvents() {
        const checkboxes = document.querySelectorAll('#terrain-layers input, #data-layers input');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.geoApp.setLayerVisibility(e.target.nextElementSibling.textContent.trim(), e.target.checked);
            });
        });
    }

    setupToolsPanelEvents() {
        const toolButtons = document.querySelectorAll('.tool-button');
        toolButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.activateTool(e.target.dataset.tool);
            });
        });
    }

    setupStatusBar() {
        // Update camera position display
        setInterval(() => {
            if (this.geoApp.viewport && this.geoApp.viewport.camera) {
                const pos = this.geoApp.viewport.camera.position;
                document.getElementById('camera-position').textContent = 
                    `Camera: ${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)}`;
            }
        }, 1000);
    }

    setupMessageSystem() {
        this.messageSystem = {
            show: (message, type = 'info', duration = 3000) => {
                const statusElement = document.getElementById('status-message');
                statusElement.textContent = message;
                statusElement.className = `text-${type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'gray'}-300`;
                
                if (duration > 0) {
                    setTimeout(() => {
                        statusElement.textContent = 'Ready';
                        statusElement.className = 'text-gray-300';
                    }, duration);
                }
            },

            error: (message) => this.messageSystem.show(message, 'error'),
            warning: (message) => this.messageSystem.show(message, 'warning'),
            info: (message) => this.messageSystem.show(message, 'info')
        };
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch(e.code) {
                case 'KeyR':
                    document.getElementById('reset-view').click();
                    break;
                case 'KeyF':
                    document.getElementById('focus-terrain').click();
                    break;
                case 'KeyG':
                    document.getElementById('toggle-grid').click();
                    break;
            }
        });

        // Setup viewport control events
        document.getElementById('reset-view').addEventListener('click', () => {
            this.geoApp.viewport.resetCamera();
            this.messageSystem.info('View reset');
        });

        document.getElementById('focus-terrain').addEventListener('click', () => {
            this.geoApp.viewport.focusOnTerrain();
            this.messageSystem.info('Focused on terrain');
        });

        document.getElementById('toggle-grid').addEventListener('click', () => {
            this.geoApp.viewport.toggleGrid();
            this.messageSystem.info('Grid toggled');
        });
    }

    activateTool(toolId) {
        // Deactivate other tools
        this.activeTools.clear();
        this.activeTools.add(toolId);
        
        // Update UI to show active tool
        document.querySelectorAll('.tool-btn, .tool-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Activate the tool in the application
        this.geoApp.activateTool(toolId);
        this.messageSystem.info(`${toolId} tool activated`);
    }

    updateDataSummary(data) {
        const summary = document.getElementById('data-summary');
        if (summary && data) {
            const content = summary.querySelector('div');
            content.innerHTML = `
                <div>Terrain: ${data.terrain ? 'Loaded' : 'Not loaded'}</div>
                <div>Formations: ${data.formations || 0}</div>
                <div>Drill Holes: ${data.drillHoles || 0}</div>
                <div>Structures: ${data.structures || 0}</div>
            `;
        }
    }

    updatePerformanceInfo(fps, polygons) {
        const perfInfo = document.getElementById('performance-info');
        if (perfInfo) {
            perfInfo.textContent = `${fps} FPS | ${polygons} polys`;
        }
    }

    showMessage(message, type = 'info') {
        this.messageSystem.show(message, type);
    }

    dispose() {
        // Clean up event listeners and resources
        this.panels.clear();
        this.activeTools.clear();
    }
}