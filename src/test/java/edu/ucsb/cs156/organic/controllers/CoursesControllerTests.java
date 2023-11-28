package edu.ucsb.cs156.organic.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.awaitility.Awaitility.await;

import static java.util.concurrent.TimeUnit.SECONDS;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import edu.ucsb.cs156.organic.entities.Course;
import edu.ucsb.cs156.organic.entities.Staff;
import edu.ucsb.cs156.organic.entities.User;
import edu.ucsb.cs156.organic.entities.jobs.Job;
import edu.ucsb.cs156.organic.repositories.CourseRepository;
import edu.ucsb.cs156.organic.repositories.StaffRepository;
import edu.ucsb.cs156.organic.repositories.UserRepository;
import edu.ucsb.cs156.organic.repositories.jobs.JobsRepository;
import edu.ucsb.cs156.organic.services.jobs.JobService;
import edu.ucsb.cs156.organic.services.CurrentUserService;
import liquibase.pro.packaged.W;
import lombok.With;
import lombok.extern.slf4j.Slf4j;

import org.mockito.ArgumentCaptor;
import org.mockito.Captor;

@Slf4j
@WebMvcTest(controllers = CoursesController.class)
@Import(JobService.class)
@AutoConfigureDataJpa
public class CoursesControllerTests extends ControllerTestCase {

    @MockBean
    UserRepository userRepository;

    @MockBean
    CourseRepository courseRepository;

    @MockBean
    StaffRepository courseStaffRepository;

    @Autowired
    CurrentUserService userService;

    @Autowired
    ObjectMapper objectMapper;

    Course course1 = Course.builder()
            .id(1L)
            .name("CS156")
            .school("UCSB")
            .term("F23")
            .start(LocalDateTime.parse("2023-09-01T00:00:00"))
            .end(LocalDateTime.parse("2023-12-31T00:00:00"))
            .githubOrg("ucsb-cs156-f23")
            .build();

    Course course2 = Course.builder()
            .id(1L)
            .name("CS148")
            .school("UCSB")
            .term("S24")
            .start(LocalDateTime.parse("2024-01-01T00:00:00"))
            .end(LocalDateTime.parse("2024-03-31T00:00:00"))
            .githubOrg("ucsb-cs148-w24")
            .build();

    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void admin_can_get_all_courses() throws Exception {

        // arrange

        ArrayList<Course> expectedCourses = new ArrayList<>();
        expectedCourses.addAll(Arrays.asList(course1, course2));

        when(courseRepository.findAll()).thenReturn(expectedCourses);

        // act
        MvcResult response = mockMvc.perform(get("/api/courses/all"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(courseRepository, atLeastOnce()).findAll();
        String expectedJson = mapper.writeValueAsString(expectedCourses);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void user_can_get_only_courses_for_which_they_are_staff() throws Exception {

        // arrange

        ArrayList<Course> expectedCourses = new ArrayList<>();
        expectedCourses.addAll(Arrays.asList(course1, course2));

        when(courseRepository.findCoursesStaffedByUser(any())).thenReturn(expectedCourses);

        // act
        MvcResult response = mockMvc.perform(get("/api/courses/all"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(courseRepository, atLeastOnce()).findCoursesStaffedByUser(any());
        String expectedJson = mapper.writeValueAsString(expectedCourses);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_post_a_new_course() throws Exception {
        // arrange

        Course courseBefore = Course.builder()
                .name("CS16")
                .school("UCSB")
                .term("F23")
                .start(LocalDateTime.parse("2023-09-01T00:00:00"))
                .end(LocalDateTime.parse("2023-12-31T00:00:00"))
                .githubOrg("ucsb-cs16-f23")
                .build();

        Course courseAfter = Course.builder()
                .id(222L)
                .name("CS16")
                .school("UCSB")
                .term("F23")
                .start(LocalDateTime.parse("2023-09-01T00:00:00"))
                .end(LocalDateTime.parse("2023-12-31T00:00:00"))
                .githubOrg("ucsb-cs16-f23")
                .build();

        when(courseRepository.save(eq(courseBefore))).thenReturn(courseAfter);

        // act
        MvcResult response = mockMvc.perform(
                post("/api/courses/post?name=CS16&school=UCSB&term=F23&start=2023-09-01T00:00:00&end=2023-12-31T00:00:00&githubOrg=ucsb-cs16-f23")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(courseRepository, times(1)).save(courseBefore);
        String expectedJson = mapper.writeValueAsString(courseAfter);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_add_a_staff_member_to_a_course() throws Exception {
        // arrange

        User user = User.builder().githubId(12345).githubLogin("scottpchow23").build();

        Staff courseStaffBefore = Staff.builder()
                .courseId(course1.getId())
                .githubId(user.getGithubId())
                .user(user)
                .build();

        Staff courseStaffAfter = Staff.builder()
                .id(456L)
                .courseId(course1.getId())
                .githubId(user.getGithubId())
                .user(user)
                .build();

        when(courseRepository.findById(eq(course1.getId()))).thenReturn(Optional.of(course1));
        when(userRepository.findByGithubLogin(eq("scottpchow23"))).thenReturn(Optional.of(user));
        when(courseStaffRepository.save(eq(courseStaffBefore))).thenReturn(courseStaffAfter);

        // act
        MvcResult response = mockMvc.perform(
                post("/api/courses/addStaff?courseId=1&githubLogin=scottpchow23")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(courseStaffRepository, times(1)).save(courseStaffBefore);
        String expectedJson = mapper.writeValueAsString(courseStaffAfter);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_cannot_add_staff_to_a_non_existing_course() throws Exception {
                // arrange

                when(courseRepository.findById(eq(42L))).thenReturn(Optional.empty());
                // act

                MvcResult response = mockMvc.perform(
                                post("/api/courses/addStaff?courseId=42&githubLogin=scottpchow23")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                Map<String,String> responseMap = mapper.readValue(response.getResponse().getContentAsString(), new TypeReference<Map<String,String>>(){});
                Map<String,String> expectedMap = Map.of("message", "Course with id 42 not found", "type", "EntityNotFoundException");
                assertEquals(expectedMap, responseMap);
        }

    @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_cannot_add_non_existing_user_to_staff_of_an_existing_course() throws Exception {
                // arrange

                when(courseRepository.findById(eq(course1.getId()))).thenReturn(Optional.of(course1));
                when(userRepository.findByGithubLogin(eq("sadGaucho"))).thenReturn(Optional.empty());
               
                // act

                MvcResult response = mockMvc.perform(
                                post("/api/courses/addStaff?courseId=1&githubLogin=sadGaucho")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                Map<String,String> responseMap = mapper.readValue(response.getResponse().getContentAsString(), new TypeReference<Map<String,String>>(){});
                Map<String,String> expectedMap = Map.of("message", "User with id sadGaucho not found", "type", "EntityNotFoundException");
                assertEquals(expectedMap, responseMap);
        }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_get_staff_for_a_course() throws Exception {
        // arrange

        User user1 = User.builder().githubId(12345).githubLogin("scottpchow23").build();
        User user2 = User.builder().githubId(67890).githubLogin("pconrad").build();

        Staff courseStaff1 = Staff.builder()
                .id(111L)
                .courseId(course1.getId())
                .githubId(user1.getGithubId())
                .user(user1)
                .build();

        Staff courseStaff2 = Staff.builder()
                .id(222L)
                .courseId(course2.getId())
                .githubId(user2.getGithubId())
                .user(user2)
                .build();

        ArrayList<Staff> expectedCourseStaff = new ArrayList<>();
        expectedCourseStaff.addAll(Arrays.asList(courseStaff1, courseStaff2));

        when(courseRepository.findById(eq(course1.getId()))).thenReturn(Optional.of(course1));
        when(courseStaffRepository.findByCourseId(eq(course1.getId()))).thenReturn(expectedCourseStaff);

        // act

        MvcResult response = mockMvc.perform(
                get("/api/courses/getStaff?courseId=1")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(courseStaffRepository, times(1)).findByCourseId(eq(course1.getId()));
        String expectedJson = mapper.writeValueAsString(expectedCourseStaff);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_cannot_get_staff_for_a_non_existing_course() throws Exception {
                // arrange

                when(courseRepository.findById(eq(42L))).thenReturn(Optional.empty());
                // act

                MvcResult response = mockMvc.perform(
                                get("/api/courses/getStaff?courseId=42")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                Map<String,String> responseMap = mapper.readValue(response.getResponse().getContentAsString(), new TypeReference<Map<String,String>>(){});
                Map<String,String> expectedMap = Map.of("message", "Course with id 42 not found", "type", "EntityNotFoundException");
                assertEquals(expectedMap, responseMap);
        }

    // admin cannot update non existing course
    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_cannot_update_non_existing_course() throws Exception {
        // arrange

        when(courseRepository.findById(eq(42L))).thenReturn(Optional.empty());
        // act

        MvcResult response = mockMvc.perform(
                put("/api/courses/update?id=42&name=CS16&school=UCSB&term=F23&start=2023-09-01T00:00:00&end=2023-12-31T00:00:00&githubOrg=ucsb-cs16-f23")
                                .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();
        // assert

        Map<String,String> responseMap = mapper.readValue(response.getResponse().getContentAsString(), new TypeReference<Map<String,String>>(){});
        Map<String,String> expectedMap = Map.of("message", "Course with id 42 not found", "type", "EntityNotFoundException");
        assertEquals(expectedMap, responseMap);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_update_a_course() throws Exception {
        // arrange

        Course courseBefore = course1;

        Course courseAfter = course2;
        courseAfter.setSchool("UCSD");

        when(courseRepository.findById(eq(courseBefore.getId()))).thenReturn(Optional.of(courseBefore));
        when(courseRepository.save(eq(courseAfter))).thenReturn(courseAfter);

        String urlTemplate = String.format(
                "/api/courses/update?id=%d&name=%s&school=%s&term=%s&start=%s&end=%s&githubOrg=%s",
                courseAfter.getId(), courseAfter.getName(), courseAfter.getSchool(), courseAfter.getTerm(),
                courseAfter.getStart().toString(), courseAfter.getEnd().toString(), courseAfter.getGithubOrg());
        MvcResult response = mockMvc.perform(
                put(urlTemplate)
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(courseRepository, times(1)).save(courseBefore);
        String expectedJson = mapper.writeValueAsString(courseAfter);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    // Instructor can update course if they are staff
    @WithMockUser(roles = { "INSTRUCTOR", "USER" })
    @Test
    public void an_instructor_user_can_update_a_course_if_they_are_staff() throws Exception {
        // arrange

        // get current user, make sure that when courseStaffRepository.findByCourseId is
        // called, it returns the current user

        Course courseBefore = course1;

        Course courseAfter = course2;
        courseAfter.setSchool("UCSD");

        when(courseRepository.findById(eq(courseBefore.getId()))).thenReturn(Optional.of(courseBefore));
        when(courseRepository.save(eq(courseAfter))).thenReturn(courseAfter);

        // get current user
        User user = userService.getCurrentUser().getUser();
        // mock user is staff
        Staff courseStaff = Staff.builder().courseId(courseBefore.getId()).githubId(user.getGithubId()).build();
        when(courseStaffRepository.findByCourseIdAndGithubId(courseBefore.getId(), user.getGithubId()))
                .thenReturn(Optional
                        .of(courseStaff));

        // act
        // get urlTemplate from courseAfter using string interpolation
        String urlTemplate = String.format(
                "/api/courses/update?id=%d&name=%s&school=%s&term=%s&start=%s&end=%s&githubOrg=%s",
                courseAfter.getId(), courseAfter.getName(), courseAfter.getSchool(), courseAfter.getTerm(),
                courseAfter.getStart().toString(), courseAfter.getEnd().toString(), courseAfter.getGithubOrg());
        MvcResult response = mockMvc.perform(
                put(urlTemplate)
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(courseRepository, times(1)).save(courseBefore);
        String expectedJson = mapper.writeValueAsString(courseAfter);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    // Instructor cannot update course if they are not staff
    @WithMockUser(roles = { "INSTRUCTOR", "USER" })
    @Test
    public void an_instructor_user_cannot_update_a_course_if_they_are_not_staff() throws Exception {
        // arrange

        Course courseBefore = Course.builder()
                .id(1L)
                .name("CS16")
                .school("UCSB")
                .term("F23")
                .start(LocalDateTime.parse("2023-09-01T00:00:00"))
                .end(LocalDateTime.parse("2023-12-31T00:00:00"))
                .githubOrg("ucsb-cs16-f23")
                .build();

        Course courseAfter = Course.builder()
                .id(1L)
                .name("CS16")
                .school("UCSB")
                .term("F23")
                .start(LocalDateTime.parse("2023-09-01T00:00:00"))
                .end(LocalDateTime.parse("2023-12-31T00:00:00"))
                .githubOrg("ucsb-cs16-f23")
                .build();

        when(courseRepository.findById(eq(courseBefore.getId()))).thenReturn(Optional.of(courseBefore));
        when(courseRepository.save(eq(courseAfter))).thenReturn(courseAfter);
        // mock user is not staff

        User user = userService.getCurrentUser().getUser();
        Integer githubId = user.getGithubId();
        ArrayList<Staff> notStaff = new ArrayList<>();
        notStaff.add(Staff.builder().githubId(githubId - 1).build());
        when(courseStaffRepository.findByCourseId(courseBefore.getId()))
                .thenReturn(notStaff);
        // act
        MvcResult response = mockMvc.perform(
                put("/api/courses/update?id=1&name=CS16&school=UCSB&term=F23&start=2023-09-01T00:00:00&end=2023-12-31T00:00:00&githubOrg=ucsb-cs16-f23")
                        .with(csrf()))
                .andExpect(status().isForbidden()).andReturn();

        // assert
        verify(courseRepository, times(0)).save(courseAfter);

        // verify message is correct
        Map<String, String> responseMap = mapper.readValue(response.getResponse().getContentAsString(),
                new TypeReference<Map<String, String>>() {
                });
        Map<String, String> expectedMap = Map.of("message", "User is not a staff member for this course", "type",
                "AccessDeniedException");
        assertEquals(expectedMap, responseMap);
    }

    // User cannot update course at all
    @WithMockUser(roles = { "USER" })
    @Test
    public void a_user_cannot_update_a_course() throws Exception {
        // arrange

        Course courseBefore = Course.builder()
                .id(1L)
                .name("CS16")
                .school("UCSB")
                .term("F23")
                .start(LocalDateTime.parse("2023-09-01T00:00:00"))
                .end(LocalDateTime.parse("2023-12-31T00:00:00"))
                .githubOrg("ucsb-cs16-f23")
                .build();

        Course courseAfter = Course.builder()
                .id(1L)
                .name("CS32")
                .school("UCSB")
                .term("F23")
                .start(LocalDateTime.parse("2023-09-01T00:00:00"))
                .end(LocalDateTime.parse("2023-12-31T00:00:00"))
                .githubOrg("ucsb-cs32-f23")
                .build();

        when(courseRepository.findById(eq(courseBefore.getId()))).thenReturn(Optional.of(courseBefore));
        when(courseRepository.save(eq(courseAfter))).thenReturn(courseAfter);

        // act
        MvcResult response = mockMvc.perform(
                put("/api/courses/update?id=1&name=CS32&school=UCSB&term=F23&start=2023-09-01T00:00:00&end=2023-12-31T00:00:00&githubOrg=ucsb-cs32-f23")
                        .with(csrf()))
                .andExpect(status().isForbidden()).andReturn();

        // assert
        verify(courseRepository, times(0)).save(courseAfter);

        // verify message is correct
        Map<String, String> responseMap = mapper.readValue(response.getResponse().getContentAsString(),
                new TypeReference<Map<String, String>>() {
                });
        Map<String, String> expectedMap = Map.of("message", "Access is denied", "type",
                "AccessDeniedException");
        assertEquals(expectedMap, responseMap);
    }

    // admin user cannot delete non existing course
    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_cannot_delete_non_existing_course() throws Exception {
        // arrange

        when(courseRepository.findById(eq(42L))).thenReturn(Optional.empty());
        // act

        MvcResult response = mockMvc.perform(
                delete("/api/courses/delete?id=42")
                                .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();
        // assert

        Map<String,String> responseMap = mapper.readValue(response.getResponse().getContentAsString(), new TypeReference<Map<String,String>>(){});
        Map<String,String> expectedMap = Map.of("message", "Course with id 42 not found", "type", "EntityNotFoundException");
        assertEquals(expectedMap, responseMap);
    }

    // admin user can delete course
    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_delete_a_course() throws Exception {
        // arrange

        Course courseBefore = Course.builder()
                .id(1L)
                .name("CS16")
                .school("UCSB")
                .term("F23")
                .start(LocalDateTime.parse("2023-09-01T00:00:00"))
                .end(LocalDateTime.parse("2023-12-31T00:00:00"))
                .githubOrg("ucsb-cs16-f23")
                .build();

        when(courseRepository.findById(eq(courseBefore.getId()))).thenReturn(Optional.of(courseBefore));

        // act
        MvcResult response = mockMvc.perform(
                delete("/api/courses/delete?id=1")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(courseRepository, times(1)).delete(courseBefore);
        String expectedJson = mapper.writeValueAsString(courseBefore);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    // Instructor can delete course if they are staff
    @WithMockUser(roles = { "INSTRUCTOR", "USER" })
    @Test
    public void an_instructor_user_can_delete_a_course_if_they_are_staff() throws Exception {
        // arrange

        // get current user, make sure that when courseStaffRepository.findByCourseId is
        // called, it returns the current user

        Course courseBefore = Course.builder()
                .id(1L)
                .name("CS16")
                .school("UCSB")
                .term("F23")
                .start(LocalDateTime.parse("2023-09-01T00:00:00"))
                .end(LocalDateTime.parse("2023-12-31T00:00:00"))
                .githubOrg("ucsb-cs16-f23")
                .build();

        when(courseRepository.findById(eq(courseBefore.getId()))).thenReturn(Optional.of(courseBefore));

        // get current user
        User user = userService.getCurrentUser().getUser();
        // mock user is staff
        Staff courseStaff = Staff.builder().courseId(courseBefore.getId()).githubId(user.getGithubId()).build();
        when(courseStaffRepository.findByCourseIdAndGithubId(courseBefore.getId(), user.getGithubId()))
                .thenReturn(Optional
                        .of(courseStaff));
        // act
        MvcResult response = mockMvc.perform(
                delete("/api/courses/delete?id=1")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(courseRepository, times(1)).delete(courseBefore);
        String expectedJson = mapper.writeValueAsString(courseBefore);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    // Instructor cannot delete course if they are not staff
    @WithMockUser(roles = { "INSTRUCTOR", "USER" })
    @Test
    public void an_instructor_user_cannot_delete_a_course_if_they_are_not_staff() throws Exception {
        // arrange

        Course courseBefore = Course.builder()
                .id(1L)
                .name("CS16")
                .school("UCSB")
                .term("F23")
                .start(LocalDateTime.parse("2023-09-01T00:00:00"))
                .end(LocalDateTime.parse("2023-12-31T00:00:00"))
                .githubOrg("ucsb-cs16-f23")
                .build();

        when(courseRepository.findById(eq(courseBefore.getId()))).thenReturn(Optional.of(courseBefore));
        // mock user is not staff

        User user = userService.getCurrentUser().getUser();
        Integer githubId = user.getGithubId();
        ArrayList<Staff> notStaff = new ArrayList<>();
        notStaff.add(Staff.builder().githubId(githubId - 1).build());
        when(courseStaffRepository.findByCourseId(courseBefore.getId()))
                .thenReturn(notStaff);
        // act
        MvcResult response = mockMvc.perform(
                delete("/api/courses/delete?id=1")
                        .with(csrf()))
                .andExpect(status().isForbidden()).andReturn();

        // assert
        verify(courseRepository, times(0)).delete(courseBefore);

        // verify message is correct
        Map<String, String> responseMap = mapper.readValue(response.getResponse().getContentAsString(),
                new TypeReference<Map<String, String>>() {
                });
        Map<String, String> expectedMap = Map.of("message", "User is not a staff member for this course", "type",
                "AccessDeniedException");
        assertEquals(expectedMap, responseMap);
    }

    // User cannot delete course at all
    @WithMockUser(roles = { "USER" })
    @Test
    public void a_user_cannot_delete_a_course() throws Exception {
        // arrange

        Course courseBefore = Course.builder()
                .id(1L)
                .name("CS16")
                .school("UCSB")
                .term("F23")
                .start(LocalDateTime.parse("2023-09-01T00:00:00"))
                .end(LocalDateTime.parse("2023-12-31T00:00:00"))
                .githubOrg("ucsb-cs16-f23")
                .build();

        when(courseRepository.findById(eq(courseBefore.getId()))).thenReturn(Optional.of(courseBefore));

        // act
        MvcResult response = mockMvc.perform(
                delete("/api/courses/delete?id=1")
                        .with(csrf()))
                .andExpect(status().isForbidden()).andReturn();

        // assert
        verify(courseRepository, times(0)).delete(courseBefore);

        // verify message is correct
        Map<String, String> responseMap = mapper.readValue(response.getResponse().getContentAsString(),
                new TypeReference<Map<String, String>>() {
                });
        Map<String, String> expectedMap = Map.of("message", "Access is denied", "type",
                "AccessDeniedException");
        assertEquals(expectedMap, responseMap);
    }
}
