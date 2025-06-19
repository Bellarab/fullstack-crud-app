package com.nassim.backend.service;

import com.nassim.backend.DTO.TaskDTO;
import com.nassim.backend.model.Task;
import java.util.List;
import java.util.Optional;

public interface TaskService {
    TaskDTO createTask(TaskDTO taskDTO);
    List<Task> getAllTasks();
    Optional<Task> getTaskById(Long id);
    Task updateTask(Long id, Task updatedTask);
    void deleteTask(Long id);
    List<Task> getTasksByUserId(Long userId);
}
