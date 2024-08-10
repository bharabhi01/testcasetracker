import React from "react";
import { Table } from "semantic-ui-react";
import TestCaseItem from "./TestCaseItem";

function TestCaseList({
  testCases,
  updateTestCase,
  editTestCaseName,
  deleteTestCase,
}) {
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Test Case</Table.HeaderCell>
          <Table.HeaderCell>Dev (Before Merging)</Table.HeaderCell>
          <Table.HeaderCell>Dev (After Merging)</Table.HeaderCell>
          <Table.HeaderCell>Staging</Table.HeaderCell>
          <Table.HeaderCell>Prod</Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {testCases.map((testCase) => (
          <TestCaseItem
            key={testCase.id}
            testCase={testCase}
            updateTestCase={updateTestCase}
            editTestCaseName={editTestCaseName}
            deleteTestCase={deleteTestCase}
          />
        ))}
      </Table.Body>
    </Table>
  );
}

export default TestCaseList;
