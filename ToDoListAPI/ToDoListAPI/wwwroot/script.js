document.addEventListener('DOMContentLoaded', () => {
    loadTasks(); 
 
    const form = document.getElementById('taskForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const taskInput = document.getElementById('taskInput');
        const name = taskInput.value.trim();

        if (!name) {
            alert("Task name cannot be empty.");
            return;
        }

        const taskToSend = { Name: name };

        const response = await fetch('/tasks/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskToSend)
        });

        if (response.ok) {
            taskInput.value = '';
            loadTasks(); // 
        } else {
            const msg = await response.text();
            alert(msg);
        }
    });
    
    const list = document.getElementById('taskList');
    list.addEventListener('click', async (event) => {
        const target = event.target;

        if (target.classList.contains('done-btn')) {
            target.disabled = true;
            target.style.display = 'none';
            const li = target.closest('li');
            const id = li.getAttribute('data-id');
            await markTaskDone(id);
        }
    });
});
async function loadTasks() {
    const response = await fetch('/tasks');
    allTasks = await response.json();
    renderTasks(allTasks);
    
}
function renderTasks(tasksToShow) {
    const list = document.getElementById('taskList');
    list.innerHTML = '';

    if (tasksToShow.length === 0) {
        list.innerHTML = '<li>No tasks were found.</li>';
        return;
    }

    tasksToShow.forEach(task => {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        const doneBtn = document.createElement('button');
        doneBtn.classList.add('done-btn');
        doneBtn.textContent = '✓ Done';
        li.appendChild(doneBtn);
        if (task.isDone) {
            li.classList.add('done');
        }
        const textSpan = document.createElement('span');
        textSpan.textContent = task.name + (task.isDone ? ' ✅' : '');
        li.appendChild(textSpan);
        li.appendChild(doneBtn);
        list.appendChild(li);
    })
}

function filterTasks(type) {
    if (type === 'all') {
        renderTasks(allTasks);
    }
    else if (type === 'active') {
        renderTasks(allTasks.filter(task => !task.isDone));
    }
    else if (type === 'completed') {
        renderTasks(allTasks.filter(task => task.isDone));
    }
}
async function markTaskDone(id) {
    try {
        const response = await fetch(`/tasks/${id}/done`, {
            method: 'PUT'
        });

        if (response.ok) {
            loadTasks(); // Refresh list
        } else {
            alert('Failed to mark task as done.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}