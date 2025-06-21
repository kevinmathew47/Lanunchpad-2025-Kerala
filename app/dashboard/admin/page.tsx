"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Users, Briefcase, FileText, LogOut, Activity } from "lucide-react"
import { CompanyVerificationCenter } from "@/components/company-verification-center"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for demonstration
const mockStats = {
  totalUsers: 1247,
  totalCompanies: 89,
  totalJobOffers: 156,
  totalTasks: 234,
  pendingCompanyVerifications: 12,
  pendingJobOffers: 23,
  pendingTasks: 18,
}

export default function AdminDashboard() {
  const [showVerificationCenter, setShowVerificationCenter] = useState(false)
  const [userEmail] = useState("admin@gmail.com")
  const [activeTab, setActiveTab] = useState("overview")

  const handleLogout = () => {
    console.log("Logging out...")
  }

  if (showVerificationCenter) {
    return <CompanyVerificationCenter onBack={() => setShowVerificationCenter(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2e2e2e] via-[#2a2a2a] to-[#1e1e1e] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Welcome back, {userEmail}</p>
          </div>
          <Button
            onClick={handleLogout}
            className="hover:bg-gray-100 border-none rounded-lg px-4 py-2 bg-orange-600 text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-transparent border-none p-0 space-x-2">
            <TabsTrigger
              value="overview"
              className="bg-[#ff6b35] text-white data-[state=inactive]:bg-[#3a3a3a] data-[state=inactive]:text-gray-300 border-none px-6 py-2 rounded-lg bg-orange-500"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="bg-[#ff6b35] text-white data-[state=inactive]:bg-[#3a3a3a] data-[state=inactive]:text-gray-300 border-none px-6 py-2 rounded-lg"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <StatCard
                title="Total Users"
                value={mockStats.totalUsers}
                icon={<Users className="h-5 w-5 text-[#ff6b35]" />}
                bgColor="bg-[#4a3429]"
              />
              <StatCard
                title="Total Companies"
                value={mockStats.totalCompanies}
                icon={<Building2 className="h-5 w-5 text-[#4a90e2]" />}
                bgColor="bg-[#2a3a4a]"
              />
              <StatCard
                title="Total Job Offers"
                value={mockStats.totalJobOffers}
                icon={<Briefcase className="h-5 w-5 text-[#50c878]" />}
                bgColor="bg-[#2a4a3a]"
              />
              <StatCard
                title="Total Tasks"
                value={mockStats.totalTasks}
                icon={<FileText className="h-5 w-5 text-[#9b59b6]" />}
                bgColor="bg-[#3a2a4a]"
              />
            </div>

            {/* Pending Items */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
              <PendingCard
                title="Pending Company Verifications"
                value={mockStats.pendingCompanyVerifications}
                description="Companies awaiting verification"
                onClick={() => setShowVerificationCenter(true)}
                numberColor="text-[#f1c40f]"
              />
              <PendingCard
                title="Pending Job Offers"
                value={mockStats.pendingJobOffers}
                description="Job offers awaiting approval"
                numberColor="text-[#4a90e2]"
              />
              <PendingCard
                title="Pending Tasks"
                value={mockStats.pendingTasks}
                description="Tasks awaiting approval"
                numberColor="text-[#50c878]"
              />
            </div>

            {/* Quick Actions */}
            <Card className="bg-[#3a3a3a] border border-[#ff6b35]/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-gray-400">Manage platform operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Button className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button
                    onClick={() => setShowVerificationCenter(true)}
                    className="bg-[#4a90e2] hover:bg-[#357abd] text-white"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Verify Companies
                  </Button>
                  <Button className="bg-[#50c878] hover:bg-[#45b369] text-white">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Review Job Offers
                  </Button>
                  <Button className="bg-[#9b59b6] hover:bg-[#8e44ad] text-white">
                    <FileText className="w-4 h-4 mr-2" />
                    Approve Tasks
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="bg-[#3a3a3a] border border-[#ff6b35]/20">
              <CardHeader>
                <CardTitle className="text-white">Advanced Analytics</CardTitle>
                <CardDescription className="text-gray-400">
                  Coming soon - Advanced analytics and reporting
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-[#ff6b35] mx-auto mb-4" />
                  <p className="text-gray-400">Advanced analytics will be available in a future update</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  bgColor = "bg-[#3a3a3a]",
}: {
  title: string
  value: number
  icon: React.ReactNode
  bgColor?: string
}) {
  return (
    <Card
      className={`${bgColor} border border-[#ff6b35]/20 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 ease-in-out`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white">{title}</CardTitle>
        <div className="rounded-full p-2">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  )
}

function PendingCard({
  title,
  value,
  description,
  onClick,
  numberColor = "text-[#ff6b35]",
}: {
  title: string
  value: number
  description: string
  onClick?: () => void
  numberColor?: string
}) {
  return (
    <Card
      className={`bg-[#3a3a3a] border border-[#ff6b35]/20 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 ease-in-out ${onClick ? "cursor-pointer hover:border-[#ff6b35]/40" : ""}`}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-sm font-medium text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${numberColor}`}>{value.toLocaleString()}</div>
        <p className="text-xs text-gray-400 mt-2">{description}</p>
      </CardContent>
    </Card>
  )
}
