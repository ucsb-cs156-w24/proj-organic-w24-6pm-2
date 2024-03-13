import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import SchoolEditPage from "main/pages/SchoolEditPage";

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
            abbrev: 'ucsb'
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("SchoolEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/school/get", { params: { abbrev: 'ucsb' } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <SchoolEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit School");
            expect(screen.queryByTestId("SchoolForm-name")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/school/get", { params: { abbrev: 'ucsb' } }).reply(200, {
                abbrev: "ucsb",
                name: "UC Santa Barbara",
                termRegex: "[WSMF]\\d\\d",
                termDescription: "Enter quarter, e.g. F23, W24, S24, M24",
                termError: "Quarter must be entered in the correct format"
            });
            axiosMock.onPut('/api/school/update').reply(200, {
                abbrev: "umn",
                name: "University of Minnesota",
                termRegex: "[WSMF]\\d\\d",
                termDescription: "Enter quarter, e.g. F23, W24, S24, M24",
                termError: "Quarter must be entered in the correct format"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <SchoolEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <SchoolEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("SchoolForm-name");

            const abbrevField = screen.getByTestId("SchoolForm-abbrev");
            const nameField = screen.getByTestId("SchoolForm-name");
            const termRegexField = screen.getByTestId("SchoolForm-termRegex");
            const termDescriptionField = screen.getByTestId("SchoolForm-termDescription");
            const termErrorField = screen.getByTestId("SchoolForm-termError");
            const submitButton = screen.getByTestId("SchoolForm-submit");

            expect(abbrevField).toHaveValue("ucsb");
            expect(nameField).toHaveValue("UC Santa Barbara");
            expect(termRegexField).toHaveValue("[WSMF]\\d\\d");
            expect(termDescriptionField).toHaveValue("Enter quarter, e.g. F23, W24, S24, M24");
            expect(termErrorField).toHaveValue("Quarter must be entered in the correct format");
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <SchoolEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("SchoolForm-name");

            const abbrevField = screen.getByTestId("SchoolForm-abbrev");
            const nameField = screen.getByTestId("SchoolForm-name");
            const termRegexField = screen.getByTestId("SchoolForm-termRegex");
            const termDescriptionField = screen.getByTestId("SchoolForm-termDescription");
            const termErrorField = screen.getByTestId("SchoolForm-termError");
            const submitButton = screen.getByTestId("SchoolForm-submit");

            expect(abbrevField).toHaveValue("ucsb");
            expect(nameField).toHaveValue("UC Santa Barbara");
            expect(termRegexField).toHaveValue("[WSMF]\\d\\d");
            expect(termDescriptionField).toHaveValue("Enter quarter, e.g. F23, W24, S24, M24");
            expect(termErrorField).toHaveValue("Quarter must be entered in the correct format");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(abbrevField, { target: { value: 'umn' } });
            fireEvent.change(nameField, { target: { value: 'University of Minnesota' } });
            fireEvent.change(termRegexField, { target: { value: '[WSMF]\\d\\d' } });
            fireEvent.change(termDescriptionField, { target: { value: 'Enter quarter, e.g. F23, W24, S24, M24' } });
            fireEvent.change(termErrorField, { target: { value: 'Quarter must be entered in the correct format' } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("School Updated - abbrev: umn name: University of Minnesota");
            expect(mockNavigate).toBeCalledWith({ "to": "/school" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ abbrev: "umn", name: "University of Minnesota", termRegex: "[WSMF]\\d\\d", termDescription: "Enter quarter, e.g. F23, W24, S24, M24", termError: "Quarter must be entered in the correct format"});

        });

       
    });
});


