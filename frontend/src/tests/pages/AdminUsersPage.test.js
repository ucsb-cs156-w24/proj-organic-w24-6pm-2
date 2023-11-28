import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import AdminUsersPage from "main/pages/AdminUsersPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import usersFixtures from "fixtures/usersFixtures";

describe("AdminUsersPage tests",  () => {
    const queryClient = new QueryClient();

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "UsersTable"

    beforeEach(()=>{
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/admin/users").reply(200, usersFixtures.threeUsers);

    });

    test("renders without crashing on two users", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminUsersPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(await screen.findByText("Users")).toBeInTheDocument();
    });

    test("user table toggle admin tests", async ()=>{
        axiosMock.onPost("/api/admin/users/toggleAdmin").reply(200, "User with id 1 has toggled admin status");
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminUsersPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        const title = await screen.findByText("Users");
        expect(title).toBeInTheDocument();
        
        const toggleAdminButton = screen.getByTestId(`${testId}-cell-row-0-col-toggle-admin-button`);
        expect(toggleAdminButton).toBeInTheDocument();

        fireEvent.click(toggleAdminButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
        expect(axiosMock.history.post[0].url).toBe("/api/admin/users/toggleAdmin");
        expect(axiosMock.history.post[0].params).toEqual({githubId:11111});
    });

    test("user table toggle instructor tests", async ()=>{
        axiosMock.onPost("/api/admin/users/toggleInstructor").reply(200, "User with id 1 has toggled instructor status");
        
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminUsersPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        const title = await screen.findByText("Users");
        expect(title).toBeInTheDocument();

        const toggleInstructorButton = screen.getByTestId(`${testId}-cell-row-0-col-toggle-instructor-button`);
        expect(toggleInstructorButton).toBeInTheDocument();
  
        fireEvent.click(toggleInstructorButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
        expect(axiosMock.history.post[0].url).toBe("/api/admin/users/toggleInstructor");
        expect(axiosMock.history.post[0].params).toEqual({githubId:11111});
    });
});
