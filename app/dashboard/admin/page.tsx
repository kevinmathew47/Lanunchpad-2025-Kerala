"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Building2, Clock, FileCheck, FileText, Users, Briefcase, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock data for demonstration
const mockStats = {
  totalUsers: 1247,
  totalCompanies: 89,
  totalJobOffers: 156,
  totalTasks: 234,
  totalHireRequests: 67,
  pendingCompanyVerifications: 12,
  pendingJobOffers: 23,
  pendingTasks: 18,
}

export default function AdminDashboard() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    const email = localStorage.getItem("userEmail")

    if (role !== "admin") {
      router.push("/login")
      return
    }

    setUserEmail(email || "")
  }, [router])

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")

    // Force a page reload to clear any cached state
    window.location.href = "/login"
  }

  const stats = mockStats

  return (
    <div className="min-h-screen bg-secondary-900 p-6">
      {" "}
      {/* Updated background */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Admin Dashboard</h1>
            <p className="text-gray-300">Welcome back, {userEmail}</p> {/* Adjusted text color */}
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-accent-orange/30 text-accent-orange hover:bg-accent-orange/10 hover:text-white" // Updated button style
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-secondary-800/50 backdrop-blur-sm border border-accent-orange/20">
            {" "}
            {/* Updated colors */}
            <TabsTrigger
              value="overview"
              className="text-gray-300 data-[state=active]:bg-accent-orange data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="text-gray-300 data-[state=active]:bg-accent-orange data-[state=active]:text-white"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon={<Users className="h-5 w-5 text-accent-orange" />} // Icon color
                color="bg-secondary-800/50 border border-accent-orange/20" // Card background
                valueColor="text-accent-orange" // Value color
              />
              <StatCard
                title="Total Companies"
                value={stats.totalCompanies}
                icon={<Building2 className="h-5 w-5 text-accent-orange" />}
                color="bg-secondary-800/50 border border-accent-orange/20"
                valueColor="text-accent-orange"
              />
              <StatCard
                title="Total Job Offers"
                value={stats.totalJobOffers}
                icon={<Briefcase className="h-5 w-5 text-accent-orange" />}
                color="bg-secondary-800/50 border border-accent-orange/20"
                valueColor="text-accent-orange"
              />
              <StatCard
                title="Total Tasks"
                value={stats.totalTasks}
                icon={<FileText className="h-5 w-5 text-accent-orange" />}
                color="bg-secondary-800/50 border border-accent-orange/20"
                valueColor="text-accent-orange"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <PendingCard
                title="Pending Company Verifications"
                value={stats.pendingCompanyVerifications}
                icon={<Clock className="h-5 w-5 text-accent-orange" />} // Icon color
                color="bg-secondary-800/50 border border-accent-orange/20" // Card background
                valueColor="text-accent-orange" // Value color
                description="Companies awaiting verification"
              />
              <PendingCard
                title="Pending Job Offers"
                value={stats.pendingJobOffers}
                icon={<Briefcase className="h-5 w-5 text-accent-orange" />}
                color="bg-secondary-800/50 border border-accent-orange/20"
                valueColor="text-accent-orange"
                description="Job offers awaiting approval"
              />
              <PendingCard
                title="Pending Tasks"
                value={stats.pendingTasks}
                icon={<FileCheck className="h-5 w-5 text-accent-orange" />}
                color="bg-secondary-800/50 border border-accent-orange/20"
                valueColor="text-accent-orange"
                description="Tasks awaiting approval"
              />
            </div>

            {/* Quick Actions */}
            <Card className="bg-secondary-800/50 backdrop-blur-md border border-accent-orange/20">
              {" "}
              {/* Updated colors */}
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-gray-300">Manage platform operations</CardDescription>{" "}
                {/* Adjusted text color */}
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Button className="bg-accent-orange hover:bg-orange-600 text-white">
                    {" "}
                    {/* Updated button style */}
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button className="bg-accent-orange hover:bg-orange-600 text-white">
                    <Building2 className="w-4 h-4 mr-2" />
                    Verify Companies
                  </Button>
                  <Button className="bg-accent-orange hover:bg-orange-600 text-white">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Review Job Offers
                  </Button>
                  {/* This button now links to the new consolidated approvals page */}
                  <Link
                    href="/dashboard/admin/approvals"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-accent-orange hover:bg-orange-600 text-white" // Updated button style
                  >
                    <FileCheck className="w-4 h-4 mr-2" />
                    Manage Approvals
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="bg-secondary-800/50 backdrop-blur-md border border-accent-orange/20">
              {" "}
              {/* Updated colors */}
              <CardHeader>
                <CardTitle className="text-white">Advanced Analytics</CardTitle>
                <CardDescription className="text-gray-300">
                  Coming soon - Advanced analytics and reporting
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-accent-orange mx-auto mb-4" /> {/* Icon color */}
                  <p className="text-gray-300">Advanced analytics will be available in a future update</p>{" "}
                  {/* Adjusted text color */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Updated StatCard to accept valueColor prop
function StatCard({
  title,
  value,
  icon,
  color,
  valueColor,
}: { title: string; value: number; icon: React.ReactNode; color: string; valueColor: string }) {
  return (
    <Card className={`${color} shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle> {/* Adjusted text color */}
        <div className="rounded-full p-2">{icon}</div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className={`text-3xl font-bold ${valueColor}`}>{value.toLocaleString()}</div> {/* Applied valueColor */}
      </CardContent>
    </Card>
  )
}

// Updated PendingCard to accept valueColor prop
function PendingCard({
  title,
  value,
  icon,
  color,
  description,
  valueColor,
}: {
  title: string
  value: number
  icon: React.ReactNode
  color: string
  description: string
  valueColor: string
}) {
  return (
    <Card className={`${color} shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle> {/* Adjusted text color */}
        <div className={`rounded-full p-2`}>{icon}</div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className={`text-3xl font-bold ${valueColor}`}>{value.toLocaleString()}</div> {/* Applied valueColor */}
        <p className="text-xs text-gray-400 mt-2">{description}</p>
      </CardContent>
    </Card>
  )
}
