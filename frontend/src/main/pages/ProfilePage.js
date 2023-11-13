import React from "react";
import { useCurrentUser } from "main/utils/currentUser";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ReactJson from "react-json-view";
import UsersTable from "main/components/Users/UsersTable"
import UserEmailsTable from "main/components/Users/UserEmailsTable";

const ProfilePage = () => {

    const { data: currentUser } = useCurrentUser();

    if (!currentUser.loggedIn) {
        return (
            <p>Not logged in.</p>
        )
    }

    return (
        <BasicLayout>
            <h1 className={"mb-3"}>
                User Profile for {currentUser.root.user.githubLogin}
            </h1>
            <UsersTable users={[currentUser.root.user]} />
            <h2 className={"mt-3 mb-3"}>
                Emails
            </h2>
            <UserEmailsTable emails={currentUser.root.user.emails} />
            <h2 className={"mt-3 mb-3"}>
                Debugging Information
            </h2>
            <ReactJson src={currentUser} />
        </BasicLayout>
    );
};

export default ProfilePage;
