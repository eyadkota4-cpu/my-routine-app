const daysAr = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
let routineData = JSON.parse(localStorage.getItem('weeklyRoutine')) || null;

function init() {
    if (!routineData) showSetup(); else showToday();
}

function showSetup() {
    document.getElementById('mainPage').classList.add('hidden');
    document.getElementById('setupPage').classList.remove('hidden');
    const container = document.getElementById('daysSetupContainer');
    container.innerHTML = '';
    daysAr.forEach((day, index) => {
        const currentTasks = routineData ? routineData[index].tasks.map(t => t.text).join('\n') : '';
        container.innerHTML += `
            <div class="day-input-group">
                <label>📍 مهام ${day}:</label>
                <textarea id="input-day-${index}" rows="3">${currentTasks}</textarea>
            </div>`;
    });
    window.scrollTo(0,0);
}

function saveWeeklyRoutine() {
    routineData = daysAr.map((day, index) => {
        const text = document.getElementById(`input-day-${index}`).value;
        const tasks = text.split('\n').filter(t => t.trim() !== '').map(t => ({ text: t.trim(), completed: false }));
        return { dayName: day, tasks: tasks };
    });
    localStorage.setItem('weeklyRoutine', JSON.stringify(routineData));
    showToday();
}

function showToday() {
    document.getElementById('setupPage').classList.add('hidden');
    document.getElementById('mainPage').classList.remove('hidden');
    const todayIndex = new Date().getDay();
    document.getElementById('dayTitle').innerText = `اليوم: ${daysAr[todayIndex]} 🎯`;
    renderTasks(todayIndex);
    window.scrollTo(0,0);
}

function renderTasks(dayIndex) {
    const list = document.getElementById('taskList');
    const tasks = routineData[dayIndex].tasks;
    list.innerHTML = '';
    tasks.forEach((task, i) => {
        const li = document.createElement('li');
        li.onclick = () => toggleTask(dayIndex, i); // الضغط على السطر كله يعلم صح
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="${task.completed ? 'done' : ''}">${task.text}</span>
        `;
        list.appendChild(li);
    });
    updateProgress(tasks);
}

function toggleTask(dayIndex, taskIndex) {
    routineData[dayIndex].tasks[taskIndex].completed = !routineData[dayIndex].tasks[taskIndex].completed;
    localStorage.setItem('weeklyRoutine', JSON.stringify(routineData));
    renderTasks(dayIndex);
}

function updateProgress(tasks) {
    if (tasks.length === 0) return;
    const completed = tasks.filter(t => t.completed).length;
    const percent = Math.round((completed / tasks.length) * 100);
    document.getElementById('progressBar').style.width = percent + "%";
    let level = "بداية موفقة ☕";
    if (percent >= 90) level = "بطل خارق! 🦸‍♂️";
    else if (percent >= 70) level = "وحش الروتين 🦁";
    document.getElementById('levelStatus').innerText = `المستوى: ${level} (${percent}%)`;
}

init();
