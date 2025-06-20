package com.nassim.backend.service.impl;

import com.nassim.backend.model.Task;
import com.nassim.backend.model.User;
import com.nassim.backend.repository.TaskRepository;
import com.nassim.backend.service.TaskService;
import com.nassim.backend.service.UserService;
import com.nassim.backend.DTO.TaskDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserService userService;

    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository, UserService userService) {
        this.taskRepository = taskRepository;
        this.userService = userService;
    }

    private TaskDTO convertToDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setUserId(task.getUser().getId());
        // add more fields if needed
        return dto;
    }
    private List<TaskDTO> convertToDTO(List<Task> tasks) {
        return tasks.stream()
                .map(this::convertToDTO) // calls the single-task version above
                .toList();
    }

    @Override
    public TaskDTO createTask(TaskDTO taskDTO) {
        User user = userService.getUserById(taskDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setUser(user);

        Task savedTask = taskRepository.save(task);

        // Convert entity to DTO before returning
        return convertToDTO(savedTask);
    }


    @Override
    public List<TaskDTO> getAllTasks() {
         return convertToDTO(taskRepository.findAll());

    }

    @Override
    public Optional<TaskDTO> getTaskById(Long id) {
        return taskRepository.findById(id).map(this::convertToDTO);
    }

    @Override
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        User user = userService.getUserById(taskDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task updated = taskRepository.findById(id)
                .map(existingTask -> {
                    existingTask.setTitle(taskDTO.getTitle());
                    existingTask.setDescription(taskDTO.getDescription());
                    existingTask.setUser(user);
                    return taskRepository.save(existingTask);
                })
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        return convertToDTO(updated);
    }


    @Override
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    @Override
    public List<TaskDTO> getTasksByUserId(Long userId) {
        return convertToDTO(taskRepository.findByUserId(userId));
    }
}
