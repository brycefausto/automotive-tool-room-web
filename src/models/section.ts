import { Department } from "./department"

export interface Section {
  _id: string
  name: string
  professor: string
  department?: Department
}
