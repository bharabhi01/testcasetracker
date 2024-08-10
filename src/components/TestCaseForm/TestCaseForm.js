import React, { useState } from "react";
import { Form, Button } from "semantic-ui-react";

function TestCaseForm({ addTestCase }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      const newTestCase = {
        name,
        dev: { completed: false, comment: "" },
        staging: { completed: false, comment: "" },
        prod: { completed: false, comment: "" },
      };
      addTestCase(newTestCase);
      setName("");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Field>
        <label>Test Case Name</label>
        <input
          placeholder="Enter test case name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Field>
      <Button type="submit">Add Test Case</Button>
    </Form>
  );
}

export default TestCaseForm;
