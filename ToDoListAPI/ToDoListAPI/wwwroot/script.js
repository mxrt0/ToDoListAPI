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
        const doneBtn = event.target.closest('.done-btn');
        console.log('Clicked element:', event.target);
        console.log('Resolved doneBtn:', doneBtn);
        if (doneBtn) {

            doneBtn.classList.add('.hide');
            const li = event.target.closest('li');
            const id = li.getAttribute('data-id');
            await markTaskDone(id);
            
        }
    
    });
    const clearAllBtn = document.getElementById('clearAllBtn');
    clearAllBtn.addEventListener('click', async (event) => {
        const response = await fetch('/tasks/clearAll', {
            method: 'DELETE'
        });
        if (response.ok) {
            clearAllBtn.style.display = 'none';
            list.innerHTML = '';
            setTimeout(() => {
                alert('Successfully cleared task list!');
            }, 10);
        }
        else {
            alert(response.text()); // won't happen but still check in case :D
        }
        loadTasks();
        
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
    const clearAllBtn = document.getElementById('clearAllBtn');

    if (tasksToShow.length === 0) {
        list.innerHTML = '<li>No tasks were found.</li>';
        clearAllBtn.style.display = 'none';
        return;
    }

    tasksToShow.forEach(task => {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
       if (!task.isDone) {
                const doneBtn = document.createElement('button');
        doneBtn.classList.add('done-btn');
        doneBtn.textContent = '✓ Done';
        const textSpan = document.createElement('span');
        textSpan.textContent = task.name + (task.isDone ? ' ✅' : '');
        li.appendChild(textSpan);
        li.appendChild(doneBtn);
        list.appendChild(li);
        
       }
        else {
            if (task.isDone) {
            li.classList.add('done');
        }
        const textSpan = document.createElement('span');
        textSpan.textContent = task.name + (task.isDone ? ' ✅' : '');
        li.appendChild(textSpan);
        list.appendChild(li);
        }
        
    })
    clearAllBtn.style.display = 'flex';
    clearAllBtn.style.justifySelf = 'center';
}

function filterTasks(type) {
    const clearAllBtn = document.getElementById('clearAllBtn');
    if (type === 'all') {
        renderTasks(allTasks);
        clearAllBtn.style.display = 'flex';
    }
    else if (type === 'active') {
        renderTasks(allTasks.filter(task => !task.isDone));
        clearAllBtn.style.display = 'none';
    }
    else if (type === 'completed') {
        renderTasks(allTasks.filter(task => task.isDone));
        clearAllBtn.style.display = 'none';
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