import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import SchoolForm from "main/components/School/SchoolForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function SchoolEditPage({storybook=false}) {
  let { id } = useParams();

  const { data: school, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/school?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/school/get`,
        params: {
          id
        }
      }
    );


  const objectToAxiosPutParams = (school) => ({
    url: "/api/school/update",
    method: "PUT",
    params: {
      id: school.id,
      name: school.name,
      school: school.school,
      term: school.term,
      startDate: school.startDate,
      endDate: school.endDate,
      githubOrg: school.githubOrg
    },
  });

  const onSuccess = (school) => {
    toast(`Course Updated - id: ${school.id} name: ${school.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/school?id=${id}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/school" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Course</h1>
        {
          school && <SchoolForm initialContents={school} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}

