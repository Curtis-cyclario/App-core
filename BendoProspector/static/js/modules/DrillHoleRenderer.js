/**
 * Drill Hole Visualization Module
 * Professional drilling data visualization with geological context
 */

class DrillHoleRenderer {
    constructor(scene, settings) {
        this.scene = scene;
        this.settings = settings;
        this.drillHoles = [];
        this.drillHoleMeshes = [];
        this.visible = true;
        this.init();
    }

    async init() {
        await this.loadDrillHoleData();
        this.settings.onChange('layers', this.handleLayerChanges.bind(this));
    }

    async loadDrillHoleData() {
        try {
            const response = await fetch('/api/drill-holes');
            const data = await response.json();
            
            if (data.status === 'available') {
                this.drillHoles = data.drill_holes;
                this.createDrillHoleVisualization();
                console.log(`Loaded ${data.total_holes} drill holes`);
            }
        } catch (error) {
            console.warn('Drill hole data unavailable');
            this.createSampleDrillHoles();
        }
    }

    createDrillHoleVisualization() {
        this.drillHoles.forEach(hole => {
            this.createDrillHoleMesh(hole);
        });
    }

    createDrillHoleMesh(hole) {
        // Create drill hole collar (surface position)
        const collarGeometry = new THREE.SphereGeometry(0.3, 8, 6);
        const collarMaterial = new THREE.MeshStandardMaterial({
            color: 0xFF4444,
            emissive: 0x220000,
            emissiveIntensity: 0.3,
            metalness: 0.4,
            roughness: 0.6
        });
        
        const collar = new THREE.Mesh(collarGeometry, collarMaterial);
        collar.position.set(
            hole.coordinates.x,
            hole.coordinates.y,
            hole.coordinates.z
        );
        collar.castShadow = true;
        collar.userData = {
            layer: 'drill-holes',
            type: 'collar',
            hole_id: hole.hole_id,
            depth: hole.depth,
            purpose: hole.purpose
        };

        this.scene.add(collar);
        this.drillHoleMeshes.push(collar);

        // Create drill hole trace (showing depth)
        this.createDrillTrace(hole);
        
        // Create lithology visualization
        this.createLithologyVisualization(hole);
    }

    createDrillTrace(hole) {
        const traceGeometry = new THREE.CylinderGeometry(0.05, 0.05, hole.depth, 6);
        const traceMaterial = new THREE.MeshBasicMaterial({
            color: 0x666666,
            transparent: true,
            opacity: 0.6
        });

        const trace = new THREE.Mesh(traceGeometry, traceMaterial);
        trace.position.set(
            hole.coordinates.x,
            hole.coordinates.y - hole.depth/2,
            hole.coordinates.z
        );
        trace.userData = {
            layer: 'drill-holes',
            type: 'trace',
            hole_id: hole.hole_id
        };

        this.scene.add(trace);
        this.drillHoleMeshes.push(trace);
    }

    createLithologyVisualization(hole) {
        if (!hole.lithology) return;

        hole.lithology.forEach(interval => {
            const thickness = interval.to_depth - interval.from_depth;
            const midDepth = (interval.from_depth + interval.to_depth) / 2;

            const geometry = new THREE.CylinderGeometry(0.2, 0.2, thickness, 8);
            const material = new THREE.MeshStandardMaterial({
                color: this.getLithologyColor(interval.lithology),
                transparent: true,
                opacity: 0.8
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                hole.coordinates.x + 0.5, // Offset for visibility
                hole.coordinates.y - midDepth,
                hole.coordinates.z
            );
            mesh.userData = {
                layer: 'drill-holes',
                type: 'lithology',
                hole_id: hole.hole_id,
                formation: interval.lithology,
                depth_interval: `${interval.from_depth}m - ${interval.to_depth}m`
            };

            this.scene.add(mesh);
            this.drillHoleMeshes.push(mesh);
        });
    }

    getLithologyColor(lithology) {
        const colorMap = {
            'Quaternary alluvium': 0xDEB887,
            'Weathered Ordovician': 0xCD853F,
            'Fresh Ordovician sandstone': 0x8B7355,
            'Ordovician siltstone': 0x696969,
            'Quartz vein material': 0xF0F8FF,
            'Fault breccia': 0x8B0000
        };

        return colorMap[lithology] || 0x888888;
    }

    createSampleDrillHoles() {
        // Create representative drill holes when API data unavailable
        const sampleHoles = [
            { x: 10, z: 15, depth: 150, id: 'BDH-001' },
            { x: -20, z: -10, depth: 200, id: 'BDH-002' },
            { x: 25, z: 30, depth: 180, id: 'BDH-003' }
        ];

        sampleHoles.forEach(hole => {
            const collar = new THREE.Mesh(
                new THREE.SphereGeometry(0.3, 8, 6),
                new THREE.MeshStandardMaterial({ color: 0xFF4444 })
            );
            collar.position.set(hole.x, 2, hole.z);
            collar.userData = {
                layer: 'drill-holes',
                type: 'sample',
                hole_id: hole.id
            };

            this.scene.add(collar);
            this.drillHoleMeshes.push(collar);
        });
    }

    setVisible(visible) {
        this.visible = visible;
        this.drillHoleMeshes.forEach(mesh => {
            mesh.visible = visible;
        });
    }

    handleLayerChanges(key, value, allLayers) {
        if (key === 'drillHoles') {
            this.setVisible(value);
        }
    }

    getDrillHoleInfo(position, radius = 2) {
        // Find drill holes near a position
        const nearbyHoles = [];
        
        this.drillHoles.forEach(hole => {
            const distance = Math.sqrt(
                Math.pow(hole.coordinates.x - position.x, 2) +
                Math.pow(hole.coordinates.z - position.z, 2)
            );
            
            if (distance <= radius) {
                nearbyHoles.push({
                    hole_id: hole.hole_id,
                    distance: distance.toFixed(1),
                    depth: hole.depth,
                    purpose: hole.purpose,
                    gold_intersections: this.getSignificantGoldIntersections(hole)
                });
            }
        });

        return nearbyHoles;
    }

    getSignificantGoldIntersections(hole) {
        if (!hole.assay_results) return [];

        return hole.assay_results
            .filter(assay => assay.gold_grade > 1.0) // > 1g/t Au
            .map(assay => ({
                interval: `${assay.from_depth}m - ${assay.to_depth}m`,
                grade: `${assay.gold_grade} g/t Au`,
                width: `${(assay.to_depth - assay.from_depth).toFixed(1)}m`
            }));
    }

    highlightHighGradeIntersections() {
        // Highlight drill holes with significant gold intersections
        this.drillHoles.forEach(hole => {
            const highGradeIntervals = this.getSignificantGoldIntersections(hole);
            
            if (highGradeIntervals.length > 0) {
                // Find collar mesh and add highlight
                const collar = this.drillHoleMeshes.find(mesh => 
                    mesh.userData.hole_id === hole.hole_id && 
                    mesh.userData.type === 'collar'
                );
                
                if (collar) {
                    collar.material.emissive = new THREE.Color(0x444400);
                    collar.material.emissiveIntensity = 0.5;
                    
                    // Add pulsing animation
                    this.addPulseAnimation(collar);
                }
            }
        });
    }

    addPulseAnimation(mesh) {
        const originalScale = mesh.scale.clone();
        const pulseAnimation = () => {
            const time = Date.now() * 0.005;
            const scale = 1 + 0.2 * Math.sin(time);
            mesh.scale.setScalar(scale);
        };
        
        // Store animation function for cleanup
        mesh.userData.animation = pulseAnimation;
    }

    updateAnimations() {
        // Update any animated drill hole elements
        this.drillHoleMeshes.forEach(mesh => {
            if (mesh.userData.animation) {
                mesh.userData.animation();
            }
        });
    }

    dispose() {
        this.drillHoleMeshes.forEach(mesh => {
            this.scene.remove(mesh);
            if (mesh.material) {
                mesh.material.dispose();
            }
            if (mesh.geometry) {
                mesh.geometry.dispose();
            }
        });
        
        this.drillHoleMeshes = [];
        this.drillHoles = [];
    }
}

window.DrillHoleRenderer = DrillHoleRenderer;