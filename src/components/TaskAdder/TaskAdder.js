import React, { useState, useEffect } from "react";
import { supabase } from "../../clients/SupabaseClient";
import { Container, Header, Segment } from "semantic-ui-react";
import TestCaseForm from "../TestCaseForm/TestCaseForm";
import TestCaseList from "../TestCaseList/TestCaseList";

function TaskAdder() {
  const [testCases, setTestCases] = useState([]);

  useEffect(() => {
    fetchTestCases();
  }, []);

  async function fetchTestCases() {
    const { data, error } = await supabase
      .from("test_cases")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching test cases:", error);
    } else {
      setTestCases(data);
    }
  }

  async function addTestCase(newTestCase) {
    const { data, error } = await supabase
      .from("test_cases")
      .insert([newTestCase])
      .select();

    if (error) {
      console.error("Error adding test case:", error);
    } else {
      setTestCases([data[0], ...testCases]);
    }
  }

  async function updateTestCase(updatedTestCase) {
    const { error } = await supabase
      .from("test_cases")
      .update(updatedTestCase)
      .eq("id", updatedTestCase.id);

    if (error) console.error("Error updating test case:", error);
    else {
      setTestCases(
        testCases.map((tc) =>
          tc.id === updatedTestCase.id ? updatedTestCase : tc
        )
      );
    }
  }

  return (
    <Container>
      <Header as="h1" textAlign="center">
        Test Case Tracker
      </Header>
      <Segment basic>
        <TestCaseForm addTestCase={addTestCase} />
      </Segment>
      <Segment>
        <TestCaseList
          testCases={testCases}
          updateTestCase={updateTestCase}
          editTestCaseName={editTestCaseName}
          deleteTestCase={deleteTestCase}
        />
      </Segment>
    </Container>
  );

  async function editTestCaseName(id, newName) {
    const { error } = await supabase
      .from("test_cases")
      .update({ name: newName })
      .eq("id", id);

    if (error) {
      console.error("Error editing test case name:", error);
    } else {
      setTestCases(
        testCases.map((tc) => (tc.id === id ? { ...tc, name: newName } : tc))
      );
    }
  }

  async function deleteTestCase(id) {
    const { error } = await supabase.from("test_cases").delete().eq("id", id);

    if (error) {
      console.error("Error deleting test case:", error);
    } else {
      setTestCases(testCases.filter((tc) => tc.id !== id));
    }
  }
}
