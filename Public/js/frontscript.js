// ========== CACHE SINCRÓNICO DE TAREAS ==========
const uid = localStorage.getItem('uid');
let tasksCache = [];

function getTasks() {
    return tasksCache;
}

function saveTasks(tasks) {
    tasksCache = tasks;
    try { localStorage.setItem('tasks', JSON.stringify(tasks)); } catch (e) {}
}

async function initTasksCache() {
    if (!uid) { tasksCache = []; return; }
    try {
        const response = await fetch(`/api/tareas/usuario/${uid}`, { method: 'GET' });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const data = await response.json();
        tasksCache = Array.isArray(data) ? data : [];
        localStorage.setItem('tasks', JSON.stringify(tasksCache));
        loadTasks();
        renderCalendar(currentDate);
    } catch (error) {
        console.error('Error cargando tareas:', error);
        try {
            const stored = localStorage.getItem('tasks');
            tasksCache = stored ? JSON.parse(stored) : [];
        } catch (e) { tasksCache = []; }
    }
}

async function crearTareaEnServidor(task) {
    try {
        const response = await fetch(`/api/tareas/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const resultado = await response.json();
        await initTasksCache();
        return resultado;
    } catch (error) {
        console.error('Error creando tarea:', error);
        throw error;
    }
}

async function eliminarTareaDelServidor(tareaId) {
    try {
        const response = await fetch(`/api/tareas/${tareaId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        await initTasksCache();
    } catch (error) {
        console.error('Error eliminando tarea:', error);
        throw error;
    }
}

function getEntries() {
    const entries = localStorage.getItem('entries');
    return entries ? JSON.parse(entries) : [];
}

function saveEntries(entries) {
    localStorage.setItem('entries', JSON.stringify(entries));
}

// ========== CALENDARIO ==========

let currentDate = new Date();

function renderCalendar(date) {
    currentDate = new Date(date);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Actualizar header
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const monthYearElement = document.getElementById('monthYear');
    if (monthYearElement) {
        monthYearElement.textContent = `${monthNames[month]} ${year}`;
    }

    // Obtener primer día del mes y número de días
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const calendarElement = document.getElementById('calendar');
    if (!calendarElement) return;

    // Crear tabla
    let calendarHTML = '<table class="calendar"><thead><tr>';

    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    dayNames.forEach(day => {
        calendarHTML += `<th>${day}</th>`;
    });

    calendarHTML += '</tr></thead><tbody><tr>';

    let dayCount = 0;

    // Días del mes anterior
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        calendarHTML += createDayCell(day, 'other-month', year, month - 1);
        dayCount++;
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
        if (dayCount > 0 && dayCount % 7 === 0) {
            calendarHTML += '</tr><tr>';
        }
        calendarHTML += createDayCell(day, 'current-month', year, month);
        dayCount++;
    }

    // Días del mes siguiente
    let nextDayCount = 1;
    while (dayCount % 7 !== 0) {
        calendarHTML += createDayCell(nextDayCount, 'other-month', year, month + 1);
        nextDayCount++;
        dayCount++;
    }

    calendarHTML += '</tr></tbody></table>';

    calendarElement.innerHTML = calendarHTML;

    // Añadir event listeners para hover
    setupCalendarHover();
}

function createDayCell(day, monthClass, year, month) {
    // Ajustar mes si es negativo o mayor a 11
    let adjustedMonth = month;
    let adjustedYear = year;
    if (month < 0) {
        adjustedMonth = 11;
        adjustedYear = year - 1;
    } else if (month > 11) {
        adjustedMonth = 0;
        adjustedYear = year + 1;
    }

    const currentDateObj = new Date();
    const isToday = day === currentDateObj.getDate() &&
        adjustedMonth === currentDateObj.getMonth() &&
        adjustedYear === currentDateObj.getFullYear();

    let cellClass = `${monthClass}`;
    if (isToday) {
        cellClass += ' today';
    }

    // Verificar si hay tareas en este día
    const tasks = getTasks();
    const dateStr = `${adjustedYear}-${String(adjustedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayOfWeek = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'][new Date(adjustedYear, adjustedMonth, day).getDay()];

    // Combinar tareas recurrentes y tareas de una sola vez en esta fecha
    const tasksThisDay = tasks.filter(task => {
        // Tareas recurrentes: verificar día de la semana
        if (task.type === 'recurring' || !task.type) {
            const days = Array.isArray(task.days) ? task.days : [];
            return days.includes(dayOfWeek);
        }
        // Tareas de una sola vez: verificar fecha exacta
        if (task.type === 'once') {
            return task.date === dateStr;
        }
        return false;
    });

    if (tasksThisDay.length > 0) {
        cellClass += ' has-tasks';
    }

    let cellContent = `<div class="calendar-day-number">${day}</div>`;

    if (tasksThisDay.length > 0) {
        cellContent += `<div class="calendar-day-indicator">${tasksThisDay.length} tarea${tasksThisDay.length > 1 ? 's' : ''}</div>`;
        cellContent += `<div class="calendar-day-tooltip" style="display: none;">`;
        tasksThisDay.forEach(task => {
            cellContent += `<div class="tooltip-task">${task.name}</div>`;
        });
        cellContent += `</div>`;
    }

    return `<td class="${cellClass}" data-date="${dateStr}">${cellContent}</td>`;
}

function setupCalendarHover() {
    const calendarCells = document.querySelectorAll('.calendar td[data-date]');

    calendarCells.forEach(cell => {
        cell.addEventListener('mouseenter', function () {
            const tooltip = this.querySelector('.calendar-day-tooltip');
            if (tooltip) {
                tooltip.style.display = 'block';
            }
        });

        cell.addEventListener('mouseleave', function () {
            const tooltip = this.querySelector('.calendar-day-tooltip');
            if (tooltip) {
                tooltip.style.display = 'none';
            }
        });
    });
}

function setupCalendarNavigation() {
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');

    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar(currentDate);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar(currentDate);
        });
    }
}

// ========== TAREAS ==========

function loadTasks() {
    const tasks = getTasks();
    const tasksList = document.getElementById('tasksList');

    if (!tasksList) return;

    tasksList.innerHTML = '';

    if (tasks.length === 0) {
        tasksList.innerHTML = '<p style="text-align: center; color: #999;">No hay tareas añadidas</p>';
        return;
    }

    tasks.forEach((task) => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';

        let taskDetailsHTML = `<p>Frecuencia: ${task.frecuencia} veces al día</p>`;

        if (task.type === 'once') {
            const [year, month, day] = task.fecha_creacion.split('-');
            const taskDate = new Date(year, month - 1, day);
            const formattedDate = taskDate.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            taskDetailsHTML += `<p>Fecha: ${formattedDate}</p>`;
        } else {
            if (task.dias && task.dias.length > 0) {
                const days = Array.isArray(task.dias) ? task.dias.join(', ') : task.dias;
                const daysCapitalized = days.split(', ').map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ');
                taskDetailsHTML += `<p>Días: ${daysCapitalized}</p>`;
            }
        }

        if (task.fecha_limite) {
            taskDetailsHTML += `<p>fecha limite: ${task.fecha_limite}</p>`;
        }

        taskElement.innerHTML = `
            <div class="task-info">
                <div class="task-name">${task.nombre}</div>
                <div class="task-details">
                    ${taskDetailsHTML}
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-delete" onclick="deleteTask(${task.tarea_id})">Eliminar</button>
            </div>
        `;

        tasksList.appendChild(taskElement);
    });
}

function setupTaskForm() {
    const addBtn = document.getElementById('addTaskBtn');

    if (!addBtn) return;

    addBtn.addEventListener('click', async function () {
        const name = document.getElementById('taskName').value;
        const frequency = document.getElementById('taskFrequency').value;
        const taskType = document.getElementById('taskType')?.value || 'recurring';
        const daysSelect = document.getElementById('taskDays');
        const dateInput = document.getElementById('taskDate');
        const time = document.getElementById('taskTime').value;

        if (!name || !frequency) {
            alert('Por favor completa todos los campos');
            return;
        }

        let selectedDays = [];
        let selectedDate = null;

        if (taskType === 'recurring') {
            selectedDays = Array.from(daysSelect.selectedOptions).map(option => option.value);

            if (selectedDays.length === 0) {
                alert('Por favor selecciona al menos un día');
                return;
            }
        } else if (taskType === 'once') {
            selectedDate = dateInput.value;

            if (!selectedDate) {
                alert('Por favor selecciona una fecha');
                return;
            }
        }
        const timestamp = Date.now();
const dateObject = new Date(timestamp);

        // Mapear al formato del backend
        const task = {
            nombre: name,
            uid: uid ? parseInt(uid) : null,
            repetible: taskType === 'recurring',
            fecha_limite: dateObject.toLocaleDateString(),
            frecuencia: frequency ?? 0,
            dias: selectedDays
        };

        try {
            await crearTareaEnServidor(task);
            
            // Limpiar formulario
            document.getElementById('taskName').value = '';
            document.getElementById('taskFrequency').value = '';
            daysSelect.selectedIndex = -1;
            dateInput.value = '';
            document.getElementById('taskTime').value = '';
            if (document.getElementById('taskType')) {
                document.getElementById('taskType').value = 'recurring';
            }
            toggleTaskDaysField();
            alert('Tarea añadida exitosamente');
        } catch (error) {
            alert('Error al guardar la tarea: ' + error.message);
        }
    });

    // Configurar cambio de tipo de tarea
    const taskTypeSelect = document.getElementById('taskType');
    if (taskTypeSelect) {
        taskTypeSelect.addEventListener('change', toggleTaskDaysField);
    }
}

function toggleTaskDaysField() {
    const taskType = document.getElementById('taskType')?.value || 'recurring';
    const daysField = document.getElementById('taskDaysField');
    const dateField = document.getElementById('taskDateField');

    if (daysField && dateField) {
        if (taskType === 'recurring') {
            daysField.style.display = 'block';
            dateField.style.display = 'none';
        } else {
            daysField.style.display = 'none';
            dateField.style.display = 'block';
        }
    }
}

function deleteTask(tareaId) {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        eliminarTareaDelServidor(tareaId)
            .catch(error => alert('Error al eliminar: ' + error.message));
    }
}

// ========== DIARIO ==========

function setTodayDate() {
    const dateInput = document.getElementById('entryDate');
    if (dateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${year}-${month}-${day}`;
    }
}

function loadEntries() {
    const entries = getEntries();
    const entriesList = document.getElementById('entriesList');

    if (!entriesList) return;

    entriesList.innerHTML = '';

    if (entries.length === 0) {
        entriesList.innerHTML = '<p style="text-align: center; color: #999;">No hay entradas en el diario</p>';
        return;
    }

    // Ordenar por fecha descendente
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    entries.forEach((entry, index) => {
        const entryElement = document.createElement('div');
        entryElement.className = 'entry-item';

        const [year, month, day] = entry.date.split('-');
        const entryDate = new Date(year, month - 1, day);
        const formattedDate = entryDate.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const preview = entry.content.substring(0, 100) + (entry.content.length > 100 ? '...' : '');

        entryElement.innerHTML = `
            <div class="entry-info">
                <div class="entry-date">${formattedDate}</div>
                <div class="entry-preview">${preview}</div>
            </div>
            <div class="entry-actions">
                <button class="btn-delete" onclick="deleteEntry(${index})">Eliminar</button>
            </div>
        `;

        entriesList.appendChild(entryElement);
    });
}

function setupEntryForm() {
    const addBtn = document.getElementById('addEntryBtn');

    if (!addBtn) return;

    addBtn.addEventListener('click', function () {
        const date = document.getElementById('entryDate').value;
        const content = document.getElementById('entryContent').value;

        if (!date || !content) {
            alert('Por favor completa todos los campos');
            return;
        }

        const entry = {
            date: date,
            content: content,
            createdAt: new Date().toISOString()
        };

        const entries = getEntries();
        entries.push(entry);
        saveEntries(entries);

        // Limpiar formulario
        document.getElementById('entryContent').value = '';
        setTodayDate();

        // Recargar lista
        loadEntries();

        alert('Entrada guardada exitosamente');
    });
}

function deleteEntry(index) {
    if (confirm('¿Estás seguro de que deseas eliminar esta entrada?')) {
        const entries = getEntries();
        entries.splice(index, 1);
        saveEntries(entries);
        loadEntries();
    }
}
// funcion para volver al menú de inicio de sesión y cerrar sesión 