/**
 * Professional 3D Geo-Interfacing Viewport
 * Core 3D rendering engine for geospatial data visualization
 */

class GeoViewport {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.coordinateSystem = 'local-xyz'; // Future: support for geospatial projections
        
        this.init();
        this.setupEventHandlers();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x2a2a2a);
        this.scene.fog = new THREE.Fog(0x2a2a2a, 50, 200);

        // Camera configuration for geospatial work
        this.camera = new THREE.PerspectiveCamera(
            60, 
            this.container.clientWidth / this.container.clientHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(50, 30, 50);

        // High-performance renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: false,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        this.container.appendChild(this.renderer.domElement);

        // Professional camera controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 500;
        this.controls.maxPolarAngle = Math.PI / 2;

        // Professional lighting setup
        this.setupLighting();
        
        // Coordinate system visualization
        this.setupCoordinateSystem();
    }

    setupLighting() {
        // Ambient lighting for overall scene illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);

        // Directional light for shadows and definition
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 25);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        this.scene.add(directionalLight);

        // Hemisphere light for natural outdoor illumination
        const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x8B4513, 0.4);
        this.scene.add(hemisphereLight);
    }

    setupCoordinateSystem() {
        // Professional coordinate system axes
        const axesHelper = new THREE.AxesHelper(10);
        axesHelper.position.set(0, 0.1, 0);
        this.scene.add(axesHelper);

        // Grid for spatial reference
        const gridHelper = new THREE.GridHelper(100, 50, 0x888888, 0x444444);
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.3;
        this.scene.add(gridHelper);
    }

    setupEventHandlers() {
        // Responsive design
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Mouse interaction for future raycasting
        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.renderer.domElement.addEventListener('click', this.onMouseClick.bind(this));
        
        // Keyboard shortcuts for professional workflow
        document.addEventListener('keydown', this.onKeyDown.bind(this));
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    onMouseMove(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    onMouseClick(event) {
        // Raycasting for object interaction
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
            this.handleObjectSelection(intersects[0]);
        }
    }

    onKeyDown(event) {
        switch(event.code) {
            case 'KeyF':
                this.focusOnTerrain();
                break;
            case 'KeyR':
                this.resetCamera();
                break;
            case 'KeyG':
                this.toggleGrid();
                break;
        }
    }

    handleObjectSelection(intersection) {
        const object = intersection.object;
        if (object.userData.interactive) {
            console.log('Selected object:', object.userData);
            // Future: Emit event for UI interaction
        }
    }

    focusOnTerrain() {
        if (this.terrain) {
            const box = new THREE.Box3().setFromObject(this.terrain);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = this.camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));
            
            this.camera.position.set(center.x + 30, center.y + 20, center.z + cameraZ * 0.6);
            this.controls.target.copy(center);
            this.controls.update();
        }
    }

    resetCamera() {
        this.camera.position.set(50, 30, 50);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    }

    toggleGrid() {
        const grid = this.scene.getObjectByName('GridHelper');
        if (grid) {
            grid.visible = !grid.visible;
        }
    }

    addTerrain(terrain) {
        if (this.terrain) {
            this.scene.remove(this.terrain);
        }
        this.terrain = terrain;
        this.scene.add(terrain);
    }

    addGeographicalData(dataObject) {
        // Future: Handle various geospatial data types
        this.scene.add(dataObject);
    }

    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.controls) {
            this.controls.dispose();
        }
    }
}