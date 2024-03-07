import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import SchoolTable from 'main/components/School/SchoolTable';
import { Button } from 'react-bootstrap';
import { hasRole, useCurrentUser} from 'main/utils/currentUser';

export default function CourseIndexPage() {

  const { data: currentUser } = useCurrentUser();

  const createButton = () => {  
    if (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_INSTRUCTOR")) 
      return (
          <Button
              variant="primary"
              href="/school/create"
              style={{ float: "right" }}
          >
              Create Course 
          </Button>
      )
    
  }
  
  const { data: school, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/school/all"],
      // Stryker disable next-line all : GET is the default
      { method: "GET", url: "/api/school/all" },
      []
    );

    return (
      <BasicLayout>
        <div className="pt-2">
          {createButton()}
          <h1>Course</h1>
          <SchoolTable school={school} currentUser={currentUser} />
        </div>
      </BasicLayout>
    )
}
