package com.nassim.backend.service;

import com.nassim.backend.DTO.TaskDTO;
import com.nassim.backend.model.Task;
import java.util.List;
import java.util.Optional;

public interface TaskService {
    TaskDTO createTask(TaskDTO taskDTO);
    List<TaskDTO> getAllTasks();
    Optional<TaskDTO> getTaskById(Long id);
    TaskDTO updateTask(Long id, TaskDTO taskDTO);

    void deleteTask(Long id);
    List<TaskDTO> getTasksByUserId(Long userId);
}
