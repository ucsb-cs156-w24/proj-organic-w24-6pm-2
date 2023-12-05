import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import CoursesForm from "main/components/Courses/CoursesForm";
import { coursesFixtures } from "fixtures/coursesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("CoursesForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <CoursesForm />
            </Router>
        );
        await screen.findByText(/Name/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a Courses", async () => {

        render(
            <Router  >
                <CoursesForm initialContents={coursesFixtures.oneCourse} />
            </Router>
        );
        await screen.findByTestId(/CoursesForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/CoursesForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <CoursesForm />
            </Router>
        );
        await screen.findByTestId("CoursesForm-submit");
        const submitButton = screen.getByTestId("CoursesForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Name is required./);
        expect(screen.getByText(/Name is required/)).toBeInTheDocument();
        expect(screen.getByText(/School is required./)).toBeInTheDocument();
        expect(screen.getByText(/Term is required./)).toBeInTheDocument();
        expect(screen.getByText(/StartDate date is required./)).toBeInTheDocument();
        expect(screen.getByText(/EndDate date is required./)).toBeInTheDocument();
        expect(screen.getByText(/GithubOrg is required./)).toBeInTheDocument();
    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <CoursesForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("CoursesForm-name");

        const nameField = screen.getByTestId("CoursesForm-name");
        const schoolField = screen.getByTestId("CoursesForm-school");
        const termField = screen.getByTestId("CoursesForm-term");
        const startDateField = screen.getByTestId("CoursesForm-startDate");
        const endDateField = screen.getByTestId("CoursesForm-endDate");
        const githubOrgField = screen.getByTestId("CoursesForm-githubOrg")
        const submitButton = screen.getByTestId("CoursesForm-submit");

        fireEvent.change(nameField, { target: { value: "CMPSC 156" } });
        fireEvent.change(schoolField, { target: { value: 'ucsb' } });
        fireEvent.change(termField, { target: { value: 'f23' } });
        fireEvent.change(startDateField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.change(endDateField, { target: { value: '2022-02-02T12:00' } });
        fireEvent.change(githubOrgField, { target: { value: 'cs156-f23'}})
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/StartDate date is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/EndDate date is required./)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <CoursesForm />
            </Router>
        );
        await screen.findByTestId("CoursesForm-cancel");
        const cancelButton = screen.getByTestId("CoursesForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});