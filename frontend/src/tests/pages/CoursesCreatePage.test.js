import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import CoursesCreatePage from "main/pages/CoursesCreatePage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("CourseCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend", async () => {

        const queryClient = new QueryClient();
        const course = {
            id: 1,
            name: "CS156",
            school: "UCSB",
            term: "F23",
            startDate: "2023-09-24T12:00:00",
            endDate: "2023-12-15T12:00:00",
            githubOrg: "ucsb-cs156-f23"
        };

        axiosMock.onPost("/api/courses/post").reply(202, course);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("CoursesForm-name")).toBeInTheDocument();
        });

        const nameField = screen.getByTestId("CoursesForm-name");
        const schoolField = screen.getByTestId("CoursesForm-school");
        const termField = screen.getByTestId("CoursesForm-term");
        const startDateField = screen.getByTestId("CoursesForm-startDate");
        const endDateField = screen.getByTestId("CoursesForm-endDate");
        const githubOrgField = screen.getByTestId("CoursesForm-githubOrg");
        const submitButton = screen.getByTestId("CoursesForm-submit");

        fireEvent.change(nameField, { target: { value: 'CS156' } });
        fireEvent.change(schoolField, { target: { value: 'UCSB' } });
        fireEvent.change(termField, { target: { value: 'F23' } });
        fireEvent.change(startDateField, { target: { value: '2023-09-24T12:00:00' } });
        fireEvent.change(endDateField, { target: { value: '2023-12-15T12:00:00' } });
        fireEvent.change(githubOrgField, { target: { value: 'ucsb-cs156-f23' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "name": "CS156",
                "school": "UCSB",
                "term": "F23",
                "startDate": "2023-09-24T12:00",
                "endDate": "2023-12-15T12:00",
                "githubOrg": "ucsb-cs156-f23"
        });

        expect(mockToast).toBeCalledWith("New course created - id: 1");
        expect(mockNavigate).toBeCalledWith({ "to": "/courses" });
    });

    test("displays an error message when an incorrect term format is inputted", async () => {
        const queryClient = new QueryClient();
        render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <CoursesCreatePage />
            </MemoryRouter>
          </QueryClientProvider>
        );
      
        await waitFor(() => {
          expect(screen.getByTestId("CoursesForm-name")).toBeInTheDocument();
        });
      
        const nameField = screen.getByTestId("CoursesForm-name");
        const schoolField = screen.getByTestId("CoursesForm-school");
        const termField = screen.getByTestId("CoursesForm-term");
        const startDateField = screen.getByTestId("CoursesForm-startDate");
        const endDateField = screen.getByTestId("CoursesForm-endDate");
        const githubOrgField = screen.getByTestId("CoursesForm-githubOrg");
        const submitButton = screen.getByTestId("CoursesForm-submit");
      
        fireEvent.change(nameField, { target: { value: 'CS156' } });
        fireEvent.change(schoolField, { target: { value: 'UCSB' } });
        fireEvent.change(termField, { target: { value: 'IncorrectTerm' } });
        fireEvent.change(startDateField, { target: { value: '2023-09-24T12:00:00' } });
        fireEvent.change(endDateField, { target: { value: '2023-12-15T12:00:00' } });
        fireEvent.change(githubOrgField, { target: { value: 'ucsb-cs156-f23' } });
      
        fireEvent.click(submitButton);
      
        await waitFor(() => {
          expect(mockToast).toHaveBeenCalledWith("Error: The term must be in the format of a season letter (w, s, or f) followed by a 2-digit year. For example, w24, s24, f24.");
        });
      });

      test("displays an error message when term does not start with season", async () => {
        const queryClient = new QueryClient();
        render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <CoursesCreatePage />
            </MemoryRouter>
          </QueryClientProvider>
        );
      
        await waitFor(() => {
          expect(screen.getByTestId("CoursesForm-name")).toBeInTheDocument();
        });
      
        const nameField = screen.getByTestId("CoursesForm-name");
        const schoolField = screen.getByTestId("CoursesForm-school");
        const termField = screen.getByTestId("CoursesForm-term");
        const startDateField = screen.getByTestId("CoursesForm-startDate");
        const endDateField = screen.getByTestId("CoursesForm-endDate");
        const githubOrgField = screen.getByTestId("CoursesForm-githubOrg");
        const submitButton = screen.getByTestId("CoursesForm-submit");
      
        fireEvent.change(nameField, { target: { value: 'CS156' } });
        fireEvent.change(schoolField, { target: { value: 'UCSB' } });
        fireEvent.change(termField, { target: { value: 'aw23' } });
        fireEvent.change(startDateField, { target: { value: '2023-09-24T12:00:00' } });
        fireEvent.change(endDateField, { target: { value: '2023-12-15T12:00:00' } });
        fireEvent.change(githubOrgField, { target: { value: 'ucsb-cs156-f23' } });
      
        fireEvent.click(submitButton);
      
        await waitFor(() => {
          expect(mockToast).toHaveBeenCalledWith("Error: The term must be in the format of a season letter (w, s, or f) followed by a 2-digit year. For example, w24, s24, f24.");
        });
      });

      test("displays an error message when term does not end with year", async () => {
        const queryClient = new QueryClient();
        render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <CoursesCreatePage />
            </MemoryRouter>
          </QueryClientProvider>
        );
      
        await waitFor(() => {
          expect(screen.getByTestId("CoursesForm-name")).toBeInTheDocument();
        });
      
        const nameField = screen.getByTestId("CoursesForm-name");
        const schoolField = screen.getByTestId("CoursesForm-school");
        const termField = screen.getByTestId("CoursesForm-term");
        const startDateField = screen.getByTestId("CoursesForm-startDate");
        const endDateField = screen.getByTestId("CoursesForm-endDate");
        const githubOrgField = screen.getByTestId("CoursesForm-githubOrg");
        const submitButton = screen.getByTestId("CoursesForm-submit");
      
        fireEvent.change(nameField, { target: { value: 'CS156' } });
        fireEvent.change(schoolField, { target: { value: 'UCSB' } });
        fireEvent.change(termField, { target: { value: 'w23a' } });
        fireEvent.change(startDateField, { target: { value: '2023-09-24T12:00:00' } });
        fireEvent.change(endDateField, { target: { value: '2023-12-15T12:00:00' } });
        fireEvent.change(githubOrgField, { target: { value: 'ucsb-cs156-f23' } });
      
        fireEvent.click(submitButton);
      
        await waitFor(() => {
          expect(mockToast).toHaveBeenCalledWith("Error: The term must be in the format of a season letter (w, s, or f) followed by a 2-digit year. For example, w24, s24, f24.");
        });
      });

});

