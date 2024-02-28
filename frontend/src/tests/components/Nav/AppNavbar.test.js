import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import AppNavbar from "main/components/Nav/AppNavbar";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

describe("AppNavbar tests", () => {
    const queryClient = new QueryClient();

    test("renders correctly for regular logged in user", async () => {
        const currentUser = currentUserFixtures.userOnly;
        const doLogin = jest.fn();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AppNavbar currentUser={currentUser} doLogin={doLogin} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByText("Welcome, cgaucho")).toBeInTheDocument();
    });

    test("renders correctly for admin user", async () => {
        const currentUser = currentUserFixtures.adminUser;
        const doLogin = jest.fn();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AppNavbar currentUser={currentUser} doLogin={doLogin} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByText("Welcome, pconrad")).toBeInTheDocument();
        const adminMenu = screen.getByTestId("appnavbar-admin-dropdown");
        expect(adminMenu).toBeInTheDocument();
        expect(await screen.findByText("Courses")).toBeInTheDocument(); 
    });

    test("renders correctly for instructor user", async () => {
        const currentUser = currentUserFixtures.instructorUser;
        const doLogin = jest.fn();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AppNavbar currentUser={currentUser} doLogin={doLogin} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByText("Welcome, dgaucho")).toBeInTheDocument();
        const adminMenu = screen.queryByTestId("appnavbar-admin-dropdown");
        expect(adminMenu).not.toBeInTheDocument();
        expect(await screen.findByText("Courses")).toBeInTheDocument(); 
    });

    test("renders correctly for user that hasn't signed in", async () => {
        const currentUser = currentUserFixtures.not_logged_in;
        const doLogin = jest.fn();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AppNavbar currentUser={currentUser} doLogin={doLogin} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const welcome = screen.queryByText("Welcome");
        expect(welcome).not.toBeInTheDocument();
        const adminMenu = screen.queryByTestId("appnavbar-admin-dropdown");
        expect(adminMenu).not.toBeInTheDocument();
        const courses = screen.queryByText("Courses");
        expect(courses).not.toBeInTheDocument(); 
    });

    test("renders H2Console and Swagger links correctly", async () => {
        const currentUser = currentUserFixtures.adminUser;
        const systemInfo = systemInfoFixtures.showingAll;

        const doLogin = jest.fn();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AppNavbar currentUser={currentUser} systemInfo={systemInfo} doLogin={doLogin} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByText("H2Console")).toBeInTheDocument();
        const swaggerMenu = screen.getByText("Swagger");
        expect(swaggerMenu).toBeInTheDocument();        
    });

    test("renders the AppNavbarLocalhost when on http://localhost:3000", async () => {
        const currentUser = currentUserFixtures.userOnly;
        const systemInfo = systemInfoFixtures.showingAll;
        const doLogin = jest.fn();

        delete window.location
        window.location = new URL('http://localhost:3000')

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AppNavbar currentUser={currentUser} systemInfo={systemInfo} doLogin={doLogin} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId("AppNavbarLocalhost")).toBeInTheDocument();
    });

    test("renders the AppNavbarLocalhost when on http://127.0.0.1:3000", async () => {
        const currentUser = currentUserFixtures.userOnly;
        const systemInfo = systemInfoFixtures.showingAll;
        const doLogin = jest.fn();

        delete window.location
        window.location = new URL('http://127.0.0.1:3000')

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AppNavbar currentUser={currentUser} systemInfo={systemInfo} doLogin={doLogin} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId("AppNavbarLocalhost")).toBeInTheDocument();
    });

    test("does NOT render the AppNavbarLocalhost when on localhost:8080", async () => {
        const currentUser = currentUserFixtures.userOnly;
        const systemInfo = systemInfoFixtures.showingAll;
        const doLogin = jest.fn();

        delete window.location
        window.location = new URL('http://localhost:8080')

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AppNavbar currentUser={currentUser} systemInfo={systemInfo} doLogin={doLogin} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId("AppNavbar")).toBeInTheDocument();
        expect(screen.queryByTestId(/AppNavbarLocalhost/i)).toBeNull();
    });
});
