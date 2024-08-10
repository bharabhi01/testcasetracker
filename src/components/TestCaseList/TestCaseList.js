import React from "react";
import { Table, Button } from "semantic-ui-react";
import TestCaseItem from "../TestCaseItem/TestCaseItem";
import { convertToCSV, downloadCSV } from "../../utils/csvUtils";

function TestCaseList({
  testCases,
  updateTestCase,
  editTestCaseName,
  deleteTestCase,
}) {
  const handleExportToCSV = () => {
    const csvContent = convertToCSV(testCases);
    downloadCSV(csvContent, "test-cases.csv");
  };

  return (
    <Table basic="very">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell style={{ color: "#5c6470" }}>
            Test Case
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" style={{ color: "#5c6470" }}>
            Dev (Before Merging)
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" style={{ color: "#5c6470" }}>
            Dev (After Merging)
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" style={{ color: "#5c6470" }}>
            Staging
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" style={{ color: "#5c6470" }}>
            Prod
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" style={{ color: "#5c6470" }}>
            Actions
          </Table.HeaderCell>
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

        <Button
          primary
          icon="download"
          onClick={handleExportToCSV}
          content="Export to CSV"
          style={{ marginTop: "10px" }}
        />
      </Table.Body>
    </Table>
  );
}

export default TestCaseList;
