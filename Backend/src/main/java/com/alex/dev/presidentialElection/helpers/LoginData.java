package com.alex.dev.presidentialElection.helpers;
import com.alex.dev.presidentialElection.model.User;
import com.alex.dev.presidentialElection.repository.UserRepository;
import java.util.Optional;

public class LoginData {

    private final UserRepository userRepository;

    public LoginData(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean validateCredentials(String email, String password) {
        // Find the user by email
        Optional<User> userOptional = userRepository.findByEmail(email);

        // Check if the user exists
        if (userOptional.isEmpty()) {
            return false;
        }

        User user = userOptional.get();

        // Compare the entered password with the stored one
        return password.equals(user.getPassword());
    }
}

