/**
 * Enhanced 2D/3D Integration System
 * Seamlessly blends 2D geological maps with 3D terrain visualization
 */

class Enhanced2D3DIntegration {
    constructor(scene, camera, renderer, settings) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.settings = settings;
        this.textureManager = null;
        this.mode = '3D'; // '2D', '3D', or 'hybrid'
        this.transitionProgress = 0;
        this.geologicalLayers = new Map();
        this.init();
    }

    async init() {
        this.setupIntegrationControls();
        await this.loadGeologicalTextures();
        this.createHybridVisualization();
        this.settings.onChange('visualization', this.handleVisualizationChanges.bind(this));
    }

    async loadGeologicalTextures() {
        try {
            const response = await fetch('/api/textures/geological');
            const textureData = await response.json();
            
            for (const texture of textureData.textures) {
                await this.loadAndProcessTexture(texture);
            }
            
            console.log('Geological textures loaded with transparency preserved');
        } catch (error) {
            console.warn('Texture loading fallback to procedural materials');
        }
    }

    async loadAndProcessTexture(textureConfig) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.TextureLoader();
            const timeout = setTimeout(() => {
                reject(new Error(`Texture loading timeout: ${textureConfig.name}`));
            }, 10000);

            loader.load(
                textureConfig.path,
                (texture) => {
                    clearTimeout(timeout);
                    try {
                        // Preserve PNG transparency and quality
                        texture.wrapS = THREE.ClampToEdgeWrap;
                        texture.wrapT = THREE.ClampToEdgeWrap;
                        texture.minFilter = THREE.LinearFilter;
                        texture.magFilter = THREE.LinearFilter;
                        texture.flipY = false;
                        texture.generateMipmaps = true;
                        
                        this.createGeologicalOverlay(textureConfig, texture);
                        resolve(texture);
                    } catch (processingError) {
                        reject(processingError);
                    }
                },
                (progress) => {
                    if (progress.total > 0) {
                        console.log(`Loading ${textureConfig.name}: ${(progress.loaded / progress.total * 100).toFixed(1)}%`);
                    }
                },
                (error) => {
                    clearTimeout(timeout);
                    reject(new Error(`Failed to load texture ${textureConfig.name}: ${error.message || 'Unknown error'}`));
                }
            );
        });
    }

    createGeologicalOverlay(config, texture) {
        // Create high-quality geological overlay with preserved transparency
        const geometry = new THREE.PlaneGeometry(100, 100, 64, 64);
        
        // Advanced material with shader for perfect transparency handling
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: texture },
                uOpacity: { value: config.opacity },
                uTime: { value: 0 },
                uXrayMode: { value: false },
                uTransitionProgress: { value: 0 },
                uViewMode: { value: 0 }, // 0: 3D, 1: 2D, 2: hybrid
                uCameraPosition: { value: new THREE.Vector3() }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                uniform float uTransitionProgress;
                uniform int uViewMode;
                uniform vec3 uCameraPosition;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    vNormal = normal;
                    
                    vec3 pos = position;
                    
                    // Smooth transition between 2D and 3D views
                    if (uViewMode == 2) { // hybrid mode
                        float distance = length(uCameraPosition - position);
                        float heightFactor = smoothstep(0.0, 1.0, uTransitionProgress);
                        pos.y += sin(distance * 0.1 + uTransitionProgress * 6.28) * heightFactor * 2.0;
                    }
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D uTexture;
                uniform float uOpacity;
                uniform float uTime;
                uniform bool uXrayMode;
                uniform float uTransitionProgress;
                uniform int uViewMode;
                
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    vec4 texColor = texture2D(uTexture, vUv);
                    
                    // Preserve original PNG alpha channel
                    float alpha = texColor.a * uOpacity;
                    
                    // Enhanced transparency for X-ray mode
                    if (uXrayMode) {
                        alpha *= 0.25;
                        texColor.rgb = mix(texColor.rgb, vec3(0.0, 1.0, 1.0), 0.15);
                    }
                    
                    // View mode enhancements
                    if (uViewMode == 1) { // 2D mode
                        // Enhance contrast and saturation for 2D view
                        texColor.rgb = pow(texColor.rgb, vec3(0.8));
                        texColor.rgb = mix(vec3(dot(texColor.rgb, vec3(0.299, 0.587, 0.114))), texColor.rgb, 1.2);
                    } else if (uViewMode == 2) { // hybrid mode
                        // Dynamic blend based on transition
                        float blendFactor = sin(uTime * 2.0 + vPosition.x * 0.1) * 0.1 + 0.9;
                        texColor.rgb *= blendFactor;
                    }
                    
                    // Gold highlighting for mining areas
                    vec3 goldColor = vec3(1.0, 0.84, 0.0);
                    float goldMask = step(0.65, dot(texColor.rgb, vec3(0.8, 0.6, 0.2)));
                    texColor.rgb = mix(texColor.rgb, goldColor, goldMask * 0.2);
                    
                    gl_FragColor = vec4(texColor.rgb, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.NormalBlending
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.y = this.getLayerHeight(config.name);
        mesh.userData = {
            layer: 'geological-overlay',
            name: config.name,
            type: config.type,
            originalConfig: config
        };

        this.geologicalLayers.set(config.name, {
            mesh,
            material,
            config,
            visible: true
        });

        this.scene.add(mesh);
    }

    getLayerHeight(name) {
        const heights = {
            'bendigo_goldfield_south': 0.05,
            'bendigo_goldfield_marked': 0.1,
            'bendigo_heritage_overlay': 0.15,
            'geological_analysis': 0.2
        };
        return heights[name] || 0.05;
    }

    setupIntegrationControls() {
        // Add view mode controls to the UI with delay to ensure DOM is ready
        setTimeout(() => {
            const controls = document.createElement('div');
            controls.className = 'view-mode-controls';
            controls.style.cssText = `
                margin-top: 10px;
                padding: 10px;
                border-top: 1px solid #333;
            `;
            controls.innerHTML = `
                <div class="control-group">
                    <label style="color: #fff; margin-bottom: 5px; display: block;">View Mode:</label>
                    <select id="viewModeSelect" style="width: 100%; padding: 5px; background: #333; color: #fff; border: 1px solid #555;">
                        <option value="3D">3D Geological</option>
                        <option value="2D">2D Map View</option>
                        <option value="hybrid">Hybrid Mode</option>
                    </select>
                </div>
                <div class="control-group" style="margin-top: 10px;">
                    <label style="color: #fff; margin-bottom: 5px; display: block;">Transition:</label>
                    <input type="range" id="transitionSlider" min="0" max="1" step="0.01" value="0" style="width: 100%;">
                </div>
            `;
            
            // Add to existing controls container
            const existingControls = document.querySelector('.controls');
            if (existingControls) {
                existingControls.appendChild(controls);
                
                // Event listeners
                const viewModeSelect = document.getElementById('viewModeSelect');
                const transitionSlider = document.getElementById('transitionSlider');
                
                if (viewModeSelect) {
                    viewModeSelect.addEventListener('change', (e) => {
                        this.setViewMode(e.target.value);
                    });
                }
                
                if (transitionSlider) {
                    transitionSlider.addEventListener('input', (e) => {
                        this.setTransitionProgress(parseFloat(e.target.value));
                    });
                }
            }
        }, 1000);
    }

    setViewMode(mode) {
        this.mode = mode;
        const modeValue = mode === '2D' ? 1 : mode === 'hybrid' ? 2 : 0;
        
        this.geologicalLayers.forEach((layer) => {
            if (layer.material.uniforms) {
                layer.material.uniforms.uViewMode.value = modeValue;
            }
        });

        // Adjust camera for 2D mode
        if (mode === '2D') {
            this.transitionTo2D();
        } else if (mode === '3D') {
            this.transitionTo3D();
        }
    }

    setTransitionProgress(progress) {
        this.transitionProgress = progress;
        
        this.geologicalLayers.forEach((layer) => {
            if (layer.material.uniforms) {
                layer.material.uniforms.uTransitionProgress.value = progress;
            }
        });
    }

    transitionTo2D() {
        // Smooth camera transition to top-down view
        const targetPosition = new THREE.Vector3(0, 100, 0);
        const targetRotation = new THREE.Euler(-Math.PI / 2, 0, 0);
        
        this.animateCamera(targetPosition, targetRotation, 2000);
    }

    transitionTo3D() {
        // Restore 3D perspective
        const targetPosition = new THREE.Vector3(50, 50, 50);
        const targetRotation = new THREE.Euler(0, 0, 0);
        
        this.animateCamera(targetPosition, targetRotation, 2000);
    }

    animateCamera(targetPosition, targetRotation, duration) {
        const startPosition = this.camera.position.clone();
        const startRotation = this.camera.rotation.clone();
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = this.easeInOutCubic(progress);

            this.camera.position.lerpVectors(startPosition, targetPosition, eased);
            this.camera.rotation.x = THREE.MathUtils.lerp(startRotation.x, targetRotation.x, eased);
            this.camera.rotation.y = THREE.MathUtils.lerp(startRotation.y, targetRotation.y, eased);
            this.camera.rotation.z = THREE.MathUtils.lerp(startRotation.z, targetRotation.z, eased);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    updateXrayMode(enabled) {
        this.geologicalLayers.forEach((layer) => {
            if (layer.material.uniforms) {
                layer.material.uniforms.uXrayMode.value = enabled;
            }
        });
    }

    setLayerVisibility(layerName, visible) {
        const layer = this.geologicalLayers.get(layerName);
        if (layer) {
            layer.mesh.visible = visible;
            layer.visible = visible;
        }
    }

    setLayerOpacity(layerName, opacity) {
        const layer = this.geologicalLayers.get(layerName);
        if (layer && layer.material.uniforms) {
            layer.material.uniforms.uOpacity.value = opacity;
        }
    }

    handleVisualizationChanges(key, value, allSettings) {
        switch (key) {
            case 'view_mode':
                this.setViewMode(value);
                break;
            case 'xray_mode':
                this.updateXrayMode(value);
                break;
            case 'transition_progress':
                this.setTransitionProgress(value);
                break;
        }
    }

    update(time) {
        // Update shader uniforms
        this.geologicalLayers.forEach((layer) => {
            if (layer.material.uniforms) {
                layer.material.uniforms.uTime.value = time * 0.001;
                layer.material.uniforms.uCameraPosition.value.copy(this.camera.position);
            }
        });
    }

    dispose() {
        this.geologicalLayers.forEach((layer) => {
            if (layer.mesh) {
                this.scene.remove(layer.mesh);
                if (layer.material) {
                    layer.material.dispose();
                }
                if (layer.mesh.geometry) {
                    layer.mesh.geometry.dispose();
                }
            }
        });
        this.geologicalLayers.clear();
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Enhanced2D3DIntegration;
}