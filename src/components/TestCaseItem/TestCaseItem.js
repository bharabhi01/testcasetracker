import React, { useState } from "react";
import {
  Table,
  Checkbox,
  Icon,
  Modal,
  Form,
  Button,
  Image,
  Popup,
  Confirm,
} from "semantic-ui-react";
import { supabase } from "../../clients/SupabaseClient";

function TestCaseItem({
  testCase,
  updateTestCase,
  editTestCaseName,
  deleteTestCase,
}) {
  const [openModal, setOpenModal] = useState({ open: false, env: null });
  const [imageFile, setImageFile] = useState(null);
  const [tempComment, setTempComment] = useState("");
  const [tempJiraLink, setTempJiraLink] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(testCase.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCheckboxChange = (env) => {
    const updatedTestCase = {
      ...testCase,
      [env]: { ...testCase[env], completed: !testCase[env].completed },
    };
    updateTestCase(updatedTestCase);
  };

  const handleModalOpen = (env) => {
    setOpenModal({ open: true, env });
    setTempComment(testCase[env]?.comment || "");
    setTempJiraLink(testCase.jira_link || "");
  };

  const handleModalClose = (env) => {
    setOpenModal({ open: false, env: null });
    setImageFile(null);
  };

  const handleSave = async () => {
    let imageUrl = testCase.image_url;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError, data } = await supabase.storage
        .from("test-case-images")
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
      } else {
        const { data: urlData } = supabase.storage
          .from("test-case-images")
          .getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
      }
    }

    const updatedTestCase = {
      ...testCase,
      [openModal.env]: {
        ...testCase[openModal.env],
        comment: tempComment,
      },
      jira_link: tempJiraLink,
      image_url: imageUrl,
    };

    updateTestCase(updatedTestCase);
    handleModalClose();
  };

  const handleEditName = () => {
    editTestCaseName(testCase.id, editName);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    deleteTestCase(testCase.id);
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const hasAdditionalInfo = (env) => {
    return testCase[env]?.comment || testCase.jira_link || testCase.image_url;
  };

  const renderEnvironmentCell = (env) => (
    <Table.Cell textAlign="center">
      <Checkbox
        checked={testCase[env].completed}
        onChange={() => handleCheckboxChange(env)}
      />
      {hasAdditionalInfo(env) && (
        <Popup
          trigger={
            <Icon
              circular
              name="info circle"
              link
              style={{ marginLeft: "10px" }}
            />
          }
          on="click"
          content={
            <Table basic="very" celled collapsing>
              <Table.Body>
                {testCase[env].comment && (
                  <Table.Row>
                    <Table.Cell>
                      <strong>Comment</strong>
                    </Table.Cell>
                    <Table.Cell>{testCase[env].comment}</Table.Cell>
                  </Table.Row>
                )}
                {testCase.jira_link && (
                  <Table.Row>
                    <Table.Cell>
                      <strong>Jira Link</strong>
                    </Table.Cell>
                    <Table.Cell>
                      <a
                        href={testCase.jira_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {testCase.jira_link}
                      </a>
                    </Table.Cell>
                  </Table.Row>
                )}
                {testCase.image_url && (
                  <Table.Row>
                    <Table.Cell>
                      <strong>Image</strong>
                    </Table.Cell>
                    <Table.Cell>
                      <Image src={testCase.image_url} size="small" />
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          }
          wide
        />
      )}
      <Icon
        circular
        name="bug"
        link
        onClick={() => handleModalOpen(env)}
        style={{ marginLeft: "10px" }}
      />
    </Table.Cell>
  );

  return (
    <>
      <Table.Row>
        <Table.Cell>
          {isEditing ? (
            <Form onSubmit={handleEditName}>
              <Form.Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                action={{
                  icon: "check",
                  onClick: handleEditName,
                }}
              />
            </Form>
          ) : (
            <>
              {testCase.name}
              <Icon
                name="edit"
                link
                onClick={() => setIsEditing(true)}
                style={{ marginLeft: "10px" }}
              />
            </>
          )}
        </Table.Cell>
        {renderEnvironmentCell("dev_before")}
        {renderEnvironmentCell("dev_after")}
        {renderEnvironmentCell("staging")}
        {renderEnvironmentCell("prod")}
        <Table.Cell textAlign="center">
          <Button icon="trash" color="red" onClick={handleDeleteClick} />
        </Table.Cell>
      </Table.Row>

      <Modal open={openModal.open} onClose={handleModalClose}>
        <Modal.Header>
          Edit Details for{" "}
          {openModal.env === "dev_before"
            ? "Dev (Before Merging)"
            : openModal.env === "dev_after"
            ? "Dev (After Merging)"
            : openModal.env}
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.TextArea
              label="Comment"
              value={tempComment}
              onChange={(e) => setTempComment(e.target.value)}
              placeholder={`Enter comment for ${openModal.env} environment`}
            />
            <Form.Input
              label="Jira Link"
              placeholder="Enter Jira link"
              value={tempJiraLink}
              onChange={(e) => setTempJiraLink(e.target.value)}
            />
            <Form.Field>
              <label>Image</label>
              {testCase.image_url && (
                <Image src={testCase.image_url} size="small" />
              )}
              <Button
                as="label"
                htmlFor="file"
                type="button"
                content="Choose File"
                labelPosition="left"
                icon="file"
              />
              <input
                type="file"
                id="file"
                hidden
                onChange={(e) => setImageFile(e.target.files[0])}
                accept="image/*"
              />
              {imageFile && <p>Selected file: {imageFile.name}</p>}
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button positive onClick={handleSave}>
            Save
          </Button>
        </Modal.Actions>
      </Modal>

      <Confirm
        open={showDeleteConfirm}
        content={`Are you sure you want to delete the test case "${testCase.name}"?`}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}

export default TestCaseItem;
