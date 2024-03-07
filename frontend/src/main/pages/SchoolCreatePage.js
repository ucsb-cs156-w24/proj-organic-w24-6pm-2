import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import SchoolForm from "main/components/School/SchoolForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function SchoolCreatePage({storybook=false}) {

    const objectToAxiosParams = (school) => ({
        url: "/api/school/post",
        method: "POST",
        params: {
        name: school.name,
        school: school.school,
        term: school.term,
        startDate: school.startDate,
        endDate: school.endDate,
        githubOrg: school.githubOrg
        }
    });

    const onSuccess = (school) => {
        toast(`New school created - id: ${school.id}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosParams,
        { onSuccess }, 
        // Stryker disable next-line all : hard to set up test for caching
        ["/api/school/all"] // mutation makes this key stale so that pages relying on it reload
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
            <h1>Create New School</h1>

            <SchoolForm submitAction={onSubmit} />

        </div>
        </BasicLayout>
    )
}