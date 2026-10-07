const tasksConfig = [
    // Morning
    { id: 'gym', text: 'Gym Workout', time: 'morning', days: 'all' },
    { id: 'diet-morning', text: 'Eat Diet Food (Breakfast)', time: 'morning', days: 'all' },
    { id: 'college', text: 'Attend College', time: 'morning', days: 'weekday' },
    
    // Day
    { id: 'dsa', text: 'Learn DSA', time: 'day', days: 'all' },
    { id: 'code', text: 'Code (2 hours)', time: 'day', days: 'all' },
    { id: 'project-week', text: 'Create a Project (1 hour)', time: 'day', days: 'weekday' },
    { id: 'project-weekend', text: 'Build more on Projects', time: 'day', days: 'weekend' },
    { id: 'skills', text: 'Explore New Skills', time: 'day', days: 'weekend' },
    { id: 'video', text: 'Learn Video Editing', time: 'day', days: 'weekend' },
    { id: 'diet-day', text: 'Eat Diet Food (Lunch/Snacks)', time: 'day', days: 'all' },

    // Evening
    { id: 'communication', text: 'Improve Communication (30 mins)', time: 'evening', days: 'all' },
    { id: 'handwriting', text: 'Practice Handwriting (30 mins)', time: 'evening', days: 'all' },
    { id: 'diet-evening', text: 'Eat Diet Food (Dinner)', time: 'evening', days: 'all' }
];

let currentTasks = [];
let savedProgress = {};

// Initialization
function init() {
    setupDate();
    loadProgress();
    renderTasks();
    updateProgressRing();
}

function setupDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date-display').textContent = today.toLocaleDateString('en-US', options);

    const isWeekend = today.getDay() === 0 || today.getDay() === 6;
    const dayType = isWeekend ? 'weekend' : 'weekday';

    currentTasks = tasksConfig.filter(t => t.days === 'all' || t.days === dayType);
}

function getTodayString() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

function loadProgress() {
    const todayStr = getTodayString();
    const stored = localStorage.getItem('checklistData');
    
    if (stored) {
        const data = JSON.parse(stored);
        if (data.date === todayStr) {
            savedProgress = data.progress;
        } else {
            // New day, reset progress
            savedProgress = {};
            saveProgress();
        }
    }
}

function saveProgress() {
    const data = {
        date: getTodayString(),
        progress: savedProgress
    };
    localStorage.setItem('checklistData', JSON.stringify(data));
}

function toggleTask(id) {
    savedProgress[id] = !savedProgress[id];
    saveProgress();
    
    const taskElement = document.getElementById(`task-${id}`);
    if (savedProgress[id]) {
        taskElement.classList.add('completed');
    } else {
        taskElement.classList.remove('completed');
    }
    
    updateProgressRing();
}

function renderTasks() {
    const containers = {
        morning: document.getElementById('morning-tasks'),
        day: document.getElementById('day-tasks'),
        evening: document.getElementById('evening-tasks')
    };

    // Clear containers
    Object.values(containers).forEach(c => c.innerHTML = '');

    currentTasks.forEach(task => {
        const isCompleted = savedProgress[task.id] || false;
        
        const taskDiv = document.createElement('div');
        taskDiv.className = `task-item ${isCompleted ? 'completed' : ''}`;
        taskDiv.id = `task-${task.id}`;
        taskDiv.onclick = () => toggleTask(task.id);
        
        taskDiv.innerHTML = `
            <div class="task-checkbox">
                <svg viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <span class="task-text">${task.text}</span>
        `;
        
        containers[task.time].appendChild(taskDiv);
    });
    
    // Hide sections that might be empty (e.g. no morning tasks if configured later)
    ['morning', 'day', 'evening'].forEach(time => {
        const section = document.getElementById(`${time}-section`);
        if (containers[time].children.length === 0) {
            section.style.display = 'none';
        } else {
            section.style.display = 'block';
        }
    });
}

function updateProgressRing() {
    const total = currentTasks.length;
    const completed = currentTasks.filter(t => savedProgress[t.id]).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    const circle = document.querySelector('.progress-ring__circle');
    const text = document.getElementById('progress-text');
    
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    
    text.textContent = `${percent}%`;

    // Color logic based on >90% target
    if (percent >= 90) {
        circle.style.stroke = '#00ff88'; // Vibrant Green
        text.style.color = '#00ff88';
    } else {
        circle.style.stroke = '#4facfe'; // Blue
        text.style.color = '#fff';
    }
}

// Run app
init();
