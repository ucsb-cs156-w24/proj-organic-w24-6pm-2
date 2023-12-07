import CoursesTable from "main/components/Courses/CoursesTable"
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { coursesFixtures } from "fixtures/coursesFixtures";
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
          <CoursesTable courses={coursesFixtures.threeCourses} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["id", "Name", "School", "Term", "StartDate", "EndDate", "GitHub Org"];
    const expectedFields = ["id", "name", "school", "term", "startDate", "endDate", "githubOrg"];
    const testId = "CoursesTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");

    const editButton = screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).not.toBeInTheDocument();

    const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).not.toBeInTheDocument();

  });

  test("renders empty table correctly", () => {

    // arrange
    const currentUser = currentUserFixtures.adminUser;

    const expectedHeaders = ["id", "Name", "School", "Term", "StartDate", "EndDate", "GitHub Org"];
    const expectedFields = ["id", "name", "school", "term", "startDate", "endDate", "githubOrg"];
    const testId = "CoursesTable";

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CoursesTable courses={[]} currentUser={currentUser} />
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
            <CoursesTable courses={coursesFixtures.threeCourses} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["id", "Name", "School", "Term", "StartDate", "EndDate", "GitHub Org"];
    const expectedFields = ["id", "name", "school", "term", "startDate", "endDate", "githubOrg"];
    const testId = "CoursesTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });

  test("Edit button navigates to the edit page for admin user", async () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
            <CoursesTable courses={coursesFixtures.threeCourses} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(screen.getByTestId(`CoursesTable-cell-row-0-col-id`)).toHaveTextContent("1"); });

    const editButton = screen.getByTestId(`CoursesTable-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/courses/edit/1'));

  });


  test("Delete button calls the callback", async () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
            <CoursesTable courses={coursesFixtures.threeCourses} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(screen.getByTestId(`CoursesTable-cell-row-0-col-id`)).toHaveTextContent("1"); });

    const deleteButton = screen.getByTestId(`CoursesTable-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

  });

});