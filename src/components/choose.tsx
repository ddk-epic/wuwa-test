import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

interface ChooseProps<T> {
  label: string
  array: T[]
  value: string
  getValue?: (item: T) => string
  getLabel?: (item: T) => string
  onSelect: (value: string) => void
}

function Choose<T>({ label, array, value, getValue, getLabel, onSelect }: ChooseProps<T>) {
  const setValue = (item: T) =>
    getValue ? getValue(item) : (item as unknown as string)

  const setLabel = (item: T) =>
    getLabel ? getLabel(item) : (item as unknown as string)

  return (
    <div className="flex">
      <Select value={value} onValueChange={(value) => onSelect?.(value)}>
        <SelectTrigger className="w-20 flex-1">
          <SelectValue placeholder={label}>{value}</SelectValue>
        </SelectTrigger>

        <SelectContent position="popper">
          {array.map((item) => (
            <SelectItem key={setValue(item)} value={setValue(item)}>
              {setLabel(item)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default Choose
