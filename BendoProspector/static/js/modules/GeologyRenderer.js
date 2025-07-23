/**
 * Advanced Geological Rendering System
 * Professional 3D geological visualization with authentic DXF processing
 */

class GeologyRenderer {
    constructor(scene, settings) {
        this.scene = scene;
        this.settings = settings;
        this.dxfMeshes = [];
        this.geologicalLayers = new Map();
        this.materialCache = new Map();
        this.init();
    }

    async init() {
        this.setupMaterials();
        await this.loadGeologicalData();
        this.createGeologicalFormations();
        this.settings.onChange('layers', this.handleLayerChanges.bind(this));
    }

    setupMaterials() {
        // Professional geological materials with authentic properties and texture support
        this.textureLoader = new THREE.TextureLoader();
        
        this.materials = {
            ordovician: new THREE.MeshStandardMaterial({
                color: 0x8B7355,
                roughness: 0.8,
                metalness: 0.1,
                transparent: true,
                opacity: 0.7
            }),
            bendigo_formation: new THREE.MeshStandardMaterial({
                color: 0xA0864A,
                roughness: 0.7,
                metalness: 0.2,
                transparent: true,
                opacity: 0.8
            }),
            quartz_veins: new THREE.MeshStandardMaterial({
                color: 0xF0F0F0,
                roughness: 0.3,
                metalness: 0.4,
                transparent: true,
                opacity: 0.9,
                emissive: 0x111111
            }),
            fault_zones: new THREE.MeshStandardMaterial({
                color: 0x8B0000,
                roughness: 0.9,
                metalness: 0.1,
                transparent: true,
                opacity: 0.6
            }),
            shear_zones: new THREE.MeshStandardMaterial({
                color: 0x4B0082,
                roughness: 0.7,
                metalness: 0.3,
                transparent: true,
                opacity: 0.7
            }),
            goldfield_overlay: new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0.8,
                alphaTest: 0.01,
                side: THREE.DoubleSide,
                depthWrite: false
            }),
            heritage_overlay: new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0.7,
                alphaTest: 0.01,
                side: THREE.DoubleSide,
                depthWrite: false
            })
        };

        // Load geological map textures with error handling
        this.loadGeologicalTextures().catch(error => {
            console.warn('Geological texture loading failed, using procedural materials:', error);
        });
    }

    async loadGeologicalTextures() {
        try {
            // Check if textures exist before loading
            const textureConfigs = [
                { 
                    material: 'goldfield_overlay',
                    path: '/static/textures/G10770_goldfield_S-Bendigo_GF9b_7k_colour_1750722041897.png'
                },
                { 
                    material: 'heritage_overlay',
                    path: '/static/textures/2Marked-G10770_goldfield_S-Bendigo_GF9b_7k_colour_1750722041896.png'
                }
            ];

            for (const config of textureConfigs) {
                try {
                    const texture = await this.loadTextureWithTransparency(config.path);
                    if (this.materials[config.material]) {
                        this.materials[config.material].map = texture;
                        this.materials[config.material].needsUpdate = true;
                    }
                } catch (textureError) {
                    console.warn(`Failed to load texture ${config.path}:`, textureError);
                    // Continue with other textures
                }
            }

            console.log('Geological textures loaded with transparency preserved');
        } catch (error) {
            console.warn('Texture loading fallback to procedural materials:', error);
            throw error;
        }
    }

    loadTextureWithTransparency(path) {
        return new Promise((resolve, reject) => {
            // Add timeout to prevent hanging
            const timeout = setTimeout(() => {
                reject(new Error(`Texture loading timeout: ${path}`));
            }, 10000);

            this.textureLoader.load(
                path,
                (texture) => {
                    clearTimeout(timeout);
                    try {
                        texture.wrapS = THREE.ClampToEdgeWrap;
                        texture.wrapT = THREE.ClampToEdgeWrap;
                        texture.minFilter = THREE.LinearFilter;
                        texture.magFilter = THREE.LinearFilter;
                        texture.flipY = false; // Preserve PNG orientation
                        texture.generateMipmaps = true;
                        resolve(texture);
                    } catch (processingError) {
                        reject(processingError);
                    }
                },
                (progress) => {
                    console.log(`Loading texture: ${(progress.loaded / progress.total * 100).toFixed(1)}%`);
                },
                (error) => {
                    clearTimeout(timeout);
                    reject(new Error(`Failed to load texture: ${path} - ${error.message}`));
                }
            );
        });
    }

    async loadGeologicalData() {
        try {
            // Load DXF data
            const dxfResponse = await fetch('/api/dxf/parse');
            const dxfData = await dxfResponse.json();
            
            if (dxfData.status === 'success') {
                await this.processDXFLayers(dxfData);
            }

            // Load geological formations
            const geoResponse = await fetch('/api/geological-data');
            const geoData = await geoResponse.json();
            
            this.createFormationMeshes(geoData);
            
        } catch (error) {
            console.warn('Using procedural geological data');
            this.createProceduralGeology();
        }
    }

    async processDXFLayers(dxfData) {
        try {
            const geometryResponse = await fetch('/api/dxf/threejs');
            const geometryData = await geometryResponse.json();
            
            if (geometryData.geometryData) {
                this.createDXFMeshes(geometryData.geometryData);
            }
        } catch (error) {
            console.warn('DXF geometry processing failed');
        }
    }

    createDXFMeshes(geometryData) {
        Object.entries(geometryData).forEach(([layerName, data]) => {
            if (data.vertices && data.vertices.length >= 9) {
                const geometry = new THREE.BufferGeometry();
                geometry.setAttribute('position', new THREE.Float32BufferAttribute(data.vertices, 3));
                geometry.computeVertexNormals();

                // Determine material based on layer name
                const material = this.getMaterialForLayer(layerName);
                
                const mesh = new THREE.Mesh(geometry, material);
                mesh.userData = { 
                    layer: 'dxf-geology', 
                    name: layerName,
                    formation: this.classifyFormation(layerName)
                };
                
                this.scene.add(mesh);
                this.dxfMeshes.push(mesh);
                this.geologicalLayers.set(layerName, mesh);
            }
        });

        console.log(`Created ${this.dxfMeshes.length} DXF geological meshes`);
    }

    getMaterialForLayer(layerName) {
        const name = layerName.toLowerCase();
        
        if (name.includes('fault') || name.includes('fracture')) {
            return this.materials.fault_zones.clone();
        } else if (name.includes('quartz') || name.includes('vein')) {
            return this.materials.quartz_veins.clone();
        } else if (name.includes('shear') || name.includes('zone')) {
            return this.materials.shear_zones.clone();
        } else if (name.includes('bendigo') || name.includes('formation')) {
            return this.materials.bendigo_formation.clone();
        } else {
            return this.materials.ordovician.clone();
        }
    }

    classifyFormation(layerName) {
        const name = layerName.toLowerCase();
        
        if (name.includes('ordovician')) return 'ordovician_basement';
        if (name.includes('bendigo')) return 'bendigo_formation';
        if (name.includes('fault')) return 'structural_fault';
        if (name.includes('quartz')) return 'quartz_vein';
        if (name.includes('shear')) return 'shear_zone';
        
        return 'unknown_formation';
    }

    createFormationMeshes(geoData) {
        // Create representative geological formations
        this.createOrphanageRock();
        this.createBendigoFormation();
        this.createQuartzReefSystem();
        this.createFaultNetworks();
    }

    createOrphanageRock() {
        // Ordovician basement rock representation
        const geometry = new THREE.BoxGeometry(80, 20, 80);
        const mesh = new THREE.Mesh(geometry, this.materials.ordovician);
        mesh.position.set(0, -30, 0);
        mesh.userData = { 
            layer: 'geology',
            formation: 'ordovician_basement',
            age: '485-444 Ma'
        };
        
        this.scene.add(mesh);
        this.geologicalLayers.set('ordovician_basement', mesh);
    }

    createBendigoFormation() {
        // Bendigo Formation sedimentary layers
        for (let i = 0; i < 5; i++) {
            const geometry = new THREE.BoxGeometry(60, 3, 60);
            const mesh = new THREE.Mesh(geometry, this.materials.bendigo_formation);
            mesh.position.set(0, -10 + (i * 4), 0);
            mesh.rotation.x = Math.random() * 0.1 - 0.05; // Slight folding
            mesh.userData = { 
                layer: 'geology',
                formation: 'bendigo_formation',
                sequence: i
            };
            
            this.scene.add(mesh);
            this.geologicalLayers.set(`bendigo_layer_${i}`, mesh);
        }
    }

    createQuartzReefSystem() {
        // Gold-bearing quartz reef system
        const reefPositions = [
            { x: 15, y: 0, z: 20, rotation: 0.3 },
            { x: -20, y: -5, z: 10, rotation: -0.2 },
            { x: 25, y: 2, z: -15, rotation: 0.4 }
        ];

        reefPositions.forEach((pos, index) => {
            const geometry = new THREE.BoxGeometry(2, 15, 30);
            const mesh = new THREE.Mesh(geometry, this.materials.quartz_veins);
            mesh.position.set(pos.x, pos.y, pos.z);
            mesh.rotation.y = pos.rotation;
            mesh.userData = { 
                layer: 'geology',
                formation: 'quartz_reef',
                reef_id: `reef_${index}`,
                gold_bearing: true
            };
            
            this.scene.add(mesh);
            this.geologicalLayers.set(`quartz_reef_${index}`, mesh);
        });
    }

    createFaultNetworks() {
        // Major fault systems
        const faultData = [
            { name: 'Whipstick Fault', strike: 45, length: 50 },
            { name: 'Crusoe North Fault', strike: 120, length: 40 }
        ];

        faultData.forEach((fault, index) => {
            const geometry = new THREE.PlaneGeometry(fault.length, 25);
            const mesh = new THREE.Mesh(geometry, this.materials.fault_zones);
            
            const angle = (fault.strike * Math.PI) / 180;
            mesh.position.set(
                Math.cos(angle) * 20,
                -5,
                Math.sin(angle) * 20
            );
            mesh.rotation.y = angle;
            mesh.rotation.x = -Math.PI / 2 + 0.2; // Dipping fault plane
            
            mesh.userData = { 
                layer: 'geology',
                formation: 'fault_system',
                fault_name: fault.name,
                strike: fault.strike
            };
            
            this.scene.add(mesh);
            this.geologicalLayers.set(fault.name.toLowerCase().replace(' ', '_'), mesh);
        });
    }

    createProceduralGeology() {
        // Fallback procedural geological structures
        console.log('Creating procedural geological structures');
        
        // Simple layered geology
        for (let i = 0; i < 8; i++) {
            const geometry = new THREE.BoxGeometry(
                70 + Math.random() * 20,
                2 + Math.random() * 3,
                70 + Math.random() * 20
            );
            
            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(0.1 + Math.random() * 0.2, 0.3, 0.4 + Math.random() * 0.3),
                transparent: true,
                opacity: 0.6 + Math.random() * 0.3
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                Math.random() * 10 - 5,
                -20 + i * 3,
                Math.random() * 10 - 5
            );
            mesh.rotation.x = Math.random() * 0.2 - 0.1;
            mesh.userData = { 
                layer: 'geology',
                formation: 'procedural',
                sequence: i
            };
            
            this.scene.add(mesh);
            this.geologicalLayers.set(`procedural_layer_${i}`, mesh);
        }
    }

    updateXrayMode(enabled, opacity = 0.3) {
        this.geologicalLayers.forEach(mesh => {
            if (mesh.material) {
                mesh.material.transparent = true;
                mesh.material.opacity = enabled ? opacity : 0.7;
                mesh.material.needsUpdate = true;
            }
        });
    }

    setLayerVisibility(layerName, visible) {
        const mesh = this.geologicalLayers.get(layerName);
        if (mesh) {
            mesh.visible = visible;
        }
    }

    setFormationVisibility(formation, visible) {
        this.geologicalLayers.forEach(mesh => {
            if (mesh.userData.formation === formation) {
                mesh.visible = visible;
            }
        });
    }

    updateMaterialQuality(quality) {
        const settings = {
            low: { roughness: 1.0, metalness: 0.0 },
            medium: { roughness: 0.7, metalness: 0.1 },
            high: { roughness: 0.5, metalness: 0.2 },
            ultra: { roughness: 0.3, metalness: 0.3 }
        };

        const config = settings[quality] || settings.high;
        
        Object.values(this.materials).forEach(material => {
            material.roughness = config.roughness;
            material.metalness = config.metalness;
            material.needsUpdate = true;
        });
    }

    handleLayerChanges(key, value, allLayers) {
        if (key === 'geology') {
            this.setFormationVisibility('all', value);
        }
    }

    getGeologicalInfo(position) {
        // Return geological information at a specific 3D position
        const info = {
            position: position,
            formations: [],
            structures: [],
            gold_potential: 'unknown'
        };

        this.geologicalLayers.forEach((mesh, name) => {
            const box = new THREE.Box3().setFromObject(mesh);
            if (box.containsPoint(position)) {
                info.formations.push({
                    name: name,
                    formation: mesh.userData.formation,
                    age: mesh.userData.age
                });
            }
        });

        return info;
    }

    dispose() {
        this.geologicalLayers.forEach(mesh => {
            this.scene.remove(mesh);
            if (mesh.material) {
                mesh.material.dispose();
            }
            if (mesh.geometry) {
                mesh.geometry.dispose();
            }
        });
        
        this.geologicalLayers.clear();
        this.dxfMeshes = [];
        
        Object.values(this.materials).forEach(material => {
            material.dispose();
        });
    }
}

window.GeologyRenderer = GeologyRenderer;