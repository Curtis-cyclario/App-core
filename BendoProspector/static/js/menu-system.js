// static/js/menu-system.js
// Professional Menu System for Bendigo Terrain Viewer

let isMenuOpen = false;
let activeMenu = null;
let viewerState = {
    wireframe: false,
    xray: false,
    grid: false,
    axes: false,
    stats: false
};

// Initialize menu system
function initMenuSystem() {
    setupMenuListeners();
    setupToolbarListeners();
    setupKeyboardShortcuts();
    updateStatusBar();
}

function setupMenuListeners() {
    // Menu item hover/click handlers
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const menuId = item.dataset.menu + '-menu';
            toggleMenu(menuId);
        });
    });

    // Dropdown item click handlers
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = item.dataset.action;
            if (action && !item.classList.contains('disabled')) {
                executeMenuAction(action);
                closeAllMenus();
            }
        });
    });

    // Close menus when clicking outside
    document.addEventListener('click', closeAllMenus);
}

function setupToolbarListeners() {
    document.querySelectorAll('.tool-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const tool = button.dataset.tool;
            if (tool) {
                executeToolAction(tool, button);
            }
        });
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Prevent default for our shortcuts
        if (handleKeyboardShortcut(e)) {
            e.preventDefault();
        }
    });
}

function handleKeyboardShortcut(e) {
    const ctrl = e.ctrlKey;
    const shift = e.shiftKey;
    const alt = e.altKey;
    const key = e.key.toLowerCase();

    // File menu shortcuts
    if (ctrl && key === 'n') return executeMenuAction('new');
    if (ctrl && key === 'o') return executeMenuAction('open');
    if (ctrl && key === 's' && !shift) return executeMenuAction('save');
    if (ctrl && shift && key === 's') return executeMenuAction('saveas');
    if (ctrl && key === 'p') return executeMenuAction('print');
    if (key === 'f12') return executeMenuAction('screenshot');

    // Edit menu shortcuts
    if (ctrl && key === 'z') return executeMenuAction('undo');
    if (ctrl && key === 'y') return executeMenuAction('redo');
    if (ctrl && key === 'c') return executeMenuAction('copy');
    if (ctrl && key === 'v') return executeMenuAction('paste');
    if (ctrl && key === 'a') return executeMenuAction('select-all');
    if (key === 'delete') return executeMenuAction('clear');
    if (ctrl && key === ',') return executeMenuAction('preferences');

    // View menu shortcuts
    if (key === 'home') return executeMenuAction('reset-camera');
    if (key === '7') return executeMenuAction('top-view');
    if (key === '1') return executeMenuAction('front-view');
    if (key === '3') return executeMenuAction('side-view');
    if (key === 'z') return executeMenuAction('wireframe');
    if (key === 'x') return executeMenuAction('solid');
    if (alt && key === 'z') return executeMenuAction('xray');
    if (key === 'g' && !ctrl) return executeMenuAction('grid');
    if (ctrl && key === 'g') return executeMenuAction('axes');
    if (key === 'f3') return executeMenuAction('stats');

    // Tools menu shortcuts
    if (key === 'm') return executeMenuAction('measure');
    if (key === 'c') return executeMenuAction('cross-section');
    if (key === 'e') return executeMenuAction('elevation');

    // Help shortcuts
    if (key === 'f1') return executeMenuAction('shortcuts');

    return false;
}

function toggleMenu(menuId) {
    const menu = document.getElementById(menuId);
    if (!menu) return;

    // Close other menus
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        if (dropdown.id !== menuId) {
            dropdown.classList.remove('active');
        }
    });

    // Toggle current menu
    menu.classList.toggle('active');
    activeMenu = menu.classList.contains('active') ? menuId : null;
}

function closeAllMenus() {
    document.querySelectorAll('.dropdown').forEach(menu => {
        menu.classList.remove('active');
    });
    activeMenu = null;
}

function executeMenuAction(action) {
    updateStatusMessage(`Executing: ${action.replace('-', ' ')}`);
    
    switch (action) {
        // File menu actions
        case 'new':
            createNewTerrain();
            break;
        case 'open':
            openProject();
            break;
        case 'save':
            saveTerrain();
            break;
        case 'saveas':
            saveTerrainAs();
            break;
        case 'import':
            importDXF();
            break;
        case 'export':
            exportSTL();
            break;
        case 'export-obj':
            exportOBJ();
            break;
        case 'print':
            printView();
            break;
        case 'screenshot':
            takeScreenshot();
            break;

        // Edit menu actions
        case 'undo':
            undoAction();
            break;
        case 'redo':
            redoAction();
            break;
        case 'copy':
            copyView();
            break;
        case 'paste':
            pasteData();
            break;
        case 'select-all':
            selectAllObjects();
            break;
        case 'clear':
            clearScene();
            break;
        case 'preferences':
            openPreferences();
            break;

        // View menu actions
        case 'reset-camera':
            resetCamera();
            break;
        case 'top-view':
            setTopView();
            break;
        case 'front-view':
            setFrontView();
            break;
        case 'side-view':
            setSideView();
            break;
        case 'wireframe':
            toggleWireframe();
            break;
        case 'solid':
            setSolidMode();
            break;
        case 'xray':
            toggleXRayMode();
            break;
        case 'grid':
            toggleGrid();
            break;
        case 'axes':
            toggleAxes();
            break;
        case 'stats':
            toggleStats();
            break;

        // Tools menu actions
        case 'measure':
            activateMeasureTool();
            break;
        case 'cross-section':
            activateCrossSectionTool();
            break;
        case 'elevation':
            activateElevationTool();
            break;
        case 'mining-analysis':
            openMiningAnalysis();
            break;
        case 'geological-layers':
            openGeologicalLayers();
            break;
        case 'drill-holes':
            openDrillHoles();
            break;
        case 'render-settings':
            openRenderSettings();
            break;
        case 'performance':
            openPerformanceMonitor();
            break;

        // Help menu actions
        case 'about':
            showAbout();
            break;
        case 'shortcuts':
            showKeyboardShortcuts();
            break;
        case 'documentation':
            openDocumentation();
            break;
        case 'support':
            openSupport();
            break;

        default:
            updateStatusMessage(`Action '${action}' not implemented yet`);
    }
}

function executeToolAction(tool, button) {
    // Remove active state from all buttons
    document.querySelectorAll('.tool-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active state to clicked button
    button.classList.add('active');

    // Execute tool action
    switch (tool) {
        case 'select':
            setSelectTool();
            break;
        case 'pan':
            setPanTool();
            break;
        case 'rotate':
            setRotateTool();
            break;
        case 'zoom':
            setZoomTool();
            break;
        case 'measure':
            activateMeasureTool();
            break;
        case 'cross-section':
            activateCrossSectionTool();
            break;
        case 'elevation':
            activateElevationTool();
            break;
        case 'wireframe':
            toggleWireframe();
            break;
        case 'xray':
            toggleXRayMode();
            break;
    }

    updateStatusMessage(`Tool: ${tool} activated`);
}

// Individual action implementations
function createNewTerrain() {
    if (confirm('Create new terrain? This will clear the current scene.')) {
        location.reload();
    }
}

function openProject() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.dxf,.obj';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            updateStatusMessage(`Loading ${file.name}...`);
            // Implementation for file loading
        }
    };
    input.click();
}

function saveTerrain() {
    const data = {
        camera: {
            position: camera.position,
            rotation: camera.rotation
        },
        terrain: 'Bendigo geological data',
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bendigo-terrain.json';
    a.click();
    URL.revokeObjectURL(url);
    
    updateStatusMessage('Terrain saved successfully');
}

function takeScreenshot() {
    if (renderer) {
        const link = document.createElement('a');
        link.download = 'bendigo-terrain-screenshot.png';
        link.href = renderer.domElement.toDataURL();
        link.click();
        updateStatusMessage('Screenshot saved');
    }
}

function resetCamera() {
    if (camera && controls) {
        camera.position.set(0, 100, 200);
        camera.lookAt(0, 0, 0);
        controls.reset();
        updateStatusMessage('Camera reset to default position');
    }
}

function toggleWireframe() {
    viewerState.wireframe = !viewerState.wireframe;
    
    if (scene) {
        scene.traverse((object) => {
            if (object.isMesh && object.material) {
                object.material.wireframe = viewerState.wireframe;
            }
        });
    }
    
    updateStatusMessage(`Wireframe mode: ${viewerState.wireframe ? 'ON' : 'OFF'}`);
}

function toggleXRayMode() {
    viewerState.xray = !viewerState.xray;
    
    if (scene) {
        scene.traverse((object) => {
            if (object.isMesh && object.material) {
                object.material.transparent = viewerState.xray;
                object.material.opacity = viewerState.xray ? 0.5 : 1.0;
            }
        });
    }
    
    updateStatusMessage(`X-Ray mode: ${viewerState.xray ? 'ON' : 'OFF'}`);
}

function showAbout() {
    alert(`Bendigo 3D Underground Explorer
    
Version: 2.0
Professional geological visualization system
Built with Three.js and authentic geological data

© 2025 Bendigo Heritage Project`);
}

function updateStatusMessage(message) {
    const statusElement = document.getElementById('status-message');
    if (statusElement) {
        statusElement.textContent = message;
    }
}

function updateStatusBar() {
    // Update FPS counter
    setInterval(() => {
        if (window.stats && window.stats.fps) {
            document.getElementById('fps-counter').textContent = `FPS: ${Math.round(window.stats.fps)}`;
        }
    }, 1000);
    
    // Update coordinates on mouse move
    if (renderer && renderer.domElement) {
        renderer.domElement.addEventListener('mousemove', (event) => {
            const coords = document.getElementById('coordinates');
            if (coords && camera) {
                coords.textContent = `Camera: X:${camera.position.x.toFixed(1)} Y:${camera.position.y.toFixed(1)} Z:${camera.position.z.toFixed(1)}`;
            }
        });
    }
}

// Placeholder implementations for complex tools
function activateMeasureTool() { updateStatusMessage('Measure tool activated - Click two points to measure distance'); }
function activateCrossSectionTool() { updateStatusMessage('Cross-section tool activated'); }
function activateElevationTool() { updateStatusMessage('Elevation profile tool activated'); }
function openMiningAnalysis() { updateStatusMessage('Opening mining analysis panel...'); }
function openGeologicalLayers() { updateStatusMessage('Opening geological layers panel...'); }
function setSelectTool() { updateStatusMessage('Select tool active'); }
function setPanTool() { updateStatusMessage('Pan tool active'); }
function setRotateTool() { updateStatusMessage('Rotate tool active'); }
function setZoomTool() { updateStatusMessage('Zoom tool active'); }

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenuSystem);
} else {
    initMenuSystem();
}