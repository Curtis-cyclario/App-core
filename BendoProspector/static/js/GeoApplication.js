/**
 * Professional 3D Geo-Interfacing Application
 * Main application controller for geological data visualization
 */

class GeoApplication {
    constructor() {
        this.viewport = null;
        this.terrainEngine = null;
        this.geospatialData = null;
        this.ui = null;
        this.activeTool = null;
        this.performanceMonitor = null;
        
        this.init();
    }

    async init() {
        try {
            // Initialize core systems
            this.viewport = new GeoViewport('viewport-container');
            this.terrainEngine = new TerrainEngine();
            this.geospatialData = new GeospatialData(this.viewport.scene);
            this.ui = new ProfessionalUI(this);
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Start render loop
            this.startRenderLoop();
            
            // Load default terrain
            await this.loadDefaultTerrain();
            
            this.ui.showMessage('3D Geo Interface initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.handleError('Initialization failed', error);
        }
    }

    async loadDefaultTerrain() {
        try {
            this.ui.showMessage('Loading geological terrain...');
            
            const terrain = this.terrainEngine.generateTerrain({
                width: 100,
                height: 100,
                widthSegments: 128,
                heightSegments: 128,
                heightScale: 10,
                materialType: 'geological'
            });
            
            this.viewport.addTerrain(terrain);
            this.viewport.focusOnTerrain();
            
            this.ui.showMessage('Geological terrain loaded successfully');
            this.updateDataSummary();
            
        } catch (error) {
            this.handleError('Failed to load terrain', error);
        }
    }

    async loadTerrain(config = null) {
        try {
            this.ui.showMessage('Loading terrain data...');
            
            // Try to load DXF geological data first
            const response = await fetch('/api/dxf/parse');
            const dxfData = await response.json();
            
            const terrainConfig = config || {
                width: 100,
                height: 100,
                widthSegments: 256,
                heightSegments: 256,
                heightScale: 10,
                materialType: 'geological'
            };
            
            const terrain = this.terrainEngine.generateTerrain(terrainConfig);
            this.viewport.addTerrain(terrain);
            
            this.ui.showMessage(`Terrain loaded with ${dxfData.entities || 0} geological entities`);
            this.updateDataSummary();
            
        } catch (error) {
            this.handleError('Failed to load terrain', error);
        }
    }

    async loadGeologicalData() {
        try {
            this.ui.showMessage('Loading geological formations...');
            
            const data = await this.geospatialData.loadGeologicalData();
            
            this.ui.showMessage(`Loaded ${Object.keys(data.formations || {}).length} geological formations`);
            this.updateDataSummary();
            
        } catch (error) {
            this.handleError('Failed to load geological data', error);
        }
    }

    async loadDrillHoles() {
        try {
            this.ui.showMessage('Loading drill hole data...');
            
            const response = await fetch('/api/geological-data');
            const data = await response.json();
            
            if (data.drill_holes) {
                this.geospatialData.visualizeDrillHoles(data.drill_holes);
                this.ui.showMessage(`Loaded ${data.drill_holes.length} drill holes`);
            }
            
            this.updateDataSummary();
            
        } catch (error) {
            this.handleError('Failed to load drill holes', error);
        }
    }

    async loadStructures() {
        try {
            this.ui.showMessage('Loading geological structures...');
            
            const response = await fetch('/api/geological-data');
            const data = await response.json();
            
            if (data.geological_structures) {
                this.geospatialData.visualizeStructures(data.geological_structures);
                this.ui.showMessage('Geological structures loaded');
            }
            
            this.updateDataSummary();
            
        } catch (error) {
            this.handleError('Failed to load structures', error);
        }
    }

    setLayerVisibility(layerName, visible) {
        // Convert UI layer names to internal layer names
        const layerMap = {
            'Base Terrain': 'terrain',
            'Drill Holes': 'drill_holes',
            'Formations': 'geological_formations',
            'Structures': 'structures'
        };
        
        const internalLayerName = layerMap[layerName] || layerName.toLowerCase().replace(' ', '_');
        
        if (this.geospatialData) {
            this.geospatialData.setLayerVisibility(internalLayerName, visible);
        }
        
        // Handle terrain visibility
        if (layerName === 'Base Terrain' && this.viewport.terrain) {
            this.viewport.terrain.visible = visible;
        }
        
        this.ui.showMessage(`${layerName} ${visible ? 'shown' : 'hidden'}`);
    }

    activateTool(toolId) {
        // Deactivate current tool
        if (this.activeTool) {
            this.deactivateTool(this.activeTool);
        }
        
        this.activeTool = toolId;
        
        switch(toolId) {
            case 'measure':
            case 'distance':
                this.setupMeasurementTool();
                break;
            case 'cross-section':
                this.setupCrossSectionTool();
                break;
            case 'area':
                this.setupAreaTool();
                break;
            case 'elevation':
                this.setupElevationTool();
                break;
            case 'volume':
                this.setupVolumeTool();
                break;
        }
    }

    deactivateTool(toolId) {
        // Clean up tool-specific event listeners and UI elements
        this.activeTool = null;
    }

    setupMeasurementTool() {
        // Implementation for distance measurement
        this.ui.showMessage('Click two points to measure distance');
    }

    setupCrossSectionTool() {
        // Implementation for cross-section analysis
        this.ui.showMessage('Click and drag to create cross-section line');
    }

    setupAreaTool() {
        // Implementation for area calculation
        this.ui.showMessage('Click points to define area boundary');
    }

    setupElevationTool() {
        // Implementation for elevation profile
        this.ui.showMessage('Click points to create elevation profile');
    }

    setupVolumeTool() {
        // Implementation for volume calculation
        this.ui.showMessage('Define volume boundary for calculation');
    }

    setupPerformanceMonitoring() {
        this.performanceMonitor = {
            frameCount: 0,
            lastTime: Date.now(),
            fps: 0,
            polygonCount: 0
        };
        
        setInterval(() => {
            const now = Date.now();
            this.performanceMonitor.fps = Math.round(
                (this.performanceMonitor.frameCount * 1000) / (now - this.performanceMonitor.lastTime)
            );
            this.performanceMonitor.frameCount = 0;
            this.performanceMonitor.lastTime = now;
            
            // Update polygon count
            this.performanceMonitor.polygonCount = this.getScenePolygonCount();
            
            // Update UI
            this.ui.updatePerformanceInfo(
                this.performanceMonitor.fps,
                this.performanceMonitor.polygonCount
            );
        }, 1000);
    }

    getScenePolygonCount() {
        let polyCount = 0;
        this.viewport.scene.traverse((object) => {
            if (object.geometry) {
                if (object.geometry.index) {
                    polyCount += object.geometry.index.count / 3;
                } else if (object.geometry.attributes.position) {
                    polyCount += object.geometry.attributes.position.count / 3;
                }
            }
        });
        return Math.floor(polyCount);
    }

    startRenderLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Update performance counter
            this.performanceMonitor.frameCount++;
            
            // Render the scene
            this.viewport.render();
        };
        
        animate();
    }

    updateDataSummary() {
        const summary = {
            terrain: !!this.viewport.terrain,
            formations: this.geospatialData.getLayerObjects('geological_formations').length,
            drillHoles: this.geospatialData.getLayerObjects('drill_holes').length,
            structures: this.geospatialData.getLayerObjects('structures').length
        };
        
        this.ui.updateDataSummary(summary);
    }

    handleError(message, error) {
        console.error(message, error);
        this.ui.showMessage(`${message}: ${error.message}`, 'error');
    }

    dispose() {
        if (this.viewport) this.viewport.dispose();
        if (this.terrainEngine) this.terrainEngine.dispose();
        if (this.geospatialData) this.geospatialData.dispose();
        if (this.ui) this.ui.dispose();
    }
}