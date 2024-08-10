export function convertToCSV(testCases) {
  const headers = [
    "Test Case Name",
    "Dev (Before Merging) Status",
    "Dev (Before Merging) Comment",
    "Dev (After Merging) Status",
    "Dev (After Merging) Comment",
    "Staging Status",
    "Staging Comment",
    "Prod Status",
    "Prod Comment",
    "Jira Link",
    "Image URL",
  ];

  const rows = testCases.map((tc) => [
    tc.name,
    tc.dev_before.completed ? "Completed" : "Not Completed",
    tc.dev_before.comment,
    tc.dev_after.completed ? "Completed" : "Not Completed",
    tc.dev_after.comment,
    tc.staging.completed ? "Completed" : "Not Completed",
    tc.staging.comment,
    tc.prod.completed ? "Completed" : "Not Completed",
    tc.prod.comment,
    tc.jira_link,
    tc.image_url,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell || ""}"`).join(",")),
  ].join("\n");

  return csvContent;
}

export function downloadCSV(csvContent, fileName) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
