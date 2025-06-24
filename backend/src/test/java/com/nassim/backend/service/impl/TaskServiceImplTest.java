package com.nassim.backend.service.impl;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import com.nassim.backend.DTO.TaskDTO;
import com.nassim.backend.model.Task;
import com.nassim.backend.model.User;
import com.nassim.backend.repository.TaskRepository;
import com.nassim.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskServiceImplTest {
    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private TaskServiceImpl taskService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }


    @Test
    void createTask() {
        User user = new User();
        user.setId(1L);

        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setTitle("Study");
        taskDTO.setDescription("Prepare for exam");
        taskDTO.setUserId(1L);

        Task savedTask = new Task();
        savedTask.setTitle("Study");
        savedTask.setDescription("Prepare for exam");
        savedTask.setUser(user);

        when(userService.getUserById(1L)).thenReturn(Optional.of(user));
        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

        TaskDTO result = taskService.createTask(taskDTO);

        assertNotNull(result);
        assertEquals("Study", result.getTitle());
        //for debug perpuses
        //assertEquals("Work", result.getTitle());   expecting "Work" but actual is "Study"
        assertEquals("Prepare for exam", result.getDescription());
        assertEquals(1L, result.getUserId());
    }


    @Test
    void getAllTasks() {
        User user = new User();
        user.setId(1L);

        // Create Task entities (mock data returned by repository)
        Task t1 = new Task();
        t1.setId(1L);
        t1.setTitle("Task 1");
        t1.setDescription("Desc");
        t1.setUser(user);

        Task t2 = new Task();
        t2.setId(2L);
        t2.setTitle("Task 2");
        t2.setDescription("More");
        t2.setUser(user);


        when(taskRepository.findAll()).thenReturn(List.of(t1, t2));


        List<TaskDTO> tasks = taskService.getAllTasks();


        assertEquals(2, tasks.size());

        TaskDTO firstTaskDTO = tasks.get(0);
        assertEquals(1L, firstTaskDTO.getId());
        assertEquals("Task 1", firstTaskDTO.getTitle());
        assertEquals("Desc", firstTaskDTO.getDescription());
        assertEquals(1L, firstTaskDTO.getUserId());

        TaskDTO secondTaskDTO = tasks.get(1);
        assertEquals(2L, secondTaskDTO.getId());
        assertEquals("Task 2", secondTaskDTO.getTitle());
        assertEquals("More", secondTaskDTO.getDescription());
        assertEquals(1L, secondTaskDTO.getUserId());
    }


    @Test
    void getTaskById() {
        User user = new User();
        user.setId(1L);

        Task task = new Task();
        task.setId(5L);
        task.setTitle("Shopping");
        task.setDescription("Buy stuff");
        task.setUser(user);


        when(taskRepository.findById(5L)).thenReturn(Optional.of(task));


        Optional<TaskDTO> result = taskService.getTaskById(5L);


        assertTrue(result.isPresent());

        TaskDTO dto = result.get();

        assertEquals(5L, dto.getId());
        assertEquals("Shopping", dto.getTitle());
        assertEquals("Buy stuff", dto.getDescription());
        assertEquals(1L, dto.getUserId());
    }



    @Test
    void updateTask() {
        User user = new User();
        user.setId(1L);

        Task existing = new Task();
        existing.setId(3L);
        existing.setTitle("this is old");
        existing.setDescription("old description");
        existing.setUser(user);

        Task updated = new Task();
        updated.setId(3L);
        updated.setTitle("New");
        updated.setDescription("New desc");
        updated.setUser(user);

        TaskDTO dto = new TaskDTO();
        dto.setUserId(1L);
        dto.setTitle("New");
        dto.setDescription("New desc");

        when(userService.getUserById(1L)).thenReturn(Optional.of(user));
        when(taskRepository.findById(3L)).thenReturn(Optional.of(existing));
        when(taskRepository.save(any(Task.class))).thenReturn(updated);

        TaskDTO result = taskService.updateTask(3L, dto);

        assertEquals("New", result.getTitle());
        assertEquals("New desc", result.getDescription());
    }



    @Test
    void deleteTask() {
        taskService.deleteTask(7L);
        verify(taskRepository, times(1)).deleteById(7L);
    }


    @Test
    void getTasksByUserId() {
        User user = new User();
        user.setId(2L);

        Task task1 = new Task(1L, "A", "B", user);
        Task task2 = new Task(2L, "C", "D", user);

        when(taskRepository.findByUserId(2L)).thenReturn(List.of(task1, task2));

        List<TaskDTO> results = taskService.getTasksByUserId(2L);

        TaskDTO expected1 = new TaskDTO();
        expected1.setId(1L);
        expected1.setTitle("A");
        expected1.setDescription("B");
        expected1.setUserId(2L);

        TaskDTO expected2 = new TaskDTO();
        expected2.setId(2L);
        expected2.setTitle("C");
        expected2.setDescription("D");
        expected2.setUserId(2L);

        assertEquals(2, results.size());

        assertEquals(expected1.getId(), results.get(0).getId());
        assertEquals(expected1.getTitle(), results.get(0).getTitle());
        assertEquals(expected1.getDescription(), results.get(0).getDescription());
        assertEquals(expected1.getUserId(), results.get(0).getUserId());

        assertEquals(expected2.getId(), results.get(1).getId());
        assertEquals(expected2.getTitle(), results.get(1).getTitle());
        assertEquals(expected2.getDescription(), results.get(1).getDescription());
        assertEquals(expected2.getUserId(), results.get(1).getUserId());
    }


}