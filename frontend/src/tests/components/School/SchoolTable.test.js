import SchoolTable from "main/components/School/SchoolTable"
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { schoolsFixtures } from "fixtures/schoolsFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("UserTable tests", () => {
  const queryClient = new QueryClient();

  test("Has the expected column headers and content for ordinary user", () => {

    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SchoolTable school={schoolsFixtures.threeSchools} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["Abbrev", "Name", "Term Regex", "Term Description", "Term Error"];
    const expectedFields = ["abbrev", "name", "termRegex", "termDescription", "termError"];
    const testId = "SchoolTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-abbrev`)).toHaveTextContent("ucsb");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-abbrev`)).toHaveTextContent("umn");

    const editButton = screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).not.toBeInTheDocument();

    const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).not.toBeInTheDocument();

    const joinButton = screen.queryByTestId(`${testId}-cell-row-0-col-Join-button`);
    expect(joinButton).not.toBeInTheDocument();

  });

  test("renders empty table correctly", () => {

    // arrange
    const currentUser = currentUserFixtures.adminUser;

    const expectedHeaders = ["Abbrev", "Name", "Term Regex", "Term Description", "Term Error"];
    const expectedFields = ["abbrev", "name", "termRegex", "termDescription", "termError"];
    const testId = "SchoolTable";

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SchoolTable school={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(fieldElement).not.toBeInTheDocument();
    });
  });

  test("renders empty table when the school returns a NON-JSON object", () => {

    // arrange
    const currentUser = currentUserFixtures.adminUser;

    const expectedHeaders = ["Abbrev", "Name", "Term Regex", "Term Description", "Term Error"];
    const expectedFields = ["abbrev", "name", "termRegex", "termDescription", "termError"];
    const testId = "SchoolTable";

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SchoolTable school={1} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(fieldElement).not.toBeInTheDocument();
    });
  });

  test("Has the expected colum headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SchoolTable school={schoolsFixtures.threeSchools} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["Abbrev", "Name", "Term Regex", "Term Description", "Term Error"];
    const expectedFields = ["abbrev", "name", "termRegex", "termDescription", "termError"];
    const testId = "SchoolTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-abbrev`)).toHaveTextContent("ucsb");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-abbrev`)).toHaveTextContent("umn");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

    const joinButton = screen.queryByTestId(`SchoolTable-cell-row-0-col-Join-button`);
    expect(joinButton).toBeInTheDocument();

  });

  test("Edit button navigates to the edit page for admin user", async () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SchoolTable school={schoolsFixtures.threeSchools} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(screen.getByTestId(`SchoolTable-cell-row-0-col-abbrev`)).toHaveTextContent("ucsb"); });

    const editButton = screen.getByTestId(`SchoolTable-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/school/edit/ucsb'));

  });


  test("Delete button calls the callback", async () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SchoolTable school={schoolsFixtures.threeSchools} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(screen.getByTestId(`SchoolTable-cell-row-0-col-abbrev`)).toHaveTextContent("ucsb"); });

    const deleteButton = screen.getByTestId(`SchoolTable-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

  });

  test("Join button calls the callback", async () => {
    const currentUser = currentUserFixtures.adminUser;
    const onJoinClickMock = jest.fn();
  
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SchoolTable school={schoolsFixtures.threeSchools} currentUser={currentUser} onJoinClick={onJoinClickMock} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  
    await waitFor(() => { expect(screen.getByTestId(`SchoolTable-cell-row-0-col-abbrev`)).toHaveTextContent("ucsb"); });
  
    const joinButton = screen.getByTestId(`SchoolTable-cell-row-0-col-Join-button`);
    expect(joinButton).toBeInTheDocument();
  
    fireEvent.click(joinButton);
    expect(onJoinClickMock).toHaveBeenCalled();

  });

});