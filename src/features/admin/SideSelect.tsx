import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { GUEST_SIDE_LABELS, GUEST_SIDES, isGuestSide, type GuestSide } from '@/lib/sides'
import { cn } from '@/lib/utils'

interface SideSelectProps {
  value: GuestSide
  onChange: (side: GuestSide) => void
  ariaLabel: string
  disabled?: boolean
  className?: string
}

export function SideSelect({ value, onChange, ariaLabel, disabled, className }: SideSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => isGuestSide(next) && onChange(next)}
      disabled={disabled}
    >
      <SelectTrigger aria-label={ariaLabel} className={cn('w-32 bg-cream/80', className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {GUEST_SIDES.map((side) => (
          <SelectItem key={side} value={side}>
            {GUEST_SIDE_LABELS[side]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
