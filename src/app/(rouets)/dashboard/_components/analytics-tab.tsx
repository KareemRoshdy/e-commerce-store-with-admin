"use client";

import axios from "@/lib/axios";
import { motion } from "framer-motion";
import {
  Loader,
  LucideIcon,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const AnalyticsTab = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dailySalesData, setDailySalesData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const res = await axios.get("/admin/analytics");

        setAnalyticsData(res.data.analyticsData);
        setDailySalesData(res.data.dailySalesData);
      } catch (error) {
        console.log("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader className="size-4 mr-2 animate-spin" />
        Loading...
      </div>
    );
  }

  const analyticsDataCarts = [
    {
      id: 1,
      title: "Total Users",
      value: analyticsData.users.toLocaleString(),
      icon: Users,
      color: "from-emerald-500 to-teal-700",
    },
    {
      id: 2,
      title: "Total Products",
      value: analyticsData.products.toLocaleString(),
      icon: Package,
      color: "from-emerald-500 to-green-700",
    },
    {
      id: 3,
      title: "Total Sales",
      value: analyticsData.totalSales.toLocaleString(),
      icon: ShoppingCart,
      color: "from-emerald-500 to-cyan-700",
    },
    {
      id: 4,
      title: "Total Revenue",
      value: `$${analyticsData.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "from-emerald-500 to-lime-700",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analyticsDataCarts.map((cart) => (
          <AnalyticsCard
            key={cart.id}
            title={cart.title}
            value={cart.value}
            icon={cart.icon}
            color={cart.color}
          />
        ))}
      </div>

      <motion.div
        className="bg-gray-800/60 rounded-lg p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#d1d5db" />
            <YAxis yAxisId="left" stroke="#d1d5db" />
            <YAxis yAxisId="right" orientation="right" stroke="#d1d5db" />
            <Tooltip />
            <Legend />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              stroke="#10b981"
              activeDot={{ r: 8 }}
              name="Sales"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              activeDot={{ r: 8 }}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default AnalyticsTab;

interface AnalyticsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

const AnalyticsCard = ({
  title,
  value,
  icon: Icon,
  color,
}: AnalyticsCardProps) => (
  <motion.div
    className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex justify-between items-center">
      <div className="z-10">
        <p className="text-emerald-300 text-sm mb-1 font-semibold">{title}</p>
        <h3 className="text-white text-3xl font-bold">{value}</h3>
      </div>
    </div>

    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30" />
    <div className="absolute -bottom-4 -right-4 text-emerald-800 opacity-50">
      <Icon className="h-32 w-32" />
    </div>
  </motion.div>
);