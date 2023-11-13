
import React from 'react';
import { userEmailFixtures } from "fixtures/userEmailFixtures";
import UserEmailsTable from "main/components/Users/UserEmailsTable";

export default {
    title: 'components/Users/UserEmailsTable',
    component: UserEmailsTable
};

const Template = (args) => {
    return (
        <UserEmailsTable {...args} />
    )
};

export const fourEmails = Template.bind({});
fourEmails.args = {
   emails: userEmailFixtures.userWithFourEmails
};





