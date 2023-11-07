package edu.ucsb.cs156.organic.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;

import edu.ucsb.cs156.organic.repositories.UserRepository;
import edu.ucsb.cs156.organic.testconfig.TestConfig;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("development")
@WebMvcTest(controllers = CSRFController.class)
@Import(TestConfig.class)
@AutoConfigureDataJpa
public class CSRFControllerTests extends ControllerTestCase {

  @MockBean
  UserRepository userRepository;

  @Test
  public void csrf_returns_ok() throws Exception {
    MvcResult response = mockMvc.perform(get("/csrf"))
        .andExpect(status().isOk()).andReturn();

    String responseString = response.getResponse().getContentAsString();
    assertFalse(responseString.equals(""));
  }

}
