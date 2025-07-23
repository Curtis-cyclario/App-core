/**
 * Advanced Analysis Tools Module
 * Professional geological analysis and measurement tools
 */

class AnalysisTools {
    constructor(scene, camera, renderer, settings) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.settings = settings;
        this.tools = {
            measurement: new MeasurementTool(scene, camera),
            profiling: new ProfileTool(scene, camera),
            sampling: new SamplingTool(scene, camera),
            analysis: new GeologicalAnalysis(scene)
        };
        this.activeTool = null;
        this.init();
    }

    init() {
        this.setupToolEventListeners();
        this.createToolUI();
    }

    setupToolEventListeners() {
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'KeyM':
                    this.activateTool('measurement');
                    break;
                case 'KeyP':
                    this.activateTool('profiling');
                    break;
                case 'KeyA':
                    this.activateTool('analysis');
                    break;
                case 'Escape':
                    this.deactivateAllTools();
                    break;
            }
        });
    }

    activateTool(toolName) {
        this.deactivateAllTools();
        this.activeTool = toolName;
        this.tools[toolName].activate();
        this.updateToolUI(toolName);
    }

    deactivateAllTools() {
        Object.values(this.tools).forEach(tool => tool.deactivate());
        this.activeTool = null;
        this.updateToolUI(null);
    }

    createToolUI() {
        const toolPanel = document.createElement('div');
        toolPanel.className = 'analysis-tools-panel';
        toolPanel.innerHTML = `
            <div class="tool-header">Analysis Tools</div>
            <div class="tool-buttons">
                <button class="tool-btn" data-tool="measurement">Measure (M)</button>
                <button class="tool-btn" data-tool="profiling">Profile (P)</button>
                <button class="tool-btn" data-tool="sampling">Sample</button>
                <button class="tool-btn" data-tool="analysis">Analyze (A)</button>
            </div>
            <div class="tool-results" id="toolResults"></div>
        `;

        toolPanel.style.cssText = `
            position: fixed;
            top: 200px;
            right: 20px;
            width: 200px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #333;
            border-radius: 8px;
            padding: 16px;
            color: white;
            font-size: 14px;
            z-index: 1000;
        `;

        document.body.appendChild(toolPanel);

        // Tool button event listeners
        toolPanel.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tool = e.target.dataset.tool;
                if (this.activeTool === tool) {
                    this.deactivateAllTools();
                } else {
                    this.activateTool(tool);
                }
            });
        });
    }

    updateToolUI(activeTool) {
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === activeTool);
        });
    }

    getResultsPanel() {
        return document.getElementById('toolResults');
    }
}

class MeasurementTool {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.isActive = false;
        this.measurementPoints = [];
        this.measurementLines = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    activate() {
        this.isActive = true;
        document.addEventListener('click', this.onMouseClick.bind(this));
        document.body.style.cursor = 'crosshair';
    }

    deactivate() {
        this.isActive = false;
        document.removeEventListener('click', this.onMouseClick.bind(this));
        document.body.style.cursor = 'default';
        this.clearMeasurements();
    }

    onMouseClick(event) {
        if (!this.isActive) return;

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            const point = intersects[0].point;
            this.addMeasurementPoint(point);
        }
    }

    addMeasurementPoint(point) {
        // Create point marker
        const geometry = new THREE.SphereGeometry(0.2, 8, 6);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const marker = new THREE.Mesh(geometry, material);
        marker.position.copy(point);
        
        this.scene.add(marker);
        this.measurementPoints.push({ point: point, marker: marker });

        // If we have two points, create measurement line
        if (this.measurementPoints.length === 2) {
            this.createMeasurementLine();
        }
    }

    createMeasurementLine() {
        const point1 = this.measurementPoints[0].point;
        const point2 = this.measurementPoints[1].point;
        
        const geometry = new THREE.BufferGeometry().setFromPoints([point1, point2]);
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const line = new THREE.Line(geometry, material);
        
        this.scene.add(line);
        this.measurementLines.push(line);

        // Calculate distance
        const distance = point1.distanceTo(point2);
        this.displayMeasurement(distance, point1, point2);

        // Reset for next measurement
        this.measurementPoints = [];
    }

    displayMeasurement(distance, point1, point2) {
        const resultsPanel = document.getElementById('toolResults');
        resultsPanel.innerHTML = `
            <div class="measurement-result">
                <strong>Distance:</strong> ${distance.toFixed(2)}m<br>
                <strong>3D Coordinates:</strong><br>
                P1: (${point1.x.toFixed(1)}, ${point1.y.toFixed(1)}, ${point1.z.toFixed(1)})<br>
                P2: (${point2.x.toFixed(1)}, ${point2.y.toFixed(1)}, ${point2.z.toFixed(1)})
            </div>
        `;
    }

    clearMeasurements() {
        this.measurementPoints.forEach(({ marker }) => {
            this.scene.remove(marker);
        });
        this.measurementLines.forEach(line => {
            this.scene.remove(line);
        });
        this.measurementPoints = [];
        this.measurementLines = [];
    }
}

class ProfileTool {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.isActive = false;
        this.profilePoints = [];
    }

    activate() {
        this.isActive = true;
        document.addEventListener('click', this.onMouseClick.bind(this));
    }

    deactivate() {
        this.isActive = false;
        document.removeEventListener('click', this.onMouseClick.bind(this));
        this.clearProfile();
    }

    onMouseClick(event) {
        // Profile tool implementation
    }

    clearProfile() {
        // Clear profile visualization
    }
}

class SamplingTool {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.isActive = false;
        this.samples = [];
    }

    activate() {
        this.isActive = true;
        document.addEventListener('click', this.onMouseClick.bind(this));
    }

    deactivate() {
        this.isActive = false;
        document.removeEventListener('click', this.onMouseClick.bind(this));
    }

    onMouseClick(event) {
        // Sampling tool implementation
    }
}

class GeologicalAnalysis {
    constructor(scene) {
        this.scene = scene;
        this.isActive = false;
    }

    activate() {
        this.isActive = true;
        this.performAnalysis();
    }

    deactivate() {
        this.isActive = false;
    }

    performAnalysis() {
        const resultsPanel = document.getElementById('toolResults');
        
        // Analyze scene objects
        let geologicalObjects = 0;
        let miningObjects = 0;
        let drillHoles = 0;

        this.scene.traverse(obj => {
            if (obj.userData.layer === 'geology') geologicalObjects++;
            if (obj.userData.layer === 'mining-sites') miningObjects++;
            if (obj.userData.layer === 'drill-holes') drillHoles++;
        });

        resultsPanel.innerHTML = `
            <div class="analysis-results">
                <h4>Scene Analysis</h4>
                <p>Geological Objects: ${geologicalObjects}</p>
                <p>Mining Sites: ${miningObjects}</p>
                <p>Drill Holes: ${drillHoles}</p>
                <h4>Recommendations</h4>
                <p>• Focus exploration in high-grade zones</p>
                <p>• Consider structural controls</p>
                <p>• Review historical production data</p>
            </div>
        `;
    }
}

window.AnalysisTools = AnalysisTools;