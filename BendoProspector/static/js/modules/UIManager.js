/**
 * Comprehensive UI Management System
 * Professional modular interface with extensive controls
 */

class UIManager {
    constructor(settings, scene, camera, renderer) {
        this.settings = settings;
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.panels = {};
        this.dragState = null;
        this.init();
    }

    init() {
        this.createMainInterface();
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.createContextMenus();
        this.settings.onChange('interface', this.handleInterfaceChanges.bind(this));
    }

    createMainInterface() {
        // Remove existing controls
        const existing = document.querySelector('.controls');
        if (existing) existing.remove();

        // Create modular panel system
        this.createControlPanels();
        this.createStatusSystem();
        this.createMenuSystem();
        this.createToolbar();
    }

    createControlPanels() {
        const container = document.createElement('div');
        container.className = 'ui-container';
        container.innerHTML = `
            <!-- Main Menu Bar -->
            <div class="menu-bar">
                <div class="menu-group">
                    <button class="menu-btn" data-menu="file">File</button>
                    <button class="menu-btn" data-menu="edit">Edit</button>
                    <button class="menu-btn" data-menu="view">View</button>
                    <button class="menu-btn" data-menu="tools">Tools</button>
                    <button class="menu-btn" data-menu="help">Help</button>
                </div>
                <div class="menu-title">Bendigo 3D Underground Explorer</div>
                <div class="menu-controls">
                    <button id="settingsBtn" class="icon-btn">⚙️</button>
                    <button id="fullscreenBtn" class="icon-btn">⛶</button>
                </div>
            </div>

            <!-- Layer Controls Panel -->
            <div class="control-panel draggable" id="layerPanel" data-panel="layers">
                <div class="panel-header">
                    <span class="panel-title">Layers</span>
                    <div class="panel-controls">
                        <button class="panel-btn" data-action="minimize">−</button>
                        <button class="panel-btn" data-action="close">×</button>
                    </div>
                </div>
                <div class="panel-content">
                    <div class="layer-group">
                        <div class="layer-item">
                            <label class="layer-label">
                                <input type="checkbox" id="terrainLayer" checked>
                                <span class="checkmark"></span>
                                Surface Terrain
                            </label>
                            <div class="layer-opacity">
                                <input type="range" id="terrainOpacity" min="0" max="1" step="0.1" value="1">
                            </div>
                        </div>
                        
                        <div class="layer-item">
                            <label class="layer-label">
                                <input type="checkbox" id="satelliteLayer">
                                <span class="checkmark"></span>
                                Satellite Imagery
                            </label>
                            <div class="layer-opacity">
                                <input type="range" id="satelliteOpacity" min="0" max="1" step="0.1" value="0.8">
                            </div>
                        </div>

                        <div class="layer-item">
                            <label class="layer-label">
                                <input type="checkbox" id="geologyLayer" checked>
                                <span class="checkmark"></span>
                                DXF Geology
                            </label>
                            <div class="layer-opacity">
                                <input type="range" id="geologyOpacity" min="0" max="1" step="0.1" value="0.7">
                            </div>
                        </div>

                        <div class="layer-item">
                            <label class="layer-label">
                                <input type="checkbox" id="miningLayer" checked>
                                <span class="checkmark"></span>
                                Mining Sites
                            </label>
                            <div class="layer-opacity">
                                <input type="range" id="miningOpacity" min="0" max="1" step="0.1" value="1">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Visualization Controls -->
            <div class="control-panel draggable" id="visualPanel" data-panel="visualization">
                <div class="panel-header">
                    <span class="panel-title">Visualization</span>
                    <div class="panel-controls">
                        <button class="panel-btn" data-action="minimize">−</button>
                        <button class="panel-btn" data-action="close">×</button>
                    </div>
                </div>
                <div class="panel-content">
                    <div class="control-group">
                        <label class="control-label">
                            <input type="checkbox" id="xrayMode">
                            <span class="checkmark"></span>
                            X-ray Vision
                        </label>
                        <div class="slider-group">
                            <label>Opacity:</label>
                            <input type="range" id="xrayOpacity" min="0.1" max="1" step="0.1" value="0.3">
                        </div>
                    </div>

                    <div class="control-group">
                        <label>Lighting Intensity:</label>
                        <input type="range" id="lightingIntensity" min="0.1" max="3" step="0.1" value="1">
                    </div>

                    <div class="control-group">
                        <label>Material Quality:</label>
                        <select id="materialQuality">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high" selected>High</option>
                            <option value="ultra">Ultra</option>
                        </select>
                    </div>

                    <div class="control-group">
                        <label class="control-label">
                            <input type="checkbox" id="shadowsEnabled" checked>
                            <span class="checkmark"></span>
                            Shadows
                        </label>
                    </div>
                </div>
            </div>

            <!-- Cross Section Panel -->
            <div class="control-panel draggable" id="crossPanel" data-panel="crosssection">
                <div class="panel-header">
                    <span class="panel-title">Cross Section</span>
                    <div class="panel-controls">
                        <button class="panel-btn" data-action="minimize">−</button>
                        <button class="panel-btn" data-action="close">×</button>
                    </div>
                </div>
                <div class="panel-content">
                    <div class="control-group">
                        <label class="control-label">
                            <input type="checkbox" id="crossSectionEnabled">
                            <span class="checkmark"></span>
                            Enable Cross Section
                        </label>
                    </div>

                    <div class="slider-group">
                        <label>X Position: <span id="crossXValue">0</span></label>
                        <input type="range" id="crossSectionX" min="-50" max="50" value="0">
                    </div>

                    <div class="slider-group">
                        <label>Z Position: <span id="crossZValue">0</span></label>
                        <input type="range" id="crossSectionZ" min="-50" max="50" value="0">
                    </div>

                    <div class="slider-group">
                        <label>Rotation: <span id="crossRotValue">0°</span></label>
                        <input type="range" id="crossSectionRotation" min="0" max="360" value="0">
                    </div>
                </div>
            </div>

            <!-- Advanced Settings Panel -->
            <div class="control-panel draggable" id="settingsPanel" data-panel="settings" style="display: none;">
                <div class="panel-header">
                    <span class="panel-title">Advanced Settings</span>
                    <div class="panel-controls">
                        <button class="panel-btn" data-action="minimize">−</button>
                        <button class="panel-btn" data-action="close">×</button>
                    </div>
                </div>
                <div class="panel-content">
                    <div class="settings-tabs">
                        <button class="tab-btn active" data-tab="rendering">Rendering</button>
                        <button class="tab-btn" data-tab="navigation">Navigation</button>
                        <button class="tab-btn" data-tab="data">Data</button>
                    </div>
                    
                    <div class="tab-content" id="renderingTab">
                        <div class="control-group">
                            <label>Render Quality:</label>
                            <select id="renderQuality">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high" selected>High</option>
                                <option value="ultra">Ultra</option>
                            </select>
                        </div>
                        
                        <div class="control-group">
                            <label class="control-label">
                                <input type="checkbox" id="antialiasingEnabled" checked>
                                <span class="checkmark"></span>
                                Anti-aliasing
                            </label>
                        </div>

                        <div class="control-group">
                            <label class="control-label">
                                <input type="checkbox" id="lodEnabled" checked>
                                <span class="checkmark"></span>
                                Level of Detail
                            </label>
                        </div>
                    </div>

                    <div class="tab-content" id="navigationTab" style="display: none;">
                        <div class="slider-group">
                            <label>Mouse Sensitivity: <span id="mouseSensValue">1.0</span></label>
                            <input type="range" id="mouseSensitivity" min="0.1" max="3" step="0.1" value="1">
                        </div>

                        <div class="slider-group">
                            <label>Zoom Speed: <span id="zoomSpeedValue">1.0</span></label>
                            <input type="range" id="zoomSpeed" min="0.1" max="3" step="0.1" value="1">
                        </div>

                        <div class="control-group">
                            <label class="control-label">
                                <input type="checkbox" id="autoRotate">
                                <span class="checkmark"></span>
                                Auto Rotate
                            </label>
                        </div>
                    </div>

                    <div class="tab-content" id="dataTab" style="display: none;">
                        <div class="control-group">
                            <label class="control-label">
                                <input type="checkbox" id="autoLoad" checked>
                                <span class="checkmark"></span>
                                Auto Load Data
                            </label>
                        </div>

                        <div class="control-group">
                            <button class="action-btn" id="exportSettings">Export Settings</button>
                            <button class="action-btn" id="importSettings">Import Settings</button>
                            <button class="action-btn danger" id="resetSettings">Reset to Default</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Status and Info System -->
            <div class="status-system">
                <div class="status-bar">
                    <div class="status-section">
                        <span id="fpsCounter">FPS: --</span>
                        <span id="polyCount">Polygons: --</span>
                    </div>
                    <div class="status-section">
                        <span id="cameraPosition">Camera: (0, 0, 0)</span>
                    </div>
                    <div class="status-section">
                        <span id="systemStatus">System: Ready</span>
                    </div>
                </div>
                
                <div class="depth-indicator">
                    <div class="depth-scale">
                        <div class="depth-marker" data-depth="0">Surface</div>
                        <div class="depth-marker" data-depth="-100">-100m</div>
                        <div class="depth-marker" data-depth="-200">-200m</div>
                        <div class="depth-marker" data-depth="-400">-400m</div>
                    </div>
                    <div class="current-depth" id="currentDepth">0m</div>
                </div>
            </div>
        `;

        document.body.appendChild(container);
        this.addUIStyles();
    }

    addUIStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .ui-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1000;
                font-family: 'Segoe UI', Arial, sans-serif;
            }

            .menu-bar {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 40px;
                background: rgba(20, 20, 20, 0.95);
                border-bottom: 1px solid #333;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 20px;
                pointer-events: auto;
            }

            .menu-group {
                display: flex;
                gap: 10px;
            }

            .menu-btn {
                background: none;
                border: none;
                color: #fff;
                padding: 8px 16px;
                cursor: pointer;
                border-radius: 4px;
                transition: background 0.2s;
            }

            .menu-btn:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .menu-title {
                color: #ff6600;
                font-weight: bold;
                font-size: 14px;
            }

            .menu-controls {
                display: flex;
                gap: 5px;
            }

            .icon-btn {
                background: none;
                border: none;
                color: #fff;
                padding: 8px;
                cursor: pointer;
                border-radius: 4px;
                font-size: 16px;
                transition: background 0.2s;
            }

            .icon-btn:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .control-panel {
                position: absolute;
                background: rgba(0, 0, 0, 0.9);
                border: 1px solid #333;
                border-radius: 8px;
                min-width: 250px;
                max-width: 350px;
                pointer-events: auto;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            }

            .panel-header {
                background: rgba(255, 102, 0, 0.8);
                padding: 12px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
                border-radius: 8px 8px 0 0;
            }

            .panel-title {
                color: white;
                font-weight: bold;
                font-size: 14px;
            }

            .panel-controls {
                display: flex;
                gap: 5px;
            }

            .panel-btn {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 3px;
                font-size: 14px;
                transition: background 0.2s;
            }

            .panel-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .panel-content {
                padding: 16px;
                color: white;
            }

            .layer-item, .control-group {
                margin-bottom: 16px;
                padding-bottom: 12px;
                border-bottom: 1px solid #333;
            }

            .layer-item:last-child, .control-group:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }

            .layer-label, .control-label {
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
                margin-bottom: 8px;
            }

            .checkmark {
                width: 20px;
                height: 20px;
                background: #333;
                border-radius: 3px;
                position: relative;
                border: 1px solid #555;
            }

            input[type="checkbox"]:checked + .checkmark {
                background: #ff6600;
            }

            input[type="checkbox"]:checked + .checkmark::after {
                content: '✓';
                position: absolute;
                color: white;
                font-size: 14px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            input[type="checkbox"] {
                display: none;
            }

            .layer-opacity, .slider-group {
                margin-top: 8px;
            }

            .slider-group label {
                display: block;
                margin-bottom: 6px;
                font-size: 12px;
                color: #ccc;
            }

            input[type="range"] {
                width: 100%;
                height: 6px;
                background: #333;
                border-radius: 3px;
                outline: none;
                -webkit-appearance: none;
            }

            input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                width: 16px;
                height: 16px;
                background: #ff6600;
                border-radius: 50%;
                cursor: pointer;
            }

            select {
                width: 100%;
                padding: 8px;
                background: #333;
                border: 1px solid #555;
                border-radius: 4px;
                color: white;
                font-size: 13px;
            }

            .settings-tabs {
                display: flex;
                margin-bottom: 16px;
                border-bottom: 1px solid #333;
            }

            .tab-btn {
                background: none;
                border: none;
                color: #ccc;
                padding: 10px 16px;
                cursor: pointer;
                border-bottom: 2px solid transparent;
                transition: all 0.2s;
            }

            .tab-btn.active {
                color: #ff6600;
                border-bottom-color: #ff6600;
            }

            .action-btn {
                width: 100%;
                padding: 10px;
                margin-bottom: 8px;
                background: #333;
                border: 1px solid #555;
                border-radius: 4px;
                color: white;
                cursor: pointer;
                transition: background 0.2s;
            }

            .action-btn:hover {
                background: #444;
            }

            .action-btn.danger {
                background: #cc3333;
                border-color: #aa2222;
            }

            .action-btn.danger:hover {
                background: #dd4444;
            }

            .status-system {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                pointer-events: auto;
            }

            .status-bar {
                background: rgba(0, 0, 0, 0.9);
                padding: 8px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                color: #ccc;
                border-top: 1px solid #333;
            }

            .status-section {
                display: flex;
                gap: 20px;
            }

            .depth-indicator {
                position: absolute;
                right: 20px;
                bottom: 60px;
                width: 60px;
                height: 200px;
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid #333;
                border-radius: 6px;
                padding: 10px;
            }

            .depth-scale {
                height: 100%;
                position: relative;
                border-left: 2px solid #ff6600;
                margin-left: 10px;
            }

            .depth-marker {
                position: absolute;
                left: 8px;
                font-size: 10px;
                color: #ccc;
                white-space: nowrap;
            }

            .current-depth {
                position: absolute;
                bottom: -25px;
                left: 0;
                right: 0;
                text-align: center;
                font-size: 12px;
                color: #ff6600;
                font-weight: bold;
            }

            /* Panel positioning */
            #layerPanel { top: 60px; left: 20px; }
            #visualPanel { top: 60px; right: 20px; }
            #crossPanel { top: 300px; left: 20px; }
            #settingsPanel { top: 100px; left: 50%; transform: translateX(-50%); }

            /* Dragging states */
            .dragging {
                opacity: 0.8;
                transform: rotate(2deg);
                z-index: 9999;
            }

            .drop-zone {
                border: 2px dashed #ff6600;
                background: rgba(255, 102, 0, 0.1);
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Settings panel toggle
        document.getElementById('settingsBtn').addEventListener('click', () => {
            const panel = document.getElementById('settingsPanel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Layer controls
        this.setupLayerControls();
        this.setupVisualizationControls();
        this.setupCrossSectionControls();
        this.setupAdvancedControls();
    }

    setupLayerControls() {
        // Layer visibility toggles
        document.getElementById('terrainLayer').addEventListener('change', (e) => {
            this.settings.set('layers', 'terrain', e.target.checked);
        });

        document.getElementById('satelliteLayer').addEventListener('change', (e) => {
            this.settings.set('layers', 'satellite', e.target.checked);
        });

        document.getElementById('geologyLayer').addEventListener('change', (e) => {
            this.settings.set('layers', 'geology', e.target.checked);
        });

        document.getElementById('miningLayer').addEventListener('change', (e) => {
            this.settings.set('layers', 'miningSites', e.target.checked);
        });

        // Opacity controls
        document.getElementById('terrainOpacity').addEventListener('input', (e) => {
            window.bendigoApp?.updateLayerOpacity('terrain', parseFloat(e.target.value));
        });

        document.getElementById('satelliteOpacity').addEventListener('input', (e) => {
            window.bendigoApp?.updateLayerOpacity('satellite', parseFloat(e.target.value));
        });
    }

    setupVisualizationControls() {
        document.getElementById('xrayMode').addEventListener('change', (e) => {
            this.settings.set('visualization', 'xrayMode', e.target.checked);
        });

        document.getElementById('xrayOpacity').addEventListener('input', (e) => {
            this.settings.set('visualization', 'xrayOpacity', parseFloat(e.target.value));
        });

        document.getElementById('lightingIntensity').addEventListener('input', (e) => {
            window.bendigoApp?.updateLighting(parseFloat(e.target.value));
        });

        document.getElementById('shadowsEnabled').addEventListener('change', (e) => {
            this.settings.set('rendering', 'shadows', e.target.checked);
        });
    }

    setupCrossSectionControls() {
        const updateCrossSection = () => {
            const x = parseFloat(document.getElementById('crossSectionX').value);
            const z = parseFloat(document.getElementById('crossSectionZ').value);
            const rotation = parseFloat(document.getElementById('crossSectionRotation').value);
            
            document.getElementById('crossXValue').textContent = x;
            document.getElementById('crossZValue').textContent = z;
            document.getElementById('crossRotValue').textContent = rotation + '°';
            
            window.bendigoApp?.updateCrossSection(x, z, rotation);
        };

        document.getElementById('crossSectionEnabled').addEventListener('change', (e) => {
            window.bendigoApp?.toggleCrossSection(e.target.checked);
        });

        document.getElementById('crossSectionX').addEventListener('input', updateCrossSection);
        document.getElementById('crossSectionZ').addEventListener('input', updateCrossSection);
        document.getElementById('crossSectionRotation').addEventListener('input', updateCrossSection);
    }

    setupAdvancedControls() {
        // Settings management
        document.getElementById('exportSettings').addEventListener('click', () => {
            const settings = this.settings.export();
            this.downloadFile('bendigo-settings.json', settings);
        });

        document.getElementById('resetSettings').addEventListener('click', () => {
            if (confirm('Reset all settings to default? This cannot be undone.')) {
                this.settings.reset();
                this.updateUIFromSettings();
            }
        });
    }

    setupDragAndDrop() {
        document.querySelectorAll('.draggable').forEach(panel => {
            const header = panel.querySelector('.panel-header');
            
            header.addEventListener('mousedown', (e) => {
                this.startDrag(panel, e);
            });
        });

        document.addEventListener('mousemove', (e) => {
            if (this.dragState) {
                this.updateDrag(e);
            }
        });

        document.addEventListener('mouseup', () => {
            this.endDrag();
        });
    }

    startDrag(panel, e) {
        this.dragState = {
            panel: panel,
            offsetX: e.clientX - panel.offsetLeft,
            offsetY: e.clientY - panel.offsetTop
        };
        
        panel.classList.add('dragging');
        e.preventDefault();
    }

    updateDrag(e) {
        if (!this.dragState) return;
        
        const x = e.clientX - this.dragState.offsetX;
        const y = e.clientY - this.dragState.offsetY;
        
        this.dragState.panel.style.left = Math.max(0, Math.min(window.innerWidth - 250, x)) + 'px';
        this.dragState.panel.style.top = Math.max(40, Math.min(window.innerHeight - 100, y)) + 'px';
    }

    endDrag() {
        if (this.dragState) {
            this.dragState.panel.classList.remove('dragging');
            this.dragState = null;
        }
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName + 'Tab').style.display = 'block';
    }

    updateUIFromSettings() {
        const settings = this.settings.settings;
        
        // Update checkboxes and sliders from settings
        document.getElementById('terrainLayer').checked = settings.layers.terrain;
        document.getElementById('satelliteLayer').checked = settings.layers.satellite;
        document.getElementById('geologyLayer').checked = settings.layers.geology;
        document.getElementById('miningLayer').checked = settings.layers.miningSites;
        document.getElementById('xrayMode').checked = settings.visualization.xrayMode;
        document.getElementById('shadowsEnabled').checked = settings.rendering.shadows;
        
        // Update sliders
        document.getElementById('xrayOpacity').value = settings.visualization.xrayOpacity;
        document.getElementById('lightingIntensity').value = settings.visualization.lightingIntensity;
    }

    updateStatus(message) {
        document.getElementById('systemStatus').textContent = `System: ${message}`;
    }

    updateFPS(fps) {
        document.getElementById('fpsCounter').textContent = `FPS: ${Math.round(fps)}`;
    }

    updatePolygonCount(count) {
        document.getElementById('polyCount').textContent = `Polygons: ${count.toLocaleString()}`;
    }

    updateCameraPosition(x, y, z) {
        document.getElementById('cameraPosition').textContent = 
            `Camera: (${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)})`;
    }

    updateDepth(depth) {
        document.getElementById('currentDepth').textContent = `${Math.round(depth)}m`;
    }

    handleInterfaceChanges(key, value, allSettings) {
        if (key === 'theme') {
            this.applyTheme(value);
        }
    }

    downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    createContextMenus() {
        // Future enhancement: right-click context menus
    }

    createStatusSystem() {
        // Status system already created in createControlPanels
    }

    createMenuSystem() {
        // Menu system already created in createControlPanels
    }

    createToolbar() {
        // Toolbar already created in createControlPanels
    }
}

window.UIManager = UIManager;