import ItemCountChart from "@/components/charts/ItemCountChart";
import { FaRegListAlt } from "react-icons/fa";
import { HiUser } from 'react-icons/hi';
import { HiListBullet } from "react-icons/hi2";
import { MdSubject } from "react-icons/md";
import { RiOrganizationChart } from "react-icons/ri";
import { SiGoogleclassroom } from "react-icons/si";
import LinkButton from "./buttons/LinkButton";
import ItemBorrowCountChart from "./charts/ItemBorrowCountChart";
import SubjectBorrowCountChart from "./charts/SubjectBorrowCountChart";
import DepartmentBorrowCountChart from "./charts/DepartmentBorrowCountChart";

export default function HomeComponent() {
  return (
    <div className="flex flex-row w-full">
    <div className="flex flex-col gap-5 basis-1/2 items-center">
      <h4>Manage Data</h4>
      <div className="flex flex-col gap-5 min-w-[300px]">
        <LinkButton href="/items"><HiListBullet className="mr-2" size={24} />Items</LinkButton>
        <LinkButton href="/users"><HiUser className="mr-2" size={24} />Users</LinkButton>
        <LinkButton href="/departments"><RiOrganizationChart className="mr-2" size={24} />Departments</LinkButton>
        <LinkButton href="/sections"><SiGoogleclassroom className="mr-2" size={24} />Sections</LinkButton>
        <LinkButton href="/subjects"><MdSubject className="mr-2" size={24} />Subjects</LinkButton>
        <LinkButton href="/transactions"><FaRegListAlt className="mr-2" size={24} />Transactions</LinkButton>
      </div>
      <DepartmentBorrowCountChart />
      <SubjectBorrowCountChart />
    </div>
    <div className="flex flex-col gap-5 basis-1/2">
      <ItemCountChart />
      <ItemBorrowCountChart />
    </div>
  </div>
  )
}
