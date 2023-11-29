import React from 'react';
import SchoolForm from "main/components/School/SchoolForm"
import { schoolsFixtures } from 'fixtures/schoolsFixtures';

export default {
    title: 'components/School/SchoolForm',
    component: SchoolForm
};


const Template = (args) => {
    return (
        <SchoolForm {...args} />
    )
};

export const Create = Template.bind({});

Create.args = {
    buttonLabel: "Create",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};

export const Update = Template.bind({});

Update.args = {
    initialContents: schoolsFixtures.oneSchool,
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};