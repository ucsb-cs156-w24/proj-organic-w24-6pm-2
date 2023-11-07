package edu.ucsb.cs156.organic.entities;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class UserTests {
    @Test
    void test_toString() {
        User user = User.builder().id(1L).email("test@example.org").build();
        assertEquals("User: id=1 email=test@example.org", user.toString()); 
    }
}
