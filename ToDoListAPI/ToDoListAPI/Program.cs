using ToDoListAPI.Models;
using ToDoListAPI.Models.Interfaces;

namespace ToDoListAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddSingleton<ITaskRepository, TaskRepository>();
            builder.Services.AddControllers();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            
            app.UseDefaultFiles();

            app.UseStaticFiles();

            app.UseAuthorization();
            
            app.MapControllers();

            app.Run();
        }
    }
}
