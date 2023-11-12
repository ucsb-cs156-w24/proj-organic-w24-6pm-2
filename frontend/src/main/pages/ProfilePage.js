import React from "react";
import { useCurrentUser } from "main/utils/currentUser";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ReactJson from "react-json-view";

const ProfilePage = () => {

    const { data: currentUser } = useCurrentUser();

    if (!currentUser.loggedIn) {
        return (
            <p>Not logged in.</p>
        )
    }

    return (
       <BasicLayout>
            <ReactJson src={currentUser} / >
       </BasicLayout>
    );
};

export default ProfilePage;
