import { Dropdown, Select } from 'flowbite-react';
import { useState } from 'react';
import { TagsInput } from "react-tag-input-component";
import './TagsInput.css';

export interface RemarksFilterDropdownProps {
  onChangeFilter: (remarksFilter: string) => void,
  onChangeRemarks: (remarks: string[]) => void,
}

export default function RemarksFilterDropdown({ onChangeFilter, onChangeRemarks }: RemarksFilterDropdownProps) {
  const [remarksFilter, setRemarksFilter] = useState('All');
  const [remarks, setRemarks] = useState<string[]>([]);

  const handleOnChangeFilter = (value: string) => {
    setRemarksFilter(value);
    onChangeFilter(value);
  }

  const handleOnChangeRemarks = (values: string[]) => {
    setRemarks([...values]);
    onChangeRemarks(values);
  }

  return (
    <Dropdown label="Filter by remarks">
      <div id="remarksFilter" className="bg-white">
        <div className="p-3">
          <Select value={remarksFilter} onChange={(e) => handleOnChangeFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="With Remarks">With Remarks</option>
            <option value="No Remarks">No Remarks</option>
          </Select>
          {remarksFilter == 'With Remarks' && (
            <div className="mt-5">
              <TagsInput
                placeHolder="Search remark/s"
                value={remarks}
                onChange={(value) => handleOnChangeRemarks(value)}
                classNames={{
                  input: "tag-input"
                }}
              />
            </div>
          )}
        </div>
      </div>
    </Dropdown>
  )
}
