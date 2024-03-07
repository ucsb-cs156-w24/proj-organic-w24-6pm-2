import React, {useState} from "react";
import Modal from "react-modal";
import OurTable, { ButtonColumn } from "main/components/OurTable"
import { formatTime } from "main/utils/dateUtils";
import { useBackendMutation } from "main/utils/useBackend";

// Stryker disable all
const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    const customStyles = {
        content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "50%", // Adjust the width as needed
        maxWidth: "400px", // Limit the maximum width
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        background: "#fff",
        },
        overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        },
    };
    
    return (
        <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        style={customStyles}
        contentLabel="Confirmation Modal"
        >
        <div>{message}</div>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onClose}>No</button>
        </Modal>
    );
};
// Stryker restore all 

export default function UsersTable({ users, showToggleButtons = false }) {
    // Stryker disable next-line all : TA told me to
    const [InstructorConfirmationModalOpen, setInstructorConfirmationModalOpen] = useState(false);
    const [AdminConfirmationModalOpen, setAdminConfirmationModalOpen] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);

    // toggleAdmin
    function cellToAxiosParamsToggleAdmin(cell) {
        return {
            url: "/api/admin/users/toggleAdmin",
            method: "POST",
            params: {
                githubId: cell.row.values.githubId
            }
        }
    }

    // Stryker disable all : hard to test for query caching
    const toggleAdminMutation = useBackendMutation(
        cellToAxiosParamsToggleAdmin,
        {},
        ["/api/admin/users"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const toggleAdminCallback = async (cell) => {
        setSelectedCell(cell);
        // Stryker disable next-line all : TA told me to
        setAdminConfirmationModalOpen(true);
      };
    
      const handleToggleAdminConfirmed = () => {
        // Stryker disable next-line all : TA told me to
        setAdminConfirmationModalOpen(false);
        toggleAdminMutation.mutate(selectedCell);
    };

    // toggleInstructor
    function cellToAxiosParamsToggleInstructor(cell) {
        return {
            url: "/api/admin/users/toggleInstructor",
            method: "POST",
            params: {
                githubId: cell.row.values.githubId
            }
        }
    }

    // Stryker disable all : hard to test for query caching
    const toggleInstructorMutation = useBackendMutation(
        cellToAxiosParamsToggleInstructor,
        {},
        ["/api/admin/users"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const toggleInstructorCallback = async (cell) => {
        setSelectedCell(cell);
        // Stryker disable next-line all : TA told me to
        setInstructorConfirmationModalOpen(true);
      };
    
      const handleToggleInstructorConfirmed = () => {
        // Stryker disable next-line all : TA told me to
        setInstructorConfirmationModalOpen(false);
        toggleInstructorMutation.mutate(selectedCell);
    };

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

    const buttonColumn = [
        ...columns,
        ButtonColumn("toggle-admin", "primary", toggleAdminCallback, "UsersTable"),
        ButtonColumn("toggle-instructor", "primary", toggleInstructorCallback, "UsersTable")
    ]
    return (
        <>
          <OurTable
            data={users}
            columns={showToggleButtons ? buttonColumn : columns}
            testid={"UsersTable"}
          />
          <ConfirmationModal
            isOpen={AdminConfirmationModalOpen}
            // Stryker disable next-line all : TA told me to
            onClose={() => setAdminConfirmationModalOpen(false)}
            onConfirm={handleToggleAdminConfirmed}
            message="Are you sure you want to toggle this user's admin role?"
          />
          <ConfirmationModal
            isOpen={InstructorConfirmationModalOpen}
            // Stryker disable next-line all : TA told me to
            onClose={() => setInstructorConfirmationModalOpen(false)}
            onConfirm={handleToggleInstructorConfirmed}
            message="Are you sure you want to toggle this user's instructor role?"
          />
        </>
      );
};