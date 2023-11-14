package edu.ucsb.cs156.organic.entities;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class UserTests {

    @Test
    void test_noArgConstructor() {
        User user = new User();
        assertEquals(null, user.getGithubId());
        assertEquals(null, user.getGithubLogin());
    }

    @Test
    void test_toString() {
        User user = User.builder().githubId(12345).githubLogin("cgaucho").build();
        assertEquals("User: githubId=12345 githubLogin=cgaucho admin=false", user.toString()); 
    }
}
