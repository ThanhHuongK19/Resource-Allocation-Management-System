export type Employee = {
  id: string;
  name: string;
  role: string;
  department: string;
};
export const PROJECT_STATUSES = ["Active", "Planning", "Completed"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type Project = {
  id: string;
  name: string;
  code: string;
  client: string;
  status: ProjectStatus;
  color: string;
};
export type Allocation = {
  id: string;
  employeeId: string;
  projectId: string;
  percentage: number;
};
export type View =
  | "dashboard"
  | "employees"
  | "projects"
  | "allocations"
  | "reports";
export type ReportTab = "available" | "overloaded";
