import React from "react";
import OurTable from "main/components/OurTable"
import { formatTime } from "main/utils/dateUtils";

const columns = [
    {
        Header: 'githubId',
        accessor: 'githubId', // accessor is the "key" in the data
    },
    {
        Header: 'githubLogin',
        accessor: 'githubLogin', // accessor is the "key" in the data
    },
    {
        Header: 'fullName',
        accessor: 'fullName',
    },
    {
        Header: 'Email',
        accessor: 'email',
    },
    {
        Header: 'Last Online',
        id: 'lastOnline',
        accessor: (row) => formatTime(row.lastOnline),
    },
    {
        Header: 'Admin',
        id: 'admin',
        accessor: (row, _rowIndex) => String(row.admin) // hack needed for boolean values to show up
    },
    {
        Header: 'Instructor',
        id: 'instructor',
        accessor: (row, _rowIndex) => String(row.instructor) // hack needed for boolean values to show up
    },
];

export default function UsersTable({ users }) {
    return <OurTable
        data={users}
        columns={columns}
        testid={"UsersTable"} />;
};