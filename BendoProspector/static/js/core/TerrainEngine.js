/**
 * Professional Terrain Engine
 * Efficient heightmap-based terrain generation and visualization
 */

class TerrainEngine {
    constructor() {
        this.textureLoader = new THREE.TextureLoader();
        this.geometryCache = new Map();
        this.materialCache = new Map();
    }

    /**
     * Generate terrain from heightmap data
     * @param {Object} config - Terrain configuration
     * @returns {THREE.Mesh} Terrain mesh
     */
    generateTerrain(config) {
        const {
            width = 100,
            height = 100,
            widthSegments = 128,
            heightSegments = 128,
            heightScale = 10,
            heightData = null,
            textureUrl = null,
            materialType = 'standard'
        } = config;

        // Generate or use cached geometry
        const geometryKey = `${width}_${height}_${widthSegments}_${heightSegments}`;
        let geometry = this.geometryCache.get(geometryKey);

        if (!geometry) {
            geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
            geometry.rotateX(-Math.PI / 2);
            this.geometryCache.set(geometryKey, geometry);
        } else {
            geometry = geometry.clone();
        }

        // Apply height data if provided
        if (heightData) {
            this.applyHeightData(geometry, heightData, heightScale);
        } else {
            this.generateProceduralTerrain(geometry, heightScale);
        }

        // Create material
        const material = this.createTerrainMaterial(materialType, textureUrl);

        // Create mesh
        const terrain = new THREE.Mesh(geometry, material);
        terrain.receiveShadow = true;
        terrain.castShadow = false;
        terrain.userData = {
            type: 'terrain',
            interactive: true,
            config: config
        };

        return terrain;
    }

    /**
     * Apply heightmap data to geometry
     */
    applyHeightData(geometry, heightData, heightScale) {
        const positions = geometry.attributes.position.array;
        const width = Math.sqrt(positions.length / 3);

        for (let i = 0; i < positions.length; i += 3) {
            const x = Math.floor((i / 3) % width);
            const z = Math.floor((i / 3) / width);
            
            if (heightData[z] && heightData[z][x] !== undefined) {
                positions[i + 1] = heightData[z][x] * heightScale;
            }
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
    }

    /**
     * Generate procedural terrain based on Bendigo geological patterns
     */
    generateProceduralTerrain(geometry, heightScale) {
        const positions = geometry.attributes.position.array;
        const colors = new Float32Array(positions.length);

        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const z = positions[i + 2];

            // Geological elevation model
            let elevation = this.calculateGeologicalElevation(x, z);
            positions[i + 1] = elevation * heightScale;

            // Geological formation colors
            const formation = this.classifyFormation(x, z, elevation);
            colors[i] = formation.r;
            colors[i + 1] = formation.g;
            colors[i + 2] = formation.b;
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.computeVertexNormals();
    }

    calculateGeologicalElevation(x, z) {
        // Base elevation
        let elevation = 0.5;

        // Geological formations
        const formations = [
            { x: -20, z: -15, height: 2.5, radius: 25 }, // Ordovician basement
            { x: 10, z: 5, height: 3.0, radius: 30 },    // Bendigo formation
            { x: -5, z: 20, height: 4.0, radius: 20 },   // Quartz reefs
            { x: 25, z: -10, height: 1.5, radius: 35 }   // Alluvial deposits
        ];

        formations.forEach(formation => {
            const dist = Math.sqrt((x - formation.x) ** 2 + (z - formation.z) ** 2);
            if (dist < formation.radius) {
                const influence = Math.cos((dist / formation.radius) * Math.PI * 0.5);
                elevation += formation.height * influence * influence;
            }
        });

        // Add detailed topographic variation
        elevation += 0.8 * Math.sin(x * 0.08) * Math.cos(z * 0.06);
        elevation += 0.4 * Math.sin(x * 0.15) * Math.cos(z * 0.12);
        elevation += 0.2 * Math.sin(x * 0.3) * Math.cos(z * 0.25);

        return Math.max(0, elevation);
    }

    classifyFormation(x, z, elevation) {
        if (elevation > 3.5) {
            return { r: 0.85, g: 0.8, b: 0.65 }; // Quartz reef systems
        } else if (elevation > 2.5) {
            return { r: 0.55, g: 0.45, b: 0.35 }; // Bendigo Formation
        } else if (elevation > 1.0) {
            return { r: 0.35, g: 0.35, b: 0.45 }; // Ordovician basement
        } else {
            return { r: 0.65, g: 0.55, b: 0.45 }; // Alluvial deposits
        }
    }

    createTerrainMaterial(type, textureUrl) {
        const materialKey = `${type}_${textureUrl || 'default'}`;
        let material = this.materialCache.get(materialKey);

        if (material) {
            return material.clone();
        }

        switch (type) {
            case 'geological':
                material = new THREE.MeshStandardMaterial({
                    vertexColors: true,
                    roughness: 0.8,
                    metalness: 0.1
                });
                break;

            case 'textured':
                material = new THREE.MeshStandardMaterial({
                    color: 0x8B7355,
                    roughness: 0.9,
                    metalness: 0.05
                });
                
                if (textureUrl) {
                    this.textureLoader.load(textureUrl, (texture) => {
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                        texture.repeat.set(16, 16);
                        material.map = texture;
                        material.needsUpdate = true;
                    });
                }
                break;

            default:
                material = new THREE.MeshStandardMaterial({
                    color: 0x8B7355,
                    roughness: 0.8,
                    metalness: 0.1
                });
        }

        this.materialCache.set(materialKey, material);
        return material;
    }

    /**
     * Load heightmap from image
     */
    async loadHeightmapFromImage(imageUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const heightData = this.extractHeightData(imageData);
                
                resolve({
                    data: heightData,
                    width: canvas.width,
                    height: canvas.height
                });
            };
            
            img.onerror = reject;
            img.src = imageUrl;
        });
    }

    extractHeightData(imageData) {
        const { data, width, height } = imageData;
        const heightData = [];

        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                // Use red channel for height data
                const heightValue = data[index] / 255;
                row.push(heightValue);
            }
            heightData.push(row);
        }

        return heightData;
    }

    /**
     * Update terrain with new configuration
     */
    updateTerrain(terrain, newConfig) {
        const oldConfig = terrain.userData.config;
        const mergedConfig = { ...oldConfig, ...newConfig };
        
        // Generate new terrain
        const newTerrain = this.generateTerrain(mergedConfig);
        
        // Copy position and rotation
        newTerrain.position.copy(terrain.position);
        newTerrain.rotation.copy(terrain.rotation);
        newTerrain.scale.copy(terrain.scale);
        
        return newTerrain;
    }

    dispose() {
        // Clean up cached resources
        this.geometryCache.forEach(geometry => geometry.dispose());
        this.materialCache.forEach(material => material.dispose());
        this.geometryCache.clear();
        this.materialCache.clear();
    }
}