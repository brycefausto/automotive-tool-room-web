import { TextInput, TextInputProps } from 'flowbite-react'
import { Control, UseControllerProps, useController } from 'react-hook-form'

type FormInputProps = TextInputProps & UseControllerProps<any> & { control: Control<any> }

export default function FormInput({ name, control, defaultValue, ...props }: FormInputProps) {
  const { field } = useController({
    control,
    defaultValue: defaultValue || '',
    name,
  })
  
  return (
    <TextInput
      value={field.value}
      onChange={field.onChange}
      {...props}
    />
  )
}
