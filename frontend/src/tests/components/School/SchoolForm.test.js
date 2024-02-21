import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import SchoolForm from "main/components/School/SchoolForm";
import { schoolsFixtures } from "fixtures/schoolsFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("SchoolForm tests", () => {

    test("renders correctly", async () => {
        render(
            <Router  >
                <SchoolForm/>
            </Router>
        );
        await screen.findByText(/Abbreviation/);
        await screen.findByText(/Create/);
    });

    test("renders correctly when passing in a School", async () => {
        render(
            <Router  >
                <SchoolForm initialContents={schoolsFixtures.oneSchool} />
            </Router>
        );
        await screen.findByTestId(/SchoolForm-abbrev/);
        expect(screen.getByText(/Abbreviation/)).toBeInTheDocument();
        expect(screen.getByTestId(/SchoolForm-abbrev/)).toHaveValue("ucsb");
    });

    test("Correct Error messsages on bad input", async () => {
        render(
            <Router  >
                <SchoolForm/>
            </Router>
        );
        await screen.findByTestId("SchoolForm-abbrev");
        const abbrevField = screen.getByTestId("SchoolForm-abbrev");
        const submitButton = screen.getByTestId("SchoolForm-submit");

        fireEvent.change(abbrevField, { target: { value: 'Bad-Input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/Abbreviation must be lowercase letters/);
    });

    test("Correct Error messsages on missing input", async () => {
        render(
            <Router  >
                <SchoolForm/>
            </Router>
        );
        await screen.findByTestId("SchoolForm-submit");
        const submitButton = screen.getByTestId("SchoolForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Abbreviation is required./);
        expect(screen.getByText(/Name is required./)).toBeInTheDocument();
        expect(screen.getByText(/Term Regex is required./)).toBeInTheDocument();
        expect(screen.getByText(/Term Description is required./)).toBeInTheDocument();
        expect(screen.getByText(/Term Error is required./)).toBeInTheDocument();
    });

    test("No Error messsages on good input", async () => {
        const mockSubmitAction = jest.fn();
        render(
            <Router  >
                <SchoolForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("SchoolForm-abbrev");

        const abbrevField = screen.getByTestId("SchoolForm-abbrev");
        const nameField = screen.getByTestId("SchoolForm-name");
        const termRegexField = screen.getByTestId("SchoolForm-termRegex");
        const termDescriptionField = screen.getByTestId("SchoolForm-termDescription");
        const termErrorField = screen.getByTestId("SchoolForm-termError");
        const submitButton = screen.getByTestId("SchoolForm-submit");

        fireEvent.change(abbrevField, { target: { value: 'ucsb' } });
        fireEvent.change(nameField, { target: { value: 'UC Santa Barbara' } });
        fireEvent.change(termRegexField, { target: { value: '[WSMF]\\d\\d' } });
        fireEvent.change(termDescriptionField, { target: { value: 'Enter quarter, e.g. F23, W24, S24, M24' } });
        fireEvent.change(termErrorField, { target: { value: 'Quarter must be entered in the correct format' } });
        fireEvent.click(submitButton);

        await screen.findByTestId(/SchoolForm-abbrev/);
        expect(screen.queryByText(/Abbreviation is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Abbreviation must be lowercase letters (_ and . allowed), e.g. ucsb/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Name is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Term Regex is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Term Description is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Term Error is required./)).not.toBeInTheDocument();
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <Router  >
                <SchoolForm/>
            </Router>
        );
        await screen.findByTestId("SchoolForm-cancel");
        const cancelButton = screen.getByTestId("SchoolForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });
});


