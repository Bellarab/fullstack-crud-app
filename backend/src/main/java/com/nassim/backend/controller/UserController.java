package com.nassim.backend.controller;

import com.nassim.backend.model.User;
import com.nassim.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Create a new user.
     * Expects a valid User object in the request body.
     * Returns the created user.
     */
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody @Valid User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.ok(createdUser);
    }

    /**
     * Retrieve all users.
     * Returns a list of all users.
     */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * Retrieve a user by ID.
     * Returns the user if found, or 404 Not Found if not.
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Check if username or email already exists.
     * Both query params are optional; can check either or both.
     * Returns a JSON with keys "usernameExists" and "emailExists".
     */
    @GetMapping("/exists")
    public ResponseEntity<?> checkUsernameOrEmail(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email) {

        boolean usernameExists = false;
        boolean emailExists = false;

        if (username != null) {
            usernameExists = userService.existsByUsername(username);
        }

        if (email != null) {
            emailExists = userService.existsByEmail(email);
        }

        return ResponseEntity.ok().body(Map.of(
                "usernameExists", usernameExists,
                "emailExists", emailExists
        ));
    }

    /**
     * Delete a user by ID.
     * Returns 204 No Content on successful deletion.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
