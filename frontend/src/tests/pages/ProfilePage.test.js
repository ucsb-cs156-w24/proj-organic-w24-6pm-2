import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import ProfilePage from "main/pages/ProfilePage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

describe("ProfilePage tests", () => {
    const queryClient = new QueryClient();
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);

        jest.spyOn(console, 'error')
        console.error.mockImplementation(() => null);
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    test("renders correctly for regular logged in user", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ProfilePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        await screen.findAllByText("User Profile for cgaucho");
        const header = screen.getByText("User Profile for cgaucho");
        expect(header).toHaveClass("mb-3");

        expect(screen.queryByText("Not logged in.")).not.toBeInTheDocument();
        expect(screen.getByText("Emails")).toBeInTheDocument();

        const emailsHeader = screen.getByText("Emails");
        expect(emailsHeader).toHaveClass("mt-3");
        expect(emailsHeader).toHaveClass("mb-3");

        const debuggingInfoHeader = screen.getByText("Debugging Information");
        expect(debuggingInfoHeader).toHaveClass("mt-3");
        expect(debuggingInfoHeader).toHaveClass("mb-3");

        expect(screen.getByTestId("UsersTable-cell-row-0-col-githubLogin")).toBeInTheDocument();
        expect(screen.getByTestId("UsersTable-cell-row-0-col-githubLogin")).toHaveTextContent("cgaucho");

    });

    test("renders correctly for admin user from UCSB", async () => {
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ProfilePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findAllByText("root")).toHaveLength(2);
        expect(screen.queryByText("Not logged in.")).not.toBeInTheDocument();
    });

    test("renders correct content when not logged in", async () => {
        axiosMock.onGet("/api/currentUser").reply(403);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ProfilePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await screen.findByText("Not logged in.");

    });
});
