package com.nassim.backend.model;


import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "username is required")
    private String username;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    private String password;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> tasks = new ArrayList<>();

    // Constructors
    public User() {}

    public User(Long id, String username, String email, String password, List<Task> tasks) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.tasks = tasks;
    }

    // Getters and setters
    public Long getId() { return id; }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public List<Task> getTasks() { return tasks; }

    public void setTasks(List<Task> tasks) { this.tasks = tasks; }
}

