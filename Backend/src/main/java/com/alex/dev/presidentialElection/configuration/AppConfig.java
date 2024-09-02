package com.alex.dev.presidentialElection.configuration;

import com.alex.dev.presidentialElection.helpers.LoginData;
import com.alex.dev.presidentialElection.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public LoginData loginData(UserRepository userRepository) {
        return new LoginData(userRepository);
    }
}
