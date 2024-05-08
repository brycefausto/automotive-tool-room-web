import { Select, SelectProps } from 'flowbite-react'
import { Control, UseControllerProps, useController } from 'react-hook-form'

type FormInputProps = SelectProps & UseControllerProps<any> & { control: Control<any> }

export default function FormInput({ id, name, control, defaultValue, children, ...props }: FormInputProps) {
  const { field } = useController({
    control,
    defaultValue: defaultValue || '',
    name,
  })

  return (
    <Select id={id} required value={field.value} onChange={field.onChange} {...props}>
      {children}
    </Select>
  )
}
