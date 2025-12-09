// ========== PANEL DE ACCESIBILIDAD ==========

// Variable global para almacenar el tamaño actual
let currentFontSize = 'normal';
let currentScale = 1; // Guardar la escala actual

// Función para crear y añadir el HTML del panel
function createAccessibilityPanel() {
    // Verificar si ya existe para evitar duplicados
    if (document.getElementById('accessibility-panel')) {
        return;
    }

    // Crear el contenedor del panel
    const panelHTML = `
        <div id="accessibility-panel" class="accessibility-panel">
            <button id="accessibility-toggle" class="accessibility-toggle" aria-label="Abrir panel de accesibilidad">
                ♿
            </button>

            <div id="accessibility-menu" class="accessibility-menu hidden">
                <div class="accessibility-header">
                    <h3>Accesibilidad</h3>
                    <button id="accessibility-close" class="accessibility-close" aria-label="Cerrar panel">✕</button>
                </div>

                <div class="accessibility-content">
                    <!-- Tamaño de letra -->
                    <div class="accessibility-section">
                        <label class="accessibility-label">Tamaño de Letra:</label>
                        <div class="font-size-controls">
                            <button class="font-size-btn" data-size="small" aria-label="Letra pequeña">A-</button>
                            <button class="font-size-btn" data-size="normal" aria-label="Letra normal">A</button>
                            <button class="font-size-btn" data-size="large" aria-label="Letra grande">A+</button>
                            <button class="font-size-btn" data-size="extra-large" aria-label="Letra muy grande">A++</button>
                        </div>
                    </div>

                    <!-- Contraste -->
                    <div class="accessibility-section">
                        <label class="accessibility-label">Contraste:</label>
                        <div class="contrast-controls">
                            <button class="contrast-btn" data-contrast="normal" aria-label="Contraste normal">Normal</button>
                            <button class="contrast-btn" data-contrast="high" aria-label="Alto contraste">Alto</button>
                        </div>
                    </div>

                    <!-- Daltonismo -->
                    <div class="accessibility-section">
                        <label class="accessibility-label">Daltonismo:</label>
                        <div class="colorblind-controls">
                            <button class="colorblind-btn" data-colorblind="none" aria-label="Sin filtro">Normal</button>
                            <button class="colorblind-btn" data-colorblind="protanopia" aria-label="Protanopia">Protanopia</button>
                            <button class="colorblind-btn" data-colorblind="deuteranopia" aria-label="Deuteranopia">Deuteranopia</button>
                            <button class="colorblind-btn" data-colorblind="tritanopia" aria-label="Tritanopia">Tritanopia</button>
                            <button class="colorblind-btn" data-colorblind="achromatopsia" aria-label="Acromatopsia">Acromatopsia</button>
                        </div>
                    </div>

                    <!-- Tema -->
                    <div class="accessibility-section">
                        <label class="accessibility-label">Tema:</label>
                        <div class="theme-controls">
                            <button class="theme-btn" data-theme="light" aria-label="Tema claro">☀️ Claro</button>
                            <button class="theme-btn" data-theme="dark" aria-label="Tema oscuro">🌙 Oscuro</button>
                        </div>
                    </div>

                    <!-- Botón de reinicio -->
                    <button id="reset-btn" class="btn-reset" aria-label="Reiniciar configuración de accesibilidad">Reiniciar</button>
                </div>
            </div>
        </div>
    `;
//Inserta ahora fuera del body porque ya no puedo más :D
document.documentElement.insertAdjacentHTML('beforeend', panelHTML);

}

// Función para inicializar todos los event listeners
function initAccessibilityPanel() {
    // Crear el panel si no existe
    createAccessibilityPanel();

    // Obtener referencias a elementos
    const toggle = document.getElementById('accessibility-toggle');
    const menu = document.getElementById('accessibility-menu');
    const closeBtn = document.getElementById('accessibility-close');
    const resetBtn = document.getElementById('reset-btn');

    // Verificar que los elementos existen
    if (!toggle || !menu || !closeBtn || !resetBtn) {
        console.error('No se pudieron encontrar los elementos del panel de accesibilidad');
        return;
    }

    // Event listeners para abrir/cerrar
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('hidden');
        // Ocultar el botón cuando se abre el menú
        if (!menu.classList.contains('hidden')) {
            toggle.classList.add('hidden-toggle');
        } else {
            toggle.classList.remove('hidden-toggle');
        }
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.add('hidden');
        toggle.classList.remove('hidden-toggle');
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#accessibility-panel')) {
            menu.classList.add('hidden');
            toggle.classList.remove('hidden-toggle');
        }
    });

    // Tamaño de letra
    document.querySelectorAll('.font-size-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const size = e.target.dataset.size;
            setFontSize(size);
            updateActiveButton('.font-size-btn', btn);
        });
    });

    // Contraste
    document.querySelectorAll('.contrast-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const contrast = e.target.dataset.contrast;
            setContrast(contrast);
            updateActiveButton('.contrast-btn', btn);
        });
    });

    // Daltonismo
    document.querySelectorAll('.colorblind-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const colorblind = e.target.dataset.colorblind;
            setColorblindMode(colorblind);
            updateActiveButton('.colorblind-btn', btn);
        });
    });

    // Tema
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const theme = e.target.dataset.theme;
            setTheme(theme);
            updateActiveButton('.theme-btn', btn);
        });
    });

    // Reinicio
    resetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetAccessibility();
    });

    // Cargar configuración guardada
    loadAccessibilitySettings();
}

function updateActiveButton(selector, activeBtn) {
    document.querySelectorAll(selector).forEach(btn => {
        btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
}

function setFontSize(size) {
    // MULTIPLICADORES CON LÍMITES
    const scales = {
        'small': 0.85,      // 85% - MÍNIMO
        'normal': 1,        // 100% - NORMAL
        'large': 1.2,       // 120%
        'extra-large': 1.5  // 150% - MÁXIMO
    };

    // Obtener el multiplicador para este tamaño
    const multiplier = scales[size] || 1;

    // GUARDAR EL MULTIPLICADOR, NO ACUMULAR
    currentScale = multiplier;
    currentFontSize = size;

    // Aplicar SOLO el multiplicador guardado (no acumulativo)
    document.documentElement.style.fontSize = (14 * multiplier) + 'px';
    document.body.style.fontSize = (14 * multiplier) + 'px';

    // USAR TRANSFORM SCALE PARA AFECTAR TODO
    // Pero aplicar el valor DIRECTO, no acumulativo
    document.body.style.transform = 'scale(' + multiplier + ')';
    document.body.style.transformOrigin = 'top left';
    document.body.style.width = (100 / multiplier) + '%';
    document.body.style.height = 'auto';

    localStorage.setItem('accessibilityFontSize', size);
}

function setContrast(contrast) {
    const root = document.documentElement;

    if (contrast === 'high') {
        root.style.filter = 'contrast(1.5)';
        localStorage.setItem('accessibilityContrast', contrast);
    } else {
        root.style.filter = '';
        localStorage.setItem('accessibilityContrast', 'normal');
    }
}

function setColorblindMode(type) {
    const root = document.documentElement;

    switch(type) {
        case 'achromatopsia':
            root.style.filter = 'grayscale(100%)';
            break;
        case 'protanopia':
            root.style.filter = 'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22><filter id=%22protanopia%22><feColorMatrix type=%22matrix%22 values=%220.567 0.433 0.000 0 0 0.558 0.442 0.000 0 0 0.000 0.242 0.758 0 0 0.000 0.000 0.000 1.000 0%22/></filter></svg>#protanopia")';
            break;
        case 'deuteranopia':
            root.style.filter = 'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22><filter id=%22deuteranopia%22><feColorMatrix type=%22matrix%22 values=%220.625 0.375 0.000 0 0 0.700 0.300 0.000 0 0 0.000 0.300 0.700 0 0 0.000 0.000 0.000 1.000 0%22/></filter></svg>#deuteranopia")';
            break;
        case 'tritanopia':
            root.style.filter = 'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22><filter id=%22tritanopia%22><feColorMatrix type=%22matrix%22 values=%220.950 0.050 0.000 0 0 0.000 0.433 0.567 0 0 0.000 0.475 0.525 0 0 0.000 0.000 0.000 1.000 0%22/></filter></svg>#tritanopia")';
            break;
        default:
            root.style.filter = '';
    }

    localStorage.setItem('accessibilityColorblind', type);
}

function setTheme(theme) {
    const root = document.documentElement;

    if (theme === 'dark') {
        root.setAttribute('data-color-scheme', 'dark');
        localStorage.setItem('accessibilityTheme', 'dark');
    } else {
        root.setAttribute('data-color-scheme', 'light');
        localStorage.setItem('accessibilityTheme', 'light');
    }
}

function loadAccessibilitySettings() {
    // Cargar tamaño de letra
    const fontSize = localStorage.getItem('accessibilityFontSize') || 'normal';
    setFontSize(fontSize);
    const fontSizeBtn = document.querySelector(`[data-size="${fontSize}"]`);
    if (fontSizeBtn) fontSizeBtn.classList.add('active');

    // Cargar contraste
    const contrast = localStorage.getItem('accessibilityContrast') || 'normal';
    setContrast(contrast);
    const contrastBtn = document.querySelector(`[data-contrast="${contrast}"]`);
    if (contrastBtn) contrastBtn.classList.add('active');

    // Cargar daltonismo
    const colorblind = localStorage.getItem('accessibilityColorblind') || 'none';
    setColorblindMode(colorblind);
    const colorblindBtn = document.querySelector(`[data-colorblind="${colorblind}"]`);
    if (colorblindBtn) colorblindBtn.classList.add('active');

    // Cargar tema
    const theme = localStorage.getItem('accessibilityTheme') || 'light';
    setTheme(theme);
    const themeBtn = document.querySelector(`[data-theme="${theme}"]`);
    if (themeBtn) themeBtn.classList.add('active');
}

function resetAccessibility() {
    // Limpiar localStorage
    localStorage.removeItem('accessibilityFontSize');
    localStorage.removeItem('accessibilityContrast');
    localStorage.removeItem('accessibilityColorblind');
    localStorage.removeItem('accessibilityTheme');

    // Reiniciar valores
    currentScale = 1;
    currentFontSize = 'normal';

    document.documentElement.style.fontSize = '14px';
    document.body.style.fontSize = '14px';
    document.body.style.transform = 'scale(1)';
    document.body.style.transformOrigin = 'top left';
    document.body.style.width = '100%';
    document.documentElement.style.filter = '';
    document.documentElement.setAttribute('data-color-scheme', 'light');

    // Reiniciar botones
    document.querySelectorAll('.font-size-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-size="normal"]')?.classList.add('active');

    document.querySelectorAll('.contrast-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-contrast="normal"]')?.classList.add('active');

    document.querySelectorAll('.colorblind-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-colorblind="none"]')?.classList.add('active');

    document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-theme="light"]')?.classList.add('active');
}

// Inicializar cuando el DOM esté completamente listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibilityPanel);
} else {
    // Si el script se carga después del DOMContentLoaded
    setTimeout(initAccessibilityPanel, 100);
}

// Reintentar si algo falla
setTimeout(() => {
    if (!document.getElementById('accessibility-panel')) {
        console.warn('Panel de accesibilidad no encontrado, reintentando...');
        initAccessibilityPanel();
    }
}, 500);