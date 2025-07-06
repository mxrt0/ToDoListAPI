using System.Text.Json;
using ToDoListAPI.Models.Interfaces;

namespace ToDoListAPI.Models
{
    public class TaskRepository : ITaskRepository
    {
        private readonly string _storagePath = "tasks.json";
        private readonly JsonSerializerOptions prettyPrint = new JsonSerializerOptions { WriteIndented = true };
        private readonly object _fileLock = new object();
        public bool AddTask(TaskItem task)
        {
            var tasks = GetAllTasks();
            if (!tasks.Any(t => string.Equals(t.Name, task.Name, StringComparison.OrdinalIgnoreCase)))
            {
                task.Id = Guid.NewGuid().ToString();
                tasks.Add(task);
                var tasksJSON = JsonSerializer.Serialize(tasks, prettyPrint);
                File.WriteAllText(_storagePath, tasksJSON);
                return true;
            }
            else
            {
                return false;
            }
            
        }
        public bool MarkTaskDone(string id)
        {
            lock (_fileLock)
            {
                if (string.IsNullOrWhiteSpace(id))
                {
                    return false;
                }

                var tasks = GetAllTasks();
                var taskToMarkDone = tasks.Find(t => string.Equals(t.Id.Trim(), id.Trim(), StringComparison.OrdinalIgnoreCase));
                if (taskToMarkDone is not null)
                {
                    taskToMarkDone.IsDone = true;
                    var tasksJSON = JsonSerializer.Serialize(tasks, prettyPrint);
                    File.WriteAllText(_storagePath, tasksJSON);
                    return true;
                }
                return false;
            }
            
        }
    
        public List<TaskItem> GetAllTasks()
        {
            if (!File.Exists(_storagePath))
            {
                return new List<TaskItem>();
            }

            var tasksJSON = File.ReadAllText(_storagePath);
            return JsonSerializer.Deserialize<List<TaskItem>>(tasksJSON) ?? new List<TaskItem>();
        }
    }
}
