import client from "./client";

export function getReportsSummary() {
  return client.get("/reports/summary").then((res) => res.data);
}
