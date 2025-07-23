/**
 * Advanced Texture Management System
 * Handles geological map overlays with transparency preservation
 */

class TextureManager {
    constructor(scene, settings) {
        this.scene = scene;
        this.settings = settings;
        this.textureCache = new Map();
        this.geologicalTextures = new Map();
        this.loader = new THREE.TextureLoader();
        this.init();
    }

    async init() {
        await this.loadGeologicalTextures();
        this.setupTextureOverlays();
        this.settings.onChange('textures', this.handleTextureChanges.bind(this));
    }

    async loadGeologicalTextures() {
        // Load authentic Bendigo geological map textures
        const textureConfigs = [
            {
                name: 'bendigo_goldfield_south',
                path: '/static/textures/G10770_goldfield_S-Bendigo_GF9b_7k_colour_1750722041897.png',
                opacity: 0.8,
                coordinates: {
                    lat: -36.7606,
                    lng: 144.2831,
                    bounds: {
                        north: -36.7206,
                        south: -36.8006,
                        east: 144.3231,
                        west: 144.2431
                    }
                }
            },
            {
                name: 'bendigo_goldfield_marked',
                path: '/static/textures/2Marked-G10770_goldfield_S-Bendigo_GF9b_7k_colour_1750722041896.png',
                opacity: 0.7,
                coordinates: {
                    lat: -36.7606,
                    lng: 144.2831,
                    bounds: {
                        north: -36.7206,
                        south: -36.8006,
                        east: 144.3231,
                        west: 144.2431
                    }
                }
            },
            {
                name: 'bendigo_heritage_overlay',
                path: '/static/textures/Marked-G10770_goldfield_S-Bendigo_GF9b_7k_colour_1750722041898.png',
                opacity: 0.6,
                coordinates: {
                    lat: -36.7606,
                    lng: 144.2831,
                    bounds: {
                        north: -36.7206,
                        south: -36.8006,
                        east: 144.3231,
                        west: 144.2431
                    }
                }
            },
            {
                name: 'geological_analysis',
                path: '/static/textures/ACt3cneXFj-06jnBaHioF_1750789383460.png',
                opacity: 0.5,
                coordinates: {
                    lat: -36.7606,
                    lng: 144.2831,
                    bounds: {
                        north: -36.7206,
                        south: -36.8006,
                        east: 144.3231,
                        west: 144.2431
                    }
                }
            }
        ];

        for (const config of textureConfigs) {
            try {
                const texture = await this.loadTexture(config.path);
                texture.wrapS = THREE.ClampToEdgeWrap;
                texture.wrapT = THREE.ClampToEdgeWrap;
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                
                this.geologicalTextures.set(config.name, {
                    texture,
                    config,
                    mesh: null,
                    visible: true
                });
                
                console.log(`Loaded geological texture: ${config.name}`);
            } catch (error) {
                console.warn(`Failed to load texture: ${config.name}`, error);
            }
        }
    }

    loadTexture(path) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error(`Texture loading timeout: ${path}`));
            }, 15000);

            this.loader.load(
                path,
                (texture) => {
                    clearTimeout(timeout);
                    resolve(texture);
                },
                (progress) => {
                    if (progress.total > 0) {
                        console.log(`Loading texture: ${(progress.loaded / progress.total * 100).toFixed(1)}%`);
                    }
                },
                (error) => {
                    clearTimeout(timeout);
                    reject(new Error(`Failed to load texture: ${path} - ${error.message || 'Unknown error'}`));
                }
            );
        });
    }

    setupTextureOverlays() {
        this.geologicalTextures.forEach((textureData, name) => {
            this.createTextureOverlay(name, textureData);
        });
    }

    createTextureOverlay(name, textureData) {
        const { texture, config } = textureData;
        
        // Calculate world coordinates from geographic bounds
        const worldSize = 100; // World units
        const geometry = new THREE.PlaneGeometry(worldSize * 0.8, worldSize * 0.8);
        
        // Create material with transparency preservation
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: config.opacity,
            alphaTest: 0.01, // Preserve PNG transparency
            side: THREE.DoubleSide,
            blending: THREE.NormalBlending,
            depthWrite: false // Prevent z-fighting with terrain
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.y = this.getLayerHeight(name);
        mesh.userData = {
            layer: 'geological-texture',
            name: name,
            type: 'overlay'
        };

        textureData.mesh = mesh;
        this.scene.add(mesh);
    }

    getLayerHeight(name) {
        // Stack geological overlays at different heights
        const heights = {
            'bendigo_goldfield_south': 0.1,
            'bendigo_goldfield_marked': 0.2,
            'bendigo_heritage_overlay': 0.3,
            'geological_analysis': 0.4
        };
        return heights[name] || 0.1;
    }

    createAdvancedTextureMaterial(texture, config) {
        // Advanced shader material for geological visualization
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: texture },
                uOpacity: { value: config.opacity },
                uTime: { value: 0 },
                uXrayMode: { value: false },
                uHighlightGold: { value: false }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D uTexture;
                uniform float uOpacity;
                uniform float uTime;
                uniform bool uXrayMode;
                uniform bool uHighlightGold;
                
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    vec4 texColor = texture2D(uTexture, vUv);
                    
                    // Preserve original alpha from PNG
                    float alpha = texColor.a * uOpacity;
                    
                    // X-ray mode enhancement
                    if (uXrayMode) {
                        alpha *= 0.3;
                        texColor.rgb = mix(texColor.rgb, vec3(0.0, 1.0, 1.0), 0.2);
                    }
                    
                    // Gold highlighting for mining areas
                    if (uHighlightGold) {
                        vec3 goldColor = vec3(1.0, 0.84, 0.0);
                        float goldMask = step(0.7, dot(texColor.rgb, vec3(0.8, 0.6, 0.2)));
                        texColor.rgb = mix(texColor.rgb, goldColor, goldMask * 0.3);
                    }
                    
                    gl_FragColor = vec4(texColor.rgb, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        return material;
    }

    updateXrayMode(enabled) {
        this.geologicalTextures.forEach((textureData) => {
            if (textureData.mesh && textureData.mesh.material.uniforms) {
                textureData.mesh.material.uniforms.uXrayMode.value = enabled;
            } else if (textureData.mesh) {
                textureData.mesh.material.opacity = enabled ? 0.2 : textureData.config.opacity;
            }
        });
    }

    setLayerVisibility(layerName, visible) {
        const textureData = this.geologicalTextures.get(layerName);
        if (textureData && textureData.mesh) {
            textureData.mesh.visible = visible;
            textureData.visible = visible;
        }
    }

    setLayerOpacity(layerName, opacity) {
        const textureData = this.geologicalTextures.get(layerName);
        if (textureData && textureData.mesh) {
            textureData.mesh.material.opacity = opacity;
            textureData.config.opacity = opacity;
        }
    }

    highlightGoldBearing(enabled) {
        this.geologicalTextures.forEach((textureData) => {
            if (textureData.mesh && textureData.mesh.material.uniforms) {
                textureData.mesh.material.uniforms.uHighlightGold.value = enabled;
            }
        });
    }

    getAvailableTextures() {
        return Array.from(this.geologicalTextures.keys());
    }

    handleTextureChanges(key, value, allSettings) {
        switch (key) {
            case 'xray_mode':
                this.updateXrayMode(value);
                break;
            case 'gold_highlighting':
                this.highlightGoldBearing(value);
                break;
            case 'opacity':
                this.geologicalTextures.forEach((textureData, name) => {
                    this.setLayerOpacity(name, value);
                });
                break;
        }
    }

    update(time) {
        // Update shader uniforms for animation
        this.geologicalTextures.forEach((textureData) => {
            if (textureData.mesh && textureData.mesh.material.uniforms) {
                textureData.mesh.material.uniforms.uTime.value = time;
            }
        });
    }

    dispose() {
        this.geologicalTextures.forEach((textureData) => {
            if (textureData.texture) {
                textureData.texture.dispose();
            }
            if (textureData.mesh) {
                this.scene.remove(textureData.mesh);
                if (textureData.mesh.material) {
                    textureData.mesh.material.dispose();
                }
                if (textureData.mesh.geometry) {
                    textureData.mesh.geometry.dispose();
                }
            }
        });
        this.geologicalTextures.clear();
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TextureManager;
}