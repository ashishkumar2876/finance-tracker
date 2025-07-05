"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, CheckCircle2, CircleDollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const categories = [
  { value: "Food", icon: "🍔" },
  { value: "Transport", icon: "🚗" },
  { value: "Utilities", icon: "💡" },
  { value: "Shopping", icon: "🛍️" },
  { value: "Entertainment", icon: "🎬" },
  { value: "Health", icon: "🏥" },
  { value: "Other", icon: "📦" },
]

export function TransactionForm({ form, isEditing, onChange, onSubmit }) {
  const [date, setDate] = useState(
    form.date ? new Date(form.date) : undefined
  )

  const handleDateChange = (newDate) => {
    setDate(newDate)
    onChange({
      target: { name: "date", value: format(newDate, "yyyy-MM-dd") },
    })
  }

  const handleCategoryChange = (value) => {
    onChange({ target: { name: "category", value } })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-slate-300">
              Amount ($)
            </Label>
            <div className="relative">
              <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={onChange}
                className="pl-10 bg-[#1e293b] border-[#334155] text-white focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-slate-300">
              Description
            </Label>
            <Input
              id="description"
              name="description"
              placeholder="What was this expense for?"
              value={form.description}
              onChange={onChange}
              className="bg-[#1e293b]  text-white focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium text-slate-300">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal text-white bg-[#1e293b] border-[#334155] hover:bg-[#334155] hover:text-blue-400 hover:border-blue-600 transition-all duration-200",
                    !date && "text-slate-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-blue-400" />
                  {date ? format(date, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-[#334155] bg-[#1e293b] shadow-lg shadow-black/20">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  initialFocus
                  className="rounded-md bg-[#1e293b] text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-slate-300">
              Category
            </Label>
            <Select value={form.category} onValueChange={handleCategoryChange}>
              <SelectTrigger
                id="category"
                className="bg-[#1e293b] border-[#334155] text-white focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="border-[#334155] bg-[#1e293b] text-white shadow-lg shadow-black/20">
                {categories.map((cat) => (
                  <SelectItem
                    key={cat.value}
                    value={cat.value}
                    className="hover:bg-[#334155] focus:bg-[#334155] transition-colors duration-150 text-white"
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{cat.icon}</span>
                      {cat.value}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
          <Button
            type="submit"
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {isEditing ? "Update Transaction" : "Add Transaction"}
          </Button>
        </motion.div>
      </form>
    </motion.div>
)}
