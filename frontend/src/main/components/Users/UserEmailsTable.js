import React from "react";
import OurTable from "main/components/OurTable"

const columns = [
    {
        Header: 'email',
        accessor: 'email', // accessor is the "key" in the data
    },
];

export default function UserEmailsTable({ emails }) {
    return <OurTable
        data={emails}
        columns={columns}
        testid={"UserEmailsTable"} />;
};