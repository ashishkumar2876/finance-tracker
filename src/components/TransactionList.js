"use client"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, ArrowDown } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { motion, AnimatePresence } from "framer-motion"

// Category icons mapping
const categoryIcons = {
  Food: "🍔",
  Transport: "🚗",
  Utilities: "💡",
  Shopping: "🛍️",
  Entertainment: "🎬",
  Health: "🏥",
  Other: "📦",
}

// Category colors mapping
const categoryColors = {
  Food: "bg-amber-900/30 text-amber-300 border-amber-800",
  Transport: "bg-sky-900/30 text-sky-300 border-sky-800",
  Utilities: "bg-indigo-900/30 text-indigo-300 border-indigo-800",
  Shopping: "bg-pink-900/30 text-pink-300 border-pink-800",
  Entertainment: "bg-purple-900/30 text-purple-300 border-purple-800",
  Health: "bg-emerald-900/30 text-emerald-300 border-emerald-800",
  Other: "bg-slate-900/30 text-slate-300 border-slate-800",
}

export function TransactionList({ transactions, onEdit, onDelete }) {
  if (!transactions.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12 border border-dashed rounded-lg bg-[#1e293b]/50 border-[#334155]"
      >
        <ArrowDown className="h-12 w-12 mx-auto mb-4 text-blue-400" />
        <p className="text-slate-300 font-medium">No transactions found.</p>
        <p className="text-sm text-slate-400 mt-1">
          Add your first expense to get started.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-md border border-[#334155] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-[#1e293b]"
    >
      <Table>
        <TableHeader className="bg-[#0f172a]">
          <TableRow className="border-[#334155]">
            <TableHead className="text-slate-300">Description</TableHead>
            <TableHead className="text-slate-300">Category</TableHead>
            <TableHead className="text-slate-300">Date</TableHead>
            <TableHead className="text-right text-slate-300">Amount</TableHead>
            <TableHead className="text-right text-slate-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {transactions.map((txn) => (
              <motion.tr
                key={txn._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="hover:bg-[#334155]/50 group border-b border-[#334155] last:border-0"
              >
                <TableCell className="font-medium text-slate-200">
                  {txn.description}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`flex items-center w-fit gap-1 px-2 ${
                      categoryColors[txn.category] ||
                      "bg-slate-900/30 text-slate-300 border-slate-800"
                    }`}
                  >
                    <span>{categoryIcons[txn.category] || "📦"}</span>
                    {txn.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-400 text-sm">
                  {format(new Date(txn.date), "dd MMM yyyy")}
                </TableCell>
                <TableCell className="text-right font-semibold text-slate-200">
                  ${txn.amount.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(txn)}
                        className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-[#334155]"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(txn._id)}
                        className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-[#334155]"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </motion.div>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </motion.div>
  )
}
