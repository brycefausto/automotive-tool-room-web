import { Checkbox, Dropdown, Label, Select } from 'flowbite-react'
import React, { useRef, useState } from 'react'

export const RemarksOptions = ['Not Returned', 'Lost', 'Damaged', 'Broken', 'Other'];

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

  const handleToggleCheck = (checked: boolean, remarksName: string) => {
    if (checked && !remarks.includes(remarksName)) {
      remarks.push(remarksName);
    } else if (!checked && remarks.includes(remarksName)) {
      remarks.splice(remarks.indexOf(remarksName), 1);
    }
    console.log({ remarks });
    setRemarks([...remarks]);
    onChangeRemarks(remarks);
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
              {RemarksOptions.map((remarkOption, i) => (
                <div key={i} className="my-2 flex items-center gap-2">
                  <Checkbox id={`chkBox${i}`} defaultChecked={remarks.includes(remarkOption)} onChange={(e) => handleToggleCheck(e.target.checked, remarkOption)} />
                  <Label htmlFor={`chkBox${i}`}>{remarkOption}</Label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Dropdown>
  )
}
