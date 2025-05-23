import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { forwardRef } from "react";

export interface InputDateProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange?: (date: string) => void;
}

const InputDate = forwardRef<HTMLInputElement, InputDateProps>(
  ({ className, onChange, value, ...props }, ref) => {
    const [date, setDate] = React.useState<Date | undefined>(
      value ? new Date(value as string) : undefined
    );

    const handleSelect = (selectedDate: Date | undefined) => {
      setDate(selectedDate);
      if (onChange && selectedDate) {
        onChange(format(selectedDate, "yyyy-MM-dd"));
      }
    };

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
        <input
          type="hidden"
          ref={ref}
          value={date ? format(date, "yyyy-MM-dd") : ""}
          {...props}
        />
      </Popover>
    );
  }
);

InputDate.displayName = "InputDate";

export { InputDate }; 