import React from "react";
 import OurTable, { ButtonColumn } from "main/components/OurTable"
 import { useBackendMutation } from "main/utils/useBackend";
 import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/components/Utils/CoursesUtils"
 import { useNavigate } from "react-router-dom";
 import { hasRole } from "main/utils/currentUser";

 export default function CoursesTable({ courses, currentUser, onJoinClick }) {

     const navigate = useNavigate();

     const editCallback = (cell) => {
         navigate(`/courses/edit/${cell.row.values.id}`);
     };

     // Stryker disable all : hard to test for query caching

     const deleteMutation = useBackendMutation(
         cellToAxiosParamsDelete,
         { onSuccess: onDeleteSuccess },
         ["/api/courses/all"]
     );
     // Stryker restore all 

     // Stryker disable next-line all : TODO try to make a good test for this
     const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

     const joinCallBack = (cell) => {
        onJoinClick(cell.row.values.id);
    };

     const columns = [
         {
             Header: 'id',
             accessor: 'id',
         },
         {
             Header: 'Name',
             accessor: 'name',
         },
         {
             Header: 'School',
             accessor: 'school',
         },
         {
             Header: 'Term',
             accessor: 'term',
         },
         {
             Header: 'StartDate',
             accessor: 'startDate',
         },
         {
             Header: 'EndDate',
             accessor: 'endDate',
         },
         {
             Header: 'GitHub Org',
             accessor: 'githubOrg',
         },
     ];

     if (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_INSTRUCTOR")) {
         columns.push(ButtonColumn("Edit", "primary", editCallback, "CoursesTable"));
         columns.push(ButtonColumn("Delete", "danger", deleteCallback, "CoursesTable"));
         columns.push(ButtonColumn("Join", undefined, joinCallBack, "CoursesTable"));
     }

     return <OurTable
         data={courses}
         columns={columns}
         testid={"CoursesTable"} />;
    };