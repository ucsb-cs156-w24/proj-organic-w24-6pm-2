import { render, screen } from "@testing-library/react";
import UserEmailsTable from "main/components/Users/UserEmailsTable";
import { userEmailFixtures } from "fixtures/userEmailFixtures";

describe("UserEmailsTable tests", () => {
  
    test("Has the expected colum headers and content", () => {
        render(
          <UserEmailsTable emails={userEmailFixtures.userWithFourEmails}/>
        );
    
        const expectedHeaders = ["email"]
        const expectedFields = ["email"]
        const testId = "UserEmailsTable";

        expectedHeaders.forEach( (headerText)=> {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach( (field)=> {
          const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
          expect(header).toBeInTheDocument();
        });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-email`)).toHaveTextContent("pconrad@cs.ucsb.edu");
       
      });
});
