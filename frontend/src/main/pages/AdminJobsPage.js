import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import PagedJobsTable from "main/components/Jobs/PagedJobsTable";
import Accordion from "react-bootstrap/Accordion";
import TestJobForm from "main/components/Jobs/TestJobForm";
import { toast } from "react-toastify";

import { useBackendMutation } from "main/utils/useBackend";

const AdminJobsPage = () => {

  // *** Test job ***

  const objectToAxiosParamsTestJob = (data) => ({
    url: `/api/jobs/launch/testjob?fail=${data.fail}&sleepMs=${data.sleepMs}`,
    method: "POST",
  });

  // Stryker disable all
  const testJobMutation = useBackendMutation(objectToAxiosParamsTestJob, {}, [
    "/api/jobs/all",
  ]);
  // Stryker restore all

  const submitTestJob = async (data) => {
    toast("Submitted job: Test Job");
    testJobMutation.mutate(data);
  };

  

const jobLaunchers = [
  {
    name: "Test Job",
    form: <TestJobForm submitAction={submitTestJob} />,
  },
];

return (
  <BasicLayout>
    <h2 className="p-3">Launch Jobs</h2>
    <Accordion>
      {jobLaunchers.map((jobLauncher, index) => (
        <Accordion.Item eventKey={index} key={index}>
          <Accordion.Header>{jobLauncher.name}</Accordion.Header>
          <Accordion.Body>{jobLauncher.form}</Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>

    <h2 className="p-3">Job Status</h2>
    <PagedJobsTable />
  </BasicLayout>
);
};

export default AdminJobsPage;
