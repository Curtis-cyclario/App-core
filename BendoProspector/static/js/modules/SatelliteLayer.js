/**
 * Satellite Imagery Integration Module
 * Professional satellite data overlay system
 */

class SatelliteLayer {
    constructor(scene, settings) {
        this.scene = scene;
        this.settings = settings;
        this.satellites = [];
        this.currentProvider = 'esri';
        this.visible = false;
        this.opacity = 0.8;
        this.init();
    }

    async init() {
        try {
            const response = await fetch('/api/satellite-imagery');
            this.config = await response.json();
            this.setupSatelliteOverlay();
        } catch (error) {
            console.warn('Satellite imagery unavailable, using procedural overlay');
            this.createProceduralOverlay();
        }
    }

    setupSatelliteOverlay() {
        // Create satellite texture plane
        const geometry = new THREE.PlaneGeometry(100, 100);
        
        // Load satellite tile as texture
        const textureLoader = new THREE.TextureLoader();
        const tileUrl = this.buildTileUrl(this.config.center[0], this.config.center[1], 14);
        
        textureLoader.load(
            tileUrl,
            (texture) => {
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    opacity: this.opacity,
                    side: THREE.DoubleSide
                });

                this.satelliteMesh = new THREE.Mesh(geometry, material);
                this.satelliteMesh.rotation.x = -Math.PI / 2;
                this.satelliteMesh.position.y = 0.1; // Slightly above terrain
                this.satelliteMesh.userData = { 
                    layer: 'satellite',
                    type: 'imagery',
                    provider: this.currentProvider
                };
                this.satelliteMesh.visible = this.visible;
                
                this.scene.add(this.satelliteMesh);
                this.satellites.push(this.satelliteMesh);
                
                console.log('Satellite imagery loaded successfully');
            },
            undefined,
            (error) => {
                console.warn('Satellite texture load failed, using procedural');
                this.createProceduralOverlay();
            }
        );
    }

    createProceduralOverlay() {
        // Professional procedural satellite-style overlay
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        // Create realistic satellite-style imagery
        this.generateSatelliteTexture(ctx, canvas.width, canvas.height);

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        const geometry = new THREE.PlaneGeometry(100, 100);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: this.opacity,
            side: THREE.DoubleSide
        });

        this.satelliteMesh = new THREE.Mesh(geometry, material);
        this.satelliteMesh.rotation.x = -Math.PI / 2;
        this.satelliteMesh.position.y = 0.1;
        this.satelliteMesh.userData = { 
            layer: 'satellite',
            type: 'procedural'
        };
        this.satelliteMesh.visible = this.visible;

        this.scene.add(this.satelliteMesh);
        this.satellites.push(this.satelliteMesh);
    }

    generateSatelliteTexture(ctx, width, height) {
        // Base earth tone colors
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#8B7355');
        gradient.addColorStop(0.3, '#A0864A');
        gradient.addColorStop(0.6, '#7A6B47');
        gradient.addColorStop(1, '#9B8B5C');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Add vegetation patches
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 30 + 10;
            
            ctx.fillStyle = `rgba(${60 + Math.random() * 40}, ${80 + Math.random() * 50}, ${40 + Math.random() * 30}, 0.6)`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }

        // Add road networks
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.4)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * width, Math.random() * height);
            ctx.lineTo(Math.random() * width, Math.random() * height);
            ctx.stroke();
        }

        // Add mining infrastructure markers
        ctx.fillStyle = 'rgba(150, 75, 0, 0.8)';
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            ctx.fillRect(x - 2, y - 2, 4, 4);
        }
    }

    buildTileUrl(lat, lng, zoom) {
        const providers = this.config?.providers;
        if (!providers) return null;

        const tileCoords = this.latLngToTile(lat, lng, zoom);
        let url = providers[this.currentProvider];

        if (this.currentProvider === 'bing') {
            const quadkey = this.tileToQuadkey(tileCoords.x, tileCoords.y, zoom);
            url = url.replace('{quadkey}', quadkey);
        } else {
            url = url.replace('{z}', zoom)
                    .replace('{x}', tileCoords.x)
                    .replace('{y}', tileCoords.y);
        }

        return url;
    }

    latLngToTile(lat, lng, zoom) {
        const n = Math.pow(2, zoom);
        const x = Math.floor((lng + 180) / 360 * n);
        const y = Math.floor((1 - Math.asinh(Math.tan(lat * Math.PI / 180)) / Math.PI) / 2 * n);
        return { x, y };
    }

    tileToQuadkey(x, y, zoom) {
        let quadkey = '';
        for (let i = zoom; i > 0; i--) {
            let digit = 0;
            const mask = 1 << (i - 1);
            if ((x & mask) !== 0) digit++;
            if ((y & mask) !== 0) digit += 2;
            quadkey += digit.toString();
        }
        return quadkey;
    }

    setVisible(visible) {
        this.visible = visible;
        this.satellites.forEach(satellite => {
            satellite.visible = visible;
        });
    }

    setOpacity(opacity) {
        this.opacity = opacity;
        this.satellites.forEach(satellite => {
            if (satellite.material) {
                satellite.material.opacity = opacity;
            }
        });
    }

    setProvider(provider) {
        if (this.config?.providers[provider]) {
            this.currentProvider = provider;
            this.refresh();
        }
    }

    refresh() {
        // Remove existing satellite overlays
        this.satellites.forEach(satellite => {
            this.scene.remove(satellite);
        });
        this.satellites = [];

        // Recreate with current settings
        this.setupSatelliteOverlay();
    }

    dispose() {
        this.satellites.forEach(satellite => {
            this.scene.remove(satellite);
            if (satellite.material.map) {
                satellite.material.map.dispose();
            }
            satellite.material.dispose();
            satellite.geometry.dispose();
        });
        this.satellites = [];
    }
}

window.SatelliteLayer = SatelliteLayer;