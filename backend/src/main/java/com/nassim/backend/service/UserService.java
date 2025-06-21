package com.nassim.backend.service;

import com.nassim.backend.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    User createUser(User user);
    List<User> getAllUsers();
    Optional<User> getUserById(Long id);

    void deleteUser(Long id);
}
