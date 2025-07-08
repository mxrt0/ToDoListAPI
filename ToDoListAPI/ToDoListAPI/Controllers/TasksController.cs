using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using ToDoListAPI.Models;
using ToDoListAPI.Models.Interfaces;

namespace ToDoListAPI.Controllers
{
    [ApiController]
    [Route("tasks")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskRepository _repo;

        public TasksController(ITaskRepository repo)
        {
            _repo = repo;
        }

        [HttpGet] 
        public IActionResult GetTasks()
        {
           var tasks = _repo.GetAllTasks();
           return Ok(tasks);
        }
        [HttpPost("add")] 
        public IActionResult AddTask( [FromBody] TaskItem task)
        {
            if (string.IsNullOrWhiteSpace(task.Name.Trim()))
                return BadRequest("Task name cannot be empty.");

            if (_repo.AddTask(task))
            {
                return Ok();
            }
            else
            {
                return BadRequest("A task with the same name already exists.");
            }
            
        }
        [HttpPut("{id}/done")]
        public IActionResult MarkTaskDone(string id)
        {
            if (_repo.MarkTaskDone(id))
            {
                return Ok();
            }
            else
            {
                return NotFound("Task not found.");
            }
        }
        [HttpDelete("clearAll")]
        public IActionResult ClearAllTasks()
        {
            if (_repo.ClearAllTasks())
            {
                return Ok();
            }
            else
            {
                return BadRequest("There are currently no tasks.");
            }

        }
        
    }
}
