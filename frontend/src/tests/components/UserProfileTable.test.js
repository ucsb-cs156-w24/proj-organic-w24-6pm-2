import UserProfileTable from "main/components/UserProfileTable";
import { render, screen } from "@testing-library/react";

describe("UserProfileTable tests", () => {
    test("renders an empty table without crashing", () => {
        render(
            <UserProfileTable user={{}} />
        );

        expect(screen.queryByText("Stryker was here!")).not.toBeInTheDocument();
    });
    test("renders a table with user info", async () => {
        const user = {
            fullName: "Joe Biden",
            email: "joebiden@whitehouse.gov",
            githubId: 123,
            githubLogin: 'potus',
            admin: true
        }

        render(
            <UserProfileTable user={user} />
        );

        // await waitFor(()=>expect(screen.getByText("Joe Biden")).toBeInTheDocument());
        // expect(screen.getByText("joebiden@whitehouse.gov")).toBeInTheDocument();
        // expect(screen.getByText("123")).toBeInTheDocument();
        // expect(screen.getByText("true")).toBeInTheDocument();
        // expect(screen.getByText("potus")).toBeInTheDocument();
        // expect(screen.queryByText("Stryker was here!")).not.toBeInTheDocument();

    });
});