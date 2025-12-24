// WebGL Quasicrystal implementation

// Vertex shader source code
const vsSource = `
attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;

varying vec2 vTextureCoord;

void main() {
    gl_Position = aVertexPosition;
    vTextureCoord = aTextureCoord;
}`;

// Fragment shader source code
const fsSource = `
precision highp float;

varying vec2 vTextureCoord;
uniform float uTime;
uniform float uScale;
uniform int uAngles;
uniform vec2 uResolution;
uniform bool uLogPolar;
uniform float uContrast;
uniform int uColormap;

// Jet colormap approximation
vec3 jet(float t) {
    vec3 color;
    color.r = 1.5 - abs(4.0 * t - 3.0);
    color.g = 1.5 - abs(4.0 * t - 2.0);
    color.b = 1.5 - abs(4.0 * t - 1.0);
    return clamp(color, 0.0, 1.0);
}

// Hot colormap approximation
vec3 hot(float t) {
    vec3 color;
    color.r = 3.0 * t;
    color.g = 3.0 * t - 1.0;
    color.b = 3.0 * t - 2.0;
    return clamp(color, 0.0, 1.0);
}

// Cool colormap approximation
vec3 cool(float t) {
    return vec3(t, 1.0 - t, 1.0);
}

// Viridis colormap approximation
vec3 viridis(float t) {
    vec3 c0 = vec3(0.267004, 0.004874, 0.329415);
    vec3 c1 = vec3(0.283072, 0.140376, 0.554642);
    vec3 c2 = vec3(0.197020, 0.367749, 0.614717);
    vec3 c3 = vec3(0.122176, 0.564257, 0.567797);
    vec3 c4 = vec3(0.143353, 0.746539, 0.424670);
    vec3 c5 = vec3(0.470229, 0.892270, 0.186805);
    vec3 c6 = vec3(0.993248, 0.906157, 0.143936);

    float x = t * 6.0;
    int i = int(x);
    float f = x - float(i);

    if (i == 0) return mix(c0, c1, f);
    if (i == 1) return mix(c1, c2, f);
    if (i == 2) return mix(c2, c3, f);
    if (i == 3) return mix(c3, c4, f);
    if (i == 4) return mix(c4, c5, f);
    return mix(c5, c6, f);
}

// Plasma colormap approximation
vec3 plasma(float t) {
    vec3 c0 = vec3(0.050383, 0.029803, 0.527975);
    vec3 c1 = vec3(0.254627, 0.013693, 0.615419);
    vec3 c2 = vec3(0.417642, 0.000564, 0.616836);
    vec3 c3 = vec3(0.562738, 0.051646, 0.504107);
    vec3 c4 = vec3(0.700389, 0.185808, 0.299414);
    vec3 c5 = vec3(0.853785, 0.377924, 0.116720);
    vec3 c6 = vec3(0.940015, 0.617563, 0.003143);

    float x = t * 6.0;
    int i = int(x);
    float f = x - float(i);

    if (i == 0) return mix(c0, c1, f);
    if (i == 1) return mix(c1, c2, f);
    if (i == 2) return mix(c2, c3, f);
    if (i == 3) return mix(c3, c4, f);
    if (i == 4) return mix(c4, c5, f);
    return mix(c5, c6, f);
}

// Magma colormap approximation
vec3 magma(float t) {
    vec3 c0 = vec3(0.001462, 0.000466, 0.013866);
    vec3 c1 = vec3(0.101406, 0.059452, 0.253682);
    vec3 c2 = vec3(0.320987, 0.120140, 0.475413);
    vec3 c3 = vec3(0.573983, 0.149071, 0.439514);
    vec3 c4 = vec3(0.820911, 0.226875, 0.309091);
    vec3 c5 = vec3(0.958897, 0.414975, 0.195940);
    vec3 c6 = vec3(0.993248, 0.684590, 0.335842);

    float x = t * 6.0;
    int i = int(x);
    float f = x - float(i);

    if (i == 0) return mix(c0, c1, f);
    if (i == 1) return mix(c1, c2, f);
    if (i == 2) return mix(c2, c3, f);
    if (i == 3) return mix(c3, c4, f);
    if (i == 4) return mix(c4, c5, f);
    return mix(c5, c6, f);
}

// Inferno colormap approximation
vec3 inferno(float t) {
    vec3 c0 = vec3(0.001462, 0.000466, 0.013866);
    vec3 c1 = vec3(0.087411, 0.043639, 0.241285);
    vec3 c2 = vec3(0.258234, 0.038571, 0.406116);
    vec3 c3 = vec3(0.450379, 0.017012, 0.429260);
    vec3 c4 = vec3(0.651200, 0.124673, 0.302312);
    vec3 c5 = vec3(0.831223, 0.290256, 0.106895);
    vec3 c6 = vec3(0.940015, 0.617563, 0.003143);

    float x = t * 6.0;
    int i = int(x);
    float f = x - float(i);

    if (i == 0) return mix(c0, c1, f);
    if (i == 1) return mix(c1, c2, f);
    if (i == 2) return mix(c2, c3, f);
    if (i == 3) return mix(c3, c4, f);
    if (i == 4) return mix(c4, c5, f);
    return mix(c5, c6, f);
}

// Rainbow colormap
vec3 rainbow(float t) {
    return vec3(
        sin(6.283185 * t),
        sin(6.283185 * t + 2.094395),
        sin(6.283185 * t + 4.188790)
    ) * 0.5 + 0.5;
}

// Copper colormap
vec3 copper(float t) {
    return vec3(
        min(1.0, 1.25 * t),
        min(1.0, 0.7812 * t),
        min(1.0, 0.4975 * t)
    );
}

// Bone colormap
vec3 bone(float t) {
    if (t < 0.375) {
        return vec3(t * (7.0/8.0), t * (7.0/8.0), t * (7.0/8.0) + 0.125);
    } else if (t < 0.75) {
        return vec3(t * (7.0/8.0), t * (7.0/8.0) + 0.125, t * (7.0/8.0) + 0.25);
    } else {
        return vec3(t * (7.0/8.0) + 0.125, t * (7.0/8.0) + 0.25, t * (7.0/8.0) + 0.375);
    }
}

void main() {
    // Calculate aspect ratio
    float aspectRatio = uResolution.x / uResolution.y;

    // Normalized coordinates [-1, 1] in both dimensions
    vec2 uv = vTextureCoord * 2.0 - 1.0;
    uv.x *= aspectRatio;

    // Apply log-polar transformation if enabled
    vec2 coord;
    if (uLogPolar) {
        float r = -log(length(uv)) * uScale;
        float theta = atan(uv.y, uv.x) * uScale;
        coord = vec2(theta, r);
    } else {
        coord = uv * uScale;
    }

    // Sum cosine waves at different angles
    float value = 0.0;
    float angi = 1.0 / float(uAngles);

    // First wave along x-axis
    value += cos(coord.x + uTime);

    // Add waves at different angles
    for (int i = 1; i < 30; i++) { // Increased from 13 to 30 for higher angle counts
        if (i >= uAngles) break;
        float angle = 3.14159265359 * float(i) * angi;
        float c = cos(angle);
        float s = sin(angle);
        value += cos(coord.x * c + coord.y * s + uTime);
    }

    // Scale the value
    value = (value * 0.5 / float(uAngles)) + 0.5;

    // Apply contrast
    if (uContrast != 0.0) {
        float mid = 0.5;
        if (uContrast > 0.0) {
            // Increase contrast
            value = (value > mid) ? mid + (value - mid) / (1.0 - mid) * (1.0 - mid) / (1.0 - 0.5 * uContrast) :
                                   mid - (mid - value) / mid * mid / (1.0 - 0.5 * uContrast);
        } else {
            // Decrease contrast
            value = mid + (value - mid) * (1.0 + 0.5 * uContrast);
        }
    }

    // Apply colormap
    vec3 color;
    if (uColormap == 0) { // grayscale
        color = vec3(value);
    } else if (uColormap == 1) { // jet
        color = jet(value);
    } else if (uColormap == 2) { // hot
        color = hot(value);
    } else if (uColormap == 3) { // cool
        color = cool(value);
    } else if (uColormap == 4) { // viridis
        color = viridis(value);
    } else if (uColormap == 5) { // plasma
        color = plasma(value);
    } else if (uColormap == 6) { // magma
        color = magma(value);
    } else if (uColormap == 7) { // inferno
        color = inferno(value);
    } else if (uColormap == 8) { // rainbow
        color = rainbow(value);
    } else if (uColormap == 9) { // copper
        color = copper(value);
    } else if (uColormap == 10) { // bone
        color = bone(value);
    } else if (uColormap == 11) { // inverted
        color = vec3(1.0 - value);
    }

    gl_FragColor = vec4(color, 1.0);
}`;

class QuasicrystalApp {
    constructor() {
        this.canvas = document.getElementById('glCanvas');
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');

        if (!this.gl) {
            alert('Unable to initialize WebGL. Your browser may not support it.');
            return;
        }

        this.params = {
            scale: 32,
            angles: 7,
            speed: 1,
            contrast: 0,
            logPolar: false,
            colormap: 0 // 0: grayscale, 1: jet, 2: hot, 3: cool
        };
        this.initControls();
        this.initShaderProgram();
        this.initBuffers();
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.time = 0;
        this.animate();
    }

    initControls() {
        const scaleSlider = document.getElementById('scaleSlider');
        const scaleValue = document.getElementById('scaleValue');

        scaleSlider.addEventListener('input', () => {
            this.params.scale = parseInt(scaleSlider.value);
            scaleValue.textContent = this.params.scale;
        });

        const anglesSlider = document.getElementById('anglesSlider');
        const anglesValue = document.getElementById('anglesValue');

        anglesSlider.addEventListener('input', () => {
            this.params.angles = parseInt(anglesSlider.value);
            anglesValue.textContent = this.params.angles;
        });

        const speedSlider = document.getElementById('speedSlider');
        const speedValue = document.getElementById('speedValue');

        speedSlider.addEventListener('input', () => {
            this.params.speed = parseFloat(speedSlider.value);
            speedValue.textContent = this.params.speed;
        });

        const contrastSlider = document.getElementById('contrastSlider');
        const contrastValue = document.getElementById('contrastValue');

        contrastSlider.addEventListener('input', () => {
            this.params.contrast = parseFloat(contrastSlider.value);
            contrastValue.textContent = this.params.contrast;
        });

        const logPolarCheck = document.getElementById('logPolarCheck');

        logPolarCheck.addEventListener('change', () => {
            this.params.logPolar = logPolarCheck.checked;
        });

        const colorSelect = document.getElementById('colorSelect');

        colorSelect.addEventListener('change', () => {
            switch (colorSelect.value) {
                case 'grayscale': this.params.colormap = 0; break;
                case 'jet': this.params.colormap = 1; break;
                case 'hot': this.params.colormap = 2; break;
                case 'cool': this.params.colormap = 3; break;
                case 'viridis': this.params.colormap = 4; break;
                case 'plasma': this.params.colormap = 5; break;
                case 'magma': this.params.colormap = 6; break;
                case 'inferno': this.params.colormap = 7; break;
                case 'rainbow': this.params.colormap = 8; break;
                case 'copper': this.params.colormap = 9; break;
                case 'bone': this.params.colormap = 10; break;
                case 'inverted': this.params.colormap = 11; break;
            }
        });

        this.initPresets();
    }

    initPresets() {
        this.presets = {
            default: {
                scale: 32,
                angles: 7,
                speed: 1,
                contrast: 0,
                logPolar: false,
                colormap: 0
            },
            fivefold: {
                scale: 64,
                angles: 5,
                speed: 0.8,
                contrast: 0.2,
                logPolar: false,
                colormap: 1
            },
            sevenfold: {
                scale: 42,
                angles: 7,
                speed: 1.2,
                contrast: 0.3,
                logPolar: false,
                colormap: 4
            },
            twelvefold: {
                scale: 96,
                angles: 12,
                speed: 0.5,
                contrast: 0.4,
                logPolar: false,
                colormap: 6
            },
            highcontrast: {
                scale: 48,
                angles: 8,
                speed: 1.5,
                contrast: 0.9,
                logPolar: false,
                colormap: 8
            },
            logpolar: {
                scale: 64,
                angles: 9,
                speed: 1.0,
                contrast: 0.4,
                logPolar: true,
                colormap: 2
            }
        };

        this.loadCustomPresets();

        const presetSelect = document.getElementById('presetSelect');
        const savePresetBtn = document.getElementById('savePresetBtn');
        const deletePresetBtn = document.getElementById('deletePresetBtn');

        presetSelect.addEventListener('change', () => {
            const selected = presetSelect.value;
            if (selected === 'custom') {
                // Create a new custom preset
                return;
            }

            if (this.presets[selected]) {
                this.applyPreset(selected);
            }
        });

        savePresetBtn.addEventListener('click', () => this.saveCurrentAsPreset());
        deletePresetBtn.addEventListener('click', () => {
            const selected = presetSelect.value;
            if (selected !== 'default' && selected !== 'fivefold' && selected !== 'sevenfold' && selected !== 'twelvefold' && selected !== 'highcontrast' && selected !== 'logpolar' && selected !== 'custom') {
                this.deletePreset(selected);
            }
        });
    }

    loadCustomPresets() {
        try {
            const savedPresets = localStorage.getItem('quasicrystalPresets');
            if (savedPresets) {
                const customPresets = JSON.parse(savedPresets);
                Object.assign(this.presets, customPresets);
                this.updatePresetOptions();
            }
        } catch (e) {
            console.warn('Failed to load custom presets from local storage', e);
        }
    }

    updatePresetOptions() {
        const presetSelect = document.getElementById('presetSelect');

        // Clear existing custom options (keep the built-ins and custom option)
        const optionsToKeep = ['default', 'fivefold', 'sevenfold', 'twelvefold', 'highcontrast', 'logpolar', 'custom'];
        Array.from(presetSelect.options).forEach(option => {
            if (!optionsToKeep.includes(option.value)) {
                presetSelect.removeChild(option);
            }
        });

        let customOption;
        for (let i = 0; i < presetSelect.options.length; i++) {
            if (presetSelect.options[i].value === 'custom') {
                customOption = presetSelect.options[i];
                break;
            }
        }

        Object.keys(this.presets).forEach(presetName => {
            if (!optionsToKeep.includes(presetName)) {
                const option = document.createElement('option');
                option.value = presetName;
                option.textContent = presetName;
                presetSelect.insertBefore(option, customOption);
            }
        });
    }

    applyPreset(presetName) {
        const preset = this.presets[presetName];
        if (!preset) return;

        document.getElementById('scaleSlider').value = preset.scale;
        document.getElementById('scaleValue').textContent = preset.scale;
        document.getElementById('anglesSlider').value = preset.angles;
        document.getElementById('anglesValue').textContent = preset.angles;
        document.getElementById('speedSlider').value = preset.speed;
        document.getElementById('speedValue').textContent = preset.speed;
        document.getElementById('contrastSlider').value = preset.contrast;
        document.getElementById('contrastValue').textContent = preset.contrast;
        document.getElementById('logPolarCheck').checked = preset.logPolar;

        const colorSelect = document.getElementById('colorSelect');
        const colormapNames = ['grayscale', 'jet', 'hot', 'cool', 'viridis', 'plasma',
                              'magma', 'inferno', 'rainbow', 'copper', 'bone', 'inverted'];
        if (preset.colormap < colormapNames.length) {
            colorSelect.value = colormapNames[preset.colormap];
        }

        this.params.scale = preset.scale;
        this.params.angles = preset.angles;
        this.params.speed = preset.speed;
        this.params.contrast = preset.contrast;
        this.params.logPolar = preset.logPolar;
        this.params.colormap = preset.colormap;
    }

    saveCurrentAsPreset() {
        const presetName = prompt('Enter a name for this preset:', '');
        if (!presetName || presetName.trim() === '') return;

        const presetNameClean = presetName.trim();

        const builtInPresets = ['default', 'fivefold', 'sevenfold', 'twelvefold', 'highcontrast', 'logpolar', 'custom'];
        if (builtInPresets.includes(presetNameClean)) {
            alert('Cannot overwrite built-in presets. Please choose a different name.');
            return;
        }

        const newPreset = {
            scale: this.params.scale,
            angles: this.params.angles,
            speed: this.params.speed,
            contrast: this.params.contrast,
            logPolar: this.params.logPolar,
            colormap: this.params.colormap
        };

        this.presets[presetNameClean] = newPreset;
        this.savePresetsToLocalStorage();
        this.updatePresetOptions();

        document.getElementById('presetSelect').value = presetNameClean;
    }

    deletePreset(presetName) {
        if (!confirm(`Are you sure you want to delete the preset "${presetName}"?`)) {
            return;
        }

        const builtInPresets = ['default', 'fivefold', 'sevenfold', 'twelvefold', 'highcontrast', 'logpolar', 'custom'];
        if (builtInPresets.includes(presetName)) {
            alert('Cannot delete built-in presets.');
            return;
        }

        delete this.presets[presetName];
        this.savePresetsToLocalStorage();
        this.updatePresetOptions();

        document.getElementById('presetSelect').value = 'default';
        this.applyPreset('default');
    }

    savePresetsToLocalStorage() {
        try {
            const builtInPresets = ['default', 'fivefold', 'sevenfold', 'twelvefold', 'highcontrast', 'logpolar', 'custom'];
            const customPresets = {};
            Object.keys(this.presets).forEach(key => {
                if (!builtInPresets.includes(key)) {
                    customPresets[key] = this.presets[key];
                }
            });

            localStorage.setItem('quasicrystalPresets', JSON.stringify(customPresets));
        } catch (e) {
            console.warn('Failed to save presets to local storage', e);
        }
    }

    initShaderProgram() {
        const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fsSource);

        const shaderProgram = this.gl.createProgram();
        this.gl.attachShader(shaderProgram, vertexShader);
        this.gl.attachShader(shaderProgram, fragmentShader);
        this.gl.linkProgram(shaderProgram);

        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        this.programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
                textureCoord: this.gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
            },
            uniformLocations: {
                time: this.gl.getUniformLocation(shaderProgram, 'uTime'),
                scale: this.gl.getUniformLocation(shaderProgram, 'uScale'),
                angles: this.gl.getUniformLocation(shaderProgram, 'uAngles'),
                resolution: this.gl.getUniformLocation(shaderProgram, 'uResolution'),
                logPolar: this.gl.getUniformLocation(shaderProgram, 'uLogPolar'),
                contrast: this.gl.getUniformLocation(shaderProgram, 'uContrast'),
                colormap: this.gl.getUniformLocation(shaderProgram, 'uColormap')
            },
        };
    }

    compileShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    initBuffers() {
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

        const positions = [
            -1.0, -1.0,
             1.0, -1.0,
             1.0,  1.0,
            -1.0, -1.0,
             1.0,  1.0,
            -1.0,  1.0,
        ];

        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array(positions),
            this.gl.STATIC_DRAW
        );

        this.textureCoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);

        const textureCoordinates = [
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
        ];

        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array(textureCoordinates),
            this.gl.STATIC_DRAW
        );
    }

    resizeCanvas() {
        const displayWidth = window.innerWidth;
        const displayHeight = window.innerHeight;

        if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;

            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.time += 0.01 * this.params.speed;
        this.drawScene();
    }

    drawScene() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // Tell WebGL to use our program
        this.gl.useProgram(this.programInfo.program);

        // Set up the position buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.vertexAttribPointer(
            this.programInfo.attribLocations.vertexPosition,
            2,          // 2 components per vertex
            this.gl.FLOAT,
            false,
            0,
            0
        );
        this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);

        // Set up the texture coordinates buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
        this.gl.vertexAttribPointer(
            this.programInfo.attribLocations.textureCoord,
            2,          // 2 components per vertex
            this.gl.FLOAT,
            false,
            0,
            0
        );
        this.gl.enableVertexAttribArray(this.programInfo.attribLocations.textureCoord);

        // Set the uniforms
        this.gl.uniform1f(this.programInfo.uniformLocations.time, this.time);
        this.gl.uniform1f(this.programInfo.uniformLocations.scale, this.params.scale);
        this.gl.uniform1i(this.programInfo.uniformLocations.angles, this.params.angles);
        this.gl.uniform2f(this.programInfo.uniformLocations.resolution, this.canvas.width, this.canvas.height);
        this.gl.uniform1i(this.programInfo.uniformLocations.logPolar, this.params.logPolar);
        this.gl.uniform1f(this.programInfo.uniformLocations.contrast, this.params.contrast);
        this.gl.uniform1i(this.programInfo.uniformLocations.colormap, this.params.colormap);

        // Draw the scene
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
}

// Start the application when the page loads
window.onload = () => {
    new QuasicrystalApp();
};
