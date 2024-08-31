package com.alex.dev.alegeri_prezidentiale.configuration;

import com.alex.dev.alegeri_prezidentiale.helpers.LoginData;
import com.alex.dev.alegeri_prezidentiale.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public LoginData loginData(UserRepository userRepository) {
        return new LoginData(userRepository);
    }
}
