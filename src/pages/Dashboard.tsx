import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  CreditCard, 
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { getExpenseSummaryRequest, getExpensesRequest } from "@/services/apiRequest";
import { ExpenseSummaryResponse, ExpensesResponse } from "@/types/apiResponse";
import { Expense } from "@/types/apiTypes";
import { toast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [summary, setSummary] = useState<ExpenseSummaryResponse['data'] | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load summary for current month
      const currentDate = new Date();
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const [summaryResponse, expensesResponse] = await Promise.all([
        getExpenseSummaryRequest({
          date_from: firstDay.toISOString().split('T')[0],
          date_to: lastDay.toISOString().split('T')[0],
        }),
        getExpensesRequest({ page: 1, per_page: 5 })
      ]);

      if (summaryResponse.success && summaryResponse.data) {
        setSummary(summaryResponse.data);
      }

      if (expensesResponse.success && expensesResponse.data) {
        setRecentExpenses(expensesResponse.data);
      }
    } catch (error: any) {
      toast({
        title: "Error loading dashboard",
        description: error.response?.data?.message || "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your financial activity this month
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover">
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-income/10 to-income/5 border-income/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-income">
              Total Income
            </CardTitle>
            <div className="p-2 bg-income/10 rounded-lg">
              <TrendingUp className="h-4 w-4 text-income" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-income">
              {formatCurrency(summary?.total_income || 0)}
            </div>
            <div className="flex items-center text-xs text-income/80 mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +2.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-expense/10 to-expense/5 border-expense/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-expense">
              Total Expenses
            </CardTitle>
            <div className="p-2 bg-expense/10 rounded-lg">
              <TrendingDown className="h-4 w-4 text-expense" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-expense">
              {formatCurrency(Math.abs(summary?.total_expenses || 0))}
            </div>
            <div className="flex items-center text-xs text-expense/80 mt-1">
              <ArrowDownRight className="w-3 h-3 mr-1" />
              +1.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Net Balance
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              (summary?.net_amount || 0) >= 0 ? 'text-income' : 'text-expense'
            }`}>
              {formatCurrency(summary?.net_amount || 0)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Current month balance
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Recent Transactions
            </CardTitle>
            <CardDescription>
              Your latest expense entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentExpenses.length > 0 ? (
              <div className="space-y-4">
                {recentExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        expense.expense_type?.category === 'Income' 
                          ? 'bg-income/10 text-income' 
                          : 'bg-expense/10 text-expense'
                      }`}>
                        <span className="text-lg">{expense.expense_type?.icon || '💰'}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{expense.expense_type?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(expense.date)} • {expense.payment_method}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        expense.expense_type?.category === 'Income' 
                          ? 'text-income' 
                          : 'text-expense'
                      }`}>
                        {expense.expense_type?.category === 'Income' ? '+' : '-'}
                        {formatCurrency(Math.abs(expense.amount))}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {expense.expense_type?.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent transactions</p>
                <p className="text-sm">Start by adding your first expense</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>
              Expenses by category this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            {summary?.category_breakdown && summary.category_breakdown.length > 0 ? (
              <div className="space-y-4">
                {summary.category_breakdown.slice(0, 5).map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary" style={{
                        backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                      }}></div>
                      <span className="text-sm font-medium">{category.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(category.amount)}</p>
                      <p className="text-xs text-muted-foreground">{category.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No category data available</p>
                <p className="text-sm">Add expenses to see breakdown</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}