import React from 'react';
import SchoolTable from "main/components/School/SchoolTable";
import { schoolsFixtures } from 'fixtures/schoolsFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/School/SchoolTable',
    component: SchoolTable
};

const Template = (args) => {
    return (
        <SchoolTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    school: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    school: schoolsFixtures.threeSchool,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    school: schoolsFixtures.threeSchool,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/school', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};