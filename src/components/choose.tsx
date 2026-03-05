import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

interface ChooseProps {
  label: string
  array: string[]
}

function Choose({ label, array }: ChooseProps) {
  return (
    <div className="flex">
      <Select>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder={label}>{label}</SelectValue>
          <SelectContent>
            {array.map((item) => (
              <SelectItem value="test">{item}</SelectItem>
            ))}
          </SelectContent>
        </SelectTrigger>
      </Select>
    </div>
  )
}

export default Choose
