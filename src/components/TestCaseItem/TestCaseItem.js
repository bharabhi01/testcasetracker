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
        <Table.Cell>
          <Button icon="trash" color="red" onClick={handleDeleteClick} />
        </Table.Cell>
      </Table.Row>

      {/* ... (keep the existing Modal) */}

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
