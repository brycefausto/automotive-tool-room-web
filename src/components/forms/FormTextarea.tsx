import { Textarea, TextareaProps } from 'flowbite-react'
import { Control, UseControllerProps, useController } from 'react-hook-form'

type FormInputProps = TextareaProps & UseControllerProps<any> & { control: Control<any> }

export default function FormTextarea({ name, control, defaultValue, ...props }: FormInputProps) {
  const { field } = useController({
    control,
    defaultValue: defaultValue || '',
    name,
  })

  return (
    <Textarea
      value={field.value}
      onChange={field.onChange}
      {...props}
    />
  )
}
