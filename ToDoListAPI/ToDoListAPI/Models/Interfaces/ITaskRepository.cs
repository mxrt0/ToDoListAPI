namespace ToDoListAPI.Models.Interfaces
{
    public interface ITaskRepository
    {
        bool AddTask(TaskItem task);
        List<TaskItem> GetAllTasks();
        bool MarkTaskDone(string id);

    }
}
