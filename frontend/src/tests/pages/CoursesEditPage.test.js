import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import CoursesEditPage from "main/pages/CoursesEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("CoursesEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/courses/get", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CoursesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Course");
            expect(screen.queryByTestId("CoursesForm-name")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/courses/get", { params: { id: 17 } }).reply(200, {
                id: 17,
                name: "CS 156",
                school: "UCSB",
                term: "f23",
                startDate: "2023-09-29T00:00",
                endDate: "2023-12-15T00:00",
                githubOrg: "ucsb-cs156-f23"
            });
            axiosMock.onPut('/api/courses/update').reply(200, {
                id: "17",
                name: "CS 148",
                school: "UCSB",
                term: "w23",
                startDate: "2024-01-10T00:00",
                endDate: "2023-03-12T00:00",
                githubOrg: "ucsb-cs156-w23"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CoursesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CoursesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("CoursesForm-name");

            const idField = screen.getByTestId("CoursesForm-id");
            const nameField = screen.getByTestId("CoursesForm-name");
            const schoolField = screen.getByTestId("CoursesForm-school");
            const termField = screen.getByTestId("CoursesForm-term");
            const startField = screen.getByTestId("CoursesForm-startDate");
            const endField = screen.getByTestId("CoursesForm-endDate");
            const githubOrgField = screen.getByTestId("CoursesForm-githubOrg");
            const submitButton = screen.getByTestId("CoursesForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("CS 156");
            expect(schoolField).toHaveValue("UCSB");
            expect(termField).toHaveValue("f23");
            expect(startField).toHaveValue("2023-09-29T00:00");
            expect(endField).toHaveValue("2023-12-15T00:00");
            expect(githubOrgField).toHaveValue("ucsb-cs156-f23");
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CoursesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("CoursesForm-name");

            const idField = screen.getByTestId("CoursesForm-id");
            const nameField = screen.getByTestId("CoursesForm-name");
            const schoolField = screen.getByTestId("CoursesForm-school");
            const termField = screen.getByTestId("CoursesForm-term");
            const startField = screen.getByTestId("CoursesForm-startDate");
            const endField = screen.getByTestId("CoursesForm-endDate");
            const githubOrgField = screen.getByTestId("CoursesForm-githubOrg");
            const submitButton = screen.getByTestId("CoursesForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("CS 156");
            expect(schoolField).toHaveValue("UCSB");
            expect(termField).toHaveValue("f23");
            expect(startField).toHaveValue("2023-09-29T00:00");
            expect(endField).toHaveValue("2023-12-15T00:00");
            expect(githubOrgField).toHaveValue("ucsb-cs156-f23");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: "CS 148" } })
            fireEvent.change(schoolField, { target: { value: "UCSB" } })
            fireEvent.change(termField, { target: { value: "w23" } })
            fireEvent.change(startField, { target: { value: "2024-01-10T00:00" } })
            fireEvent.change(endField, { target: { value: "2023-03-12T00:00" } })
            fireEvent.change(githubOrgField, { target: { value: "ucsb-cs156-w23" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Course Updated - id: 17 name: CS 148");
            expect(mockNavigate).toBeCalledWith({ "to": "/courses" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17, name: "CS 148", endDate: "2023-03-12T00:00", startDate: "2024-01-10T00:00", school: "UCSB", term: "w23", githubOrg: "ucsb-cs156-w23" });

        });

       
    });
});


