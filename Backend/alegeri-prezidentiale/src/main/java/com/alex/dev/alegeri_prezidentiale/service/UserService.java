package com.alex.dev.alegeri_prezidentiale.service;

import com.alex.dev.alegeri_prezidentiale.helpers.LoginData;
import com.alex.dev.alegeri_prezidentiale.model.User;
import com.alex.dev.alegeri_prezidentiale.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.function.Function;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class UserService {
    public static final String PHOTO_DIRECTORY = System.getProperty("user.home") + "/Downloads/uploads/";

    private final UserRepository userRepository;
    private final LoginData loginData;

    // Method to authenticate a user
    public User authenticateUser(String email, String password) {
        if (loginData.validateCredentials(email, password)) {
            return userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        } else {
            throw new BadCredentialsException("Invalid credentials");
        }
    }

    // Retrieve all candidates and sort them by the number of votes
    public Page<User> getAllCandidates(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "votes"));
        return userRepository.findByElectionParticipationTrue(pageRequest);
    }

    // Retrieve all users and sort them by name
    public Page<User> getAllUsers(int page, int size) {
        return userRepository.findAll(PageRequest.of(page, size, Sort.by("name")));
    }

    // Find a user by email
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User with this email Not Found!"));
    }

    // Find a user by ID
    public User getUser(String id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not Found!"));
    }

    // Create a new user
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // Upload a photo for a user specified by ID and return the URL where it can be accessed
    public String uploadPhoto(String id, MultipartFile file) {
        log.info("Saving picture for user ID:{}", id);
        User user = getUser(id);
        String photoUrl = photoFunction.apply(id, file);
        user.setPhotoUrl(photoUrl);
        userRepository.save(user);
        return photoUrl;
    }

    // Function to get the file extension from its name
    private final Function<String, String> fileExtension = filename -> Optional.of(filename)
            .filter(name -> name.contains("."))
            .map(name -> "." + name.substring(filename.lastIndexOf(".") + 1))
            .orElse(".png");

    // Function to save the image to disk and generate the access URL
    private final BiFunction<String, MultipartFile, String> photoFunction = (id, image) -> {
        String filename = id + fileExtension.apply(image.getOriginalFilename());
        try {
            Path fileStorageLocation = Paths.get(PHOTO_DIRECTORY).toAbsolutePath().normalize();
            if (!Files.exists(fileStorageLocation)) {
                Files.createDirectories(fileStorageLocation);
            }
            Files.copy(image.getInputStream(), fileStorageLocation.resolve(filename), REPLACE_EXISTING);
            return ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/elections/image/" + filename).toUriString();
        } catch (Exception exception) {
            throw new RuntimeException("Unable to save image");
        }
    };
}














