import { INPUT_BORDER_RADIUS } from '@/design/common/constants'
import { Divider, HStack } from '@/design/layout'
import { Label } from '@/design/text'
import { Fragment } from 'react'
import { TouchableOpacity } from 'react-native'

export default function SelectTabs({
  data,
  value: selected,
  onSelect,
  multiple,
}: SelectTabsProps) {
  return (
    <HStack
      bg='bgAlt'
      height={45}
      flexGrow={1}
      borderRadius={INPUT_BORDER_RADIUS}
      borderWidth={1}
      borderColor='bgMuted'
      overflow='hidden'
    >
      {data.map((item, i) => {
        const value = item.value ?? item.label
        let isSelected = false

        if (multiple) {
          isSelected = selected.some(({ label, value: innerValue }) => {
            const selectedValue = innerValue ?? label
            return selectedValue === value
          })
        } else {
          isSelected = selected.value === value
        }
        return (
          <Fragment key={value}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                if (multiple) {
                  onSelect(
                    item,
                    !selected.some(({ label, value: innerValue }) => {
                      const selectedValue = innerValue ?? label
                      return selectedValue === value
                    }),
                  )
                } else {
                  const selectedValue = selected.value ?? selected.label
                  onSelect(item, selectedValue !== value)
                }
              }}
            >
              <HStack
                bg={isSelected ? 'primary' : undefined}
                justifyContent='center'
                alignItems='center'
                flexGrow={1}
              >
                <Label color={isSelected ? 'bg' : undefined}>
                  {item.label}
                </Label>
              </HStack>
            </TouchableOpacity>
            {i < data.length - 1 && <Divider direction='vertical' />}
          </Fragment>
        )
      })}
    </HStack>
  )
}
type BaseProps = {
  data: TabsValue[]
  onSelect: (selected: TabsValue, isSelected: boolean) => void
}

type UnionProps =
  | {
      value: TabsValue[]
      multiple: true
    }
  | {
      value: TabsValue
      multiple?: false | undefined
    }
type SelectTabsProps = BaseProps & UnionProps

export type TabsValue = {
  label: string
  value?: string | number
}
