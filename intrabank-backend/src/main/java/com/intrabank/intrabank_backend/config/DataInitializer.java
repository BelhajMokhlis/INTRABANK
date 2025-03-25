package com.intrabank.intrabank_backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.intrabank.intrabank_backend.dto.request.UserRequest;
import com.intrabank.intrabank_backend.model.Role;
import com.intrabank.intrabank_backend.service.UserService;


@Configuration
public class DataInitializer {

   

    @Bean
    public CommandLineRunner initializeData(UserService userService) {
        return args -> {
            if (userService.findByUsername("admin").isEmpty()) {
                // Add admin user
                UserRequest admin = new UserRequest();
                admin.setUsername("admin");
                admin.setPassword("admin");
                admin.setEmail("admin@intrabank.com");
                admin.setRole(Role.ADMINISTRATOR);
                admin.setDepartment("Administration");
                admin.setPhone("06 06 06 06 06");
                admin.setAddress("123 Rue de la Paix, Paris, France");
                admin.setFirstName("John");
                admin.setLastName("Doe");                
                userService.addUser(admin);
                
                // Add employee user
                UserRequest employee = new UserRequest();
                employee.setUsername("employee");
                employee.setPassword("employee");
                employee.setEmail("employee@intrabank.com");
                employee.setRole(Role.EMPLOYEE);
                employee.setDepartment("Sales");
                employee.setPhone("06 06 06 06 06");
                employee.setAddress("123 Rue de la Paix, Paris, France");
                employee.setFirstName("Jane");
                employee.setLastName("Smith");
                userService.addUser(employee);
                
                // Add manager user     
                UserRequest manager = new UserRequest();
                manager.setUsername("manager");
                manager.setPassword("manager");
                manager.setEmail("manager@intrabank.com");
                manager.setRole(Role.MANAGER);
                manager.setDepartment("Sales");
                manager.setPhone("06 06 06 06 06");
                manager.setAddress("123 Rue de la Paix, Paris, France");
                manager.setFirstName("John");
                manager.setLastName("Doe");
                userService.addUser(manager);
                
                // Add compliance officer user
                UserRequest complianceOfficer = new UserRequest();
                complianceOfficer.setUsername("complianceOfficer");
                complianceOfficer.setPassword("complianceOfficer");
                complianceOfficer.setEmail("complianceOfficer@intrabank.com");
                complianceOfficer.setRole(Role.COMPLIANCE_OFFICER);
                complianceOfficer.setDepartment("Compliance");
                complianceOfficer.setPhone("06 06 06 06 06");
                complianceOfficer.setAddress("123 Rue de la Paix, Paris, France");
                complianceOfficer.setFirstName("John");
                complianceOfficer.setLastName("Doe");
                userService.addUser(complianceOfficer);
            }
        };
    }
    
}
