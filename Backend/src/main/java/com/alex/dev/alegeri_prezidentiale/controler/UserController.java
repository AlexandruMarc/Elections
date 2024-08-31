package com.alex.dev.alegeri_prezidentiale.controler;

import com.alex.dev.alegeri_prezidentiale.model.User;
import com.alex.dev.alegeri_prezidentiale.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;

import static com.alex.dev.alegeri_prezidentiale.service.UserService.PHOTO_DIRECTORY;
import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;
import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

@RestController
@RequestMapping("/elections")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;

    // Method for authentication
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        try {
            return ResponseEntity.ok().body(userService.authenticateUser(user.getEmail(), user.getPassword()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    // Creates a new user and returns an HTTP 201 (Created) response
    @PostMapping("/register")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.created(URI.create("/elections/userID")).body(userService.createUser(user));
    }

    // Retrieves a paginated list of candidates
    @GetMapping("/candidates")
    public ResponseEntity<Page<User>> getCandidates(@RequestParam(value = "page", defaultValue = "0") int page,
                                                     @RequestParam(value = "size", defaultValue = "10") int size) {
        return ResponseEntity.ok().body(userService.getAllCandidates(page, size));
    }

    // Retrieves a paginated list of users
    @GetMapping("/users")
    public ResponseEntity<Page<User>> getUsers(@RequestParam(value = "page", defaultValue = "0") int page,
                                                @RequestParam(value = "size", defaultValue = "10") int size) {
        return ResponseEntity.ok().body(userService.getAllUsers(page, size));
    }

    // Retrieves details of a specific user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getCandidate(@PathVariable(value = "id") String id) {
        return ResponseEntity.ok().body(userService.getUser(id));
    }

    // Uploads a photo for a user specified by ID
    @PutMapping("/photo")
    public ResponseEntity<String> uploadPhoto(@RequestParam("id") String id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok().body(userService.uploadPhoto(id, file));
    }

    // Retrieves a photo for a user based on the filename
    @GetMapping(path = "/image/{filename}", produces = {IMAGE_PNG_VALUE, IMAGE_JPEG_VALUE})
    public byte[] getPhoto(@PathVariable("filename") String filename) throws IOException {
        return Files.readAllBytes(Paths.get(PHOTO_DIRECTORY + filename));
    }
}
