
import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { schoolsFixtures } from 'fixtures/schoolsFixtures';
import { rest } from "msw";

import SchoolEditPage from 'main/pages/SchoolEditPage';

export default {
    title: 'pages/SchoolEditPage',
    component: SchoolEditPage
};

const Template = () => <SchoolEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.adminUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/school', (_req, res, ctx) => {
            return res(ctx.json(schoolsFixtures.threeSchools[0]));
        }),
        rest.put('/api/school', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}



