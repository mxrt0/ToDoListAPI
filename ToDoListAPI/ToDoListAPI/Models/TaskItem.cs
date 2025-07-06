using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel.DataAnnotations;

namespace ToDoListAPI.Models
{
    public class TaskItem
    {
        [BindNever]
        public string? Id { get; set; }
        [Required]
        public string Name { get; set; }
        public bool IsDone { get; set; }
    }
}
