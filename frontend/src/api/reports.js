import client from "./client";

export function getReportsSummary() {
  return client.get("/reports/summary").then((res) => res.data);
}

export function downloadReportsCsv() {
  return client.get("/reports/export/csv", {
    responseType: "blob",
  });
}
