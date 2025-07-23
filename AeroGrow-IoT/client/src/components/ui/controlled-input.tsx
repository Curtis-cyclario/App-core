import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ControlledInputProps extends Omit<React.ComponentProps<"input">, 'value' | 'onChange'> {
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

const ControlledInput = React.forwardRef<HTMLInputElement, ControlledInputProps>(
  ({ className, value, defaultValue, onChange, readOnly = false, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value?.toString() || defaultValue?.toString() || '');

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value.toString());
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      onChange?.(newValue);
    };

    if (readOnly || props.disabled) {
      return (
        <Input
          ref={ref}
          className={cn("cursor-not-allowed opacity-75", className)}
          value={value || defaultValue || ''}
          readOnly
          {...props}
        />
      );
    }

    return (
      <Input
        ref={ref}
        className={className}
        value={internalValue}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

ControlledInput.displayName = "ControlledInput";

export { ControlledInput };