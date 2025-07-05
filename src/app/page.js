"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionList } from "../components/TransactionList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  PieChartIcon,
  BarChartIcon,
  AlertCircle,
  TrendingUp,
  Wallet,
  Calendar,
  CreditCard,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

// Custom color palette for charts
const COLORS = [
  "#14b8a6",
  "#0ea5e9",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#6366f1",
];

export default function HomePage() {
  const [txns, setTxns] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    description: "",
    date: "",
    category: "",
  });
  const [editTxn, setEditTxn] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("transactions");

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const res = await fetch("/api/transactions");
      if (!res.ok) throw new Error("Load failed");
      setTxns(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.amount || !form.description || !form.date || !form.category) {
      setError("All fields required");
      return;
    }
    setError(null);
    const method = editTxn ? "PUT" : "POST";
    const url = editTxn
      ? `/api/transactions/${editTxn._id}`
      : "/api/transactions";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: parseFloat(form.amount),
        description: form.description,
        date: form.date,
        category: form.category,
      }),
    });
    setForm({ amount: "", description: "", date: "", category: "" });
    setEditTxn(null);
    fetchAll();
  }

  function onEdit(txn) {
    setForm({
      amount: txn.amount.toString(),
      description: txn.description,
      date: format(new Date(txn.date), "yyyy-MM-dd"),
      category: txn.category,
    });
    setEditTxn(txn);
    setSelectedTab("add");
  }

  async function onDelete(id) {
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    setTxns((prev) => prev.filter((t) => t._id !== id));
    if (editTxn?._id === id) {
      setEditTxn(null);
      setForm({ amount: "", description: "", date: "", category: "" });
    }
  }

  const monthly = txns.reduce((acc, t) => {
    const m = format(new Date(t.date), "MMM yyyy");
    acc[m] = (acc[m] || 0) + t.amount;
    return acc;
  }, {});
  const monthData = Object.entries(monthly).map(([month, amount]) => ({
    month,
    amount,
  }));

  const categories = txns.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});
  const pieData = Object.entries(categories).map(([name, value]) => ({
    name,
    value,
  }));

  const totalExpenses = txns.reduce((sum, t) => sum + t.amount, 0);
  const latestTransactions = txns.slice(0, 3);

  // Month‑over‑month
  const currentMonth = format(new Date(), "MMM yyyy");
  const currentTotal = monthly[currentMonth] || 0;
  const prev = new Date();
  prev.setMonth(prev.getMonth() - 1);
  const prevMonth = format(prev, "MMM yyyy");
  const prevTotal = monthly[prevMonth] || 0;
  const monthlyChange = prevTotal
    ? ((currentTotal - prevTotal) / prevTotal) * 100
    : 0;

  return (
    <div className="w-full p-6 space-y-8 bg-[#0f172a] min-h-screen text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col space-y-2"
      >
        <h1 className="text-3xl font-bold flex items-center">
          <Wallet className="mr-2 h-8 w-8 text-blue-400" />
          Personal Finance Dashboard
        </h1>
        <p className="text-slate-400">
          Track and manage your expenses with ease
        </p>
      </motion.div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -5 }} className="md:col-span-3">
          <Card className="bg-[#1e293b] border-[#334155] shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600/20 to-blue-500/10 border-b border-[#334155]">
              <CardTitle className="flex items-center text-white">
                <TrendingUp className="mr-2 h-5 w-5 text-blue-400" />
                Financial Overview
              </CardTitle>
              <CardDescription className="text-slate-400">
                Your spending at a glance
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
              {/* Total */}
              <div className="flex flex-col items-center justify-center p-6 bg-[#1e293b] rounded-lg border border-[#334155] shadow-sm">
                <p className="text-sm text-slate-400 mb-2 flex items-center">
                  <CreditCard className="h-4 w-4 mr-1 text-blue-400" />
                  Total Expenses
                </p>
                <div className="flex items-center">
                  <ArrowDownCircle className="h-5 w-5 mr-2 text-orange-400" />
                  <p className="text-3xl font-bold text-white">
                    ${totalExpenses.toFixed(2)}
                  </p>
                </div>
                {monthlyChange !== 0 && (
                  <div
                    className={`mt-2 text-xs font-medium px-2 py-1 rounded-full flex items-center ${
                      monthlyChange > 0
                        ? "bg-rose-800 text-rose-300"
                        : "bg-emerald-800 text-emerald-300"
                    }`}
                  >
                    {monthlyChange > 0 ? (
                      <ArrowUpCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownCircle className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(monthlyChange).toFixed(1)}% from last month
                  </div>
                )}
              </div>

              {/* Pie */}
              <div className="bg-[#1e293b] rounded-lg border border-[#334155] p-4 shadow-sm">
                <p className="text-sm text-slate-400 mb-2 text-center flex items-center justify-center">
                  <PieChartIcon className="h-4 w-4 mr-1 text-blue-400" />
                  Spending by Category
                </p>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={50}
                      labelLine={false}
                      fill="#3b82f6"
                      animationDuration={1000}
                    >
                      {pieData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => `₹${v.toFixed(2)}`}
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "6px",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.3)",
                        color: "#e2e8f0",
                      }}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ fontSize: "10px", color: "#94a3b8" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Recent */}
              <div className="bg-[#1e293b] rounded-lg border border-[#334155] p-4 shadow-sm">
                <h3 className="text-sm text-slate-400 mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-blue-400" />
                  Recent Transactions
                </h3>
                {latestTransactions.length > 0 ? (
                  <ul className="space-y-3">
                    {latestTransactions.map((t) => (
                      <li
                        key={t._id}
                        className="flex justify-between items-center text-sm border-b pb-2 border-[#334155] last:border-0 hover:bg-[#334155]/50 p-1 rounded transition-colors"
                      >
                        <span className="font-medium text-slate-200 truncate max-w-[150px]">
                          {t.description}
                        </span>
                        <span className="font-semibold text-white">
                          ${t.amount.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400 italic">
                    No recent transactions
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-6 bg-[#1e293b] p-1 border border-[#334155]">
          <TabsTrigger
            value="transactions"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger
            value="add"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"
          >
            Add Transaction
          </TabsTrigger>
          <TabsTrigger
            value="charts"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"
          >
            Charts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="bg-[#1e293b] border-[#334155] shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600/20 to-blue-500/10 border-b border-[#334155]">
              <CardTitle className="flex items-center text-white">
                <ArrowUpCircle className="h-5 w-5 mr-2 text-blue-400" />
                Transaction History
              </CardTitle>
              <CardDescription className="text-slate-400">
                View and manage your transaction records
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
                </div>
              ) : (
                <TransactionList
                  transactions={txns}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          {/* show form validation here */}
          {error && (
            <Alert
              variant="destructive"
              className="border-rose-800 bg-rose-950/50 text-rose-300"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className="shadow-lg border-[#334155] bg-[#1e293b] overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600/20 to-blue-500/10 border-b border-[#334155]">
              <CardTitle className="text-white">
                {editTxn ? "Edit Transaction" : "Add New Transaction"}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {editTxn
                  ? "Update the details of your transaction"
                  : "Record a new expense in your finance tracker"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <TransactionForm
                form={form}
                isEditing={!!editTxn}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <Card className="bg-[#1e293b] border-[#334155] shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600/20 to-blue-500/10 border-b border-[#334155]">
              <CardTitle className="flex items-center text-white">
                <BarChartIcon className="h-5 w-5 mr-2 text-blue-400" />
                Monthly Expense Trends
              </CardTitle>
              <CardDescription className="text-slate-400">
                Track your spending patterns over time
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-2">
              {monthData.length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-[#1e293b]/50 rounded-lg border border-dashed border-[#334155]">
                  <PieChartIcon className="h-12 w-12 mx-auto mb-4 text-blue-400/30" />
                  <p className="font-medium">
                    No data available to display charts.
                  </p>
                  <p className="text-sm mt-1">
                    Add some transactions to see your spending trends.
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                      data={monthData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                    >
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                        tickFormatter={(v) => `$${v}`}
                      />
                      <Tooltip
                        formatter={(v) => [`$${v.toFixed(2)}`, "Amount"]}
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "6px",
                          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.3)",
                          color: "#e2e8f0",
                        }}
                        cursor={{ fill: "rgba(59,130,246,0.1)" }}
                      />
                      <Bar
                        dataKey="amount"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                        animationDuration={1500}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
