/**
 * Geospatial Data Handler
 * Professional geospatial data loading and visualization
 */

class GeospatialData {
    constructor(scene) {
        this.scene = scene;
        this.dataLayers = new Map();
        this.coordinateTransform = null; // Future: coordinate system transformations
    }

    /**
     * Load and visualize geological data
     */
    async loadGeologicalData(apiEndpoint = '/api/geological-data') {
        try {
            const response = await fetch(apiEndpoint);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            this.visualizeGeologicalFormations(data.formations);
            this.visualizeDrillHoles(data.drill_holes || []);
            this.visualizeStructures(data.geological_structures);
            
            return data;
        } catch (error) {
            console.error('Failed to load geological data:', error);
            throw error;
        }
    }

    /**
     * Visualize geological formations as 3D volumes
     */
    visualizeGeologicalFormations(formations) {
        Object.entries(formations).forEach(([name, formation]) => {
            if (formation.locations) {
                formation.locations.forEach((location, index) => {
                    const formationMesh = this.createFormationVisualization(
                        name, 
                        location, 
                        formation
                    );
                    
                    formationMesh.userData = {
                        type: 'geological_formation',
                        formation: name,
                        data: formation,
                        interactive: true
                    };
                    
                    this.scene.add(formationMesh);
                    this.addToLayer('geological_formations', formationMesh);
                });
            }
        });
    }

    createFormationVisualization(name, location, formation) {
        // Convert lat/lng to local coordinates (simplified)
        const x = (location.lng - 144.2755) * 1000; // Scale factor for visualization
        const z = -(location.lat + 36.7574) * 1000;
        const y = location.depth ? -location.depth / 10 : 0;

        const geometry = new THREE.CylinderGeometry(3, 5, 8, 12);
        const material = new THREE.MeshStandardMaterial({
            color: this.getFormationColor(name),
            transparent: true,
            opacity: 0.7,
            roughness: 0.8
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        
        return mesh;
    }

    getFormationColor(formationType) {
        const colors = {
            'ordovician_basement': 0x556B2F,
            'bendigo_formation': 0x8B4513,
            'quartz_reef_systems': 0xFFD700
        };
        return colors[formationType] || 0x808080;
    }

    /**
     * Visualize drill holes with geological intervals
     */
    visualizeDrillHoles(drillHoles) {
        drillHoles.forEach(hole => {
            const drillMesh = this.createDrillHoleVisualization(hole);
            drillMesh.userData = {
                type: 'drill_hole',
                data: hole,
                interactive: true
            };
            
            this.scene.add(drillMesh);
            this.addToLayer('drill_holes', drillMesh);
        });
    }

    createDrillHoleVisualization(hole) {
        const group = new THREE.Group();
        
        // Convert coordinates
        const x = (hole.coordinates.lng - 144.2755) * 1000;
        const z = -(hole.coordinates.lat + 36.7574) * 1000;
        
        // Main drill hole cylinder
        const holeGeometry = new THREE.CylinderGeometry(0.1, 0.1, hole.depth / 5, 8);
        const holeMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            transparent: true,
            opacity: 0.8
        });
        
        const holeMesh = new THREE.Mesh(holeGeometry, holeMaterial);
        holeMesh.position.set(x, -hole.depth / 10, z);
        group.add(holeMesh);
        
        // Visualize significant intervals
        if (hole.significant_intervals) {
            hole.significant_intervals.forEach(interval => {
                const intervalMesh = this.createIntervalVisualization(
                    interval, 
                    x, 
                    z, 
                    hole.depth
                );
                group.add(intervalMesh);
            });
        }
        
        // Collar marker
        const collarGeometry = new THREE.SphereGeometry(0.5, 8, 6);
        const collarMaterial = new THREE.MeshStandardMaterial({
            color: 0xFF6600,
            emissive: 0x221100
        });
        
        const collar = new THREE.Mesh(collarGeometry, collarMaterial);
        collar.position.set(x, 0.5, z);
        group.add(collar);
        
        return group;
    }

    createIntervalVisualization(interval, x, z, totalDepth) {
        const intervalHeight = (interval.to - interval.from) / 5;
        const intervalY = -(interval.from + interval.to) / 10;
        
        const geometry = new THREE.CylinderGeometry(0.3, 0.3, intervalHeight, 8);
        const material = new THREE.MeshStandardMaterial({
            color: this.getGradeColor(interval.grade),
            emissive: this.getGradeColor(interval.grade),
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.9
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, intervalY, z);
        
        mesh.userData = {
            type: 'drill_interval',
            interval: interval
        };
        
        return mesh;
    }

    getGradeColor(gradeString) {
        const grade = parseFloat(gradeString.match(/(\d+\.?\d*)/)[0]);
        
        if (grade > 15) return 0xFF0000; // High grade - red
        if (grade > 10) return 0xFF6600; // Medium-high grade - orange
        if (grade > 5) return 0xFFFF00;  // Medium grade - yellow
        return 0x00FF00; // Low grade - green
    }

    /**
     * Visualize geological structures (faults, anticlines, etc.)
     */
    visualizeStructures(structures) {
        if (structures.faults) {
            structures.faults.forEach(fault => {
                const faultMesh = this.createFaultVisualization(fault);
                this.scene.add(faultMesh);
                this.addToLayer('structures', faultMesh);
            });
        }
    }

    createFaultVisualization(fault) {
        const geometry = new THREE.PlaneGeometry(
            parseFloat(fault.length.replace('km', '')) * 2, 
            20
        );
        const material = new THREE.MeshBasicMaterial({
            color: 0xFF0000,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.y = 0.1;
        
        mesh.userData = {
            type: 'fault',
            data: fault,
            interactive: true
        };
        
        return mesh;
    }

    /**
     * Layer management for data organization
     */
    addToLayer(layerName, object) {
        if (!this.dataLayers.has(layerName)) {
            this.dataLayers.set(layerName, []);
        }
        this.dataLayers.get(layerName).push(object);
    }

    setLayerVisibility(layerName, visible) {
        const layer = this.dataLayers.get(layerName);
        if (layer) {
            layer.forEach(object => {
                object.visible = visible;
            });
        }
    }

    getLayerObjects(layerName) {
        return this.dataLayers.get(layerName) || [];
    }

    getAllLayers() {
        return Array.from(this.dataLayers.keys());
    }

    /**
     * Future: GeoJSON support
     */
    async loadGeoJSON(url) {
        try {
            const response = await fetch(url);
            const geoJSON = await response.json();
            
            // TODO: Implement GeoJSON parsing and visualization
            console.log('GeoJSON data loaded:', geoJSON);
            
            return geoJSON;
        } catch (error) {
            console.error('Failed to load GeoJSON:', error);
            throw error;
        }
    }

    dispose() {
        this.dataLayers.forEach(layer => {
            layer.forEach(object => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) object.material.dispose();
                this.scene.remove(object);
            });
        });
        this.dataLayers.clear();
    }
}