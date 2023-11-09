import React from "react";
import ReactJson from "react-json-view";

export default function UserProfileTable({ user }) {
    return (
        <ReactJson src={user} />
    );
}
