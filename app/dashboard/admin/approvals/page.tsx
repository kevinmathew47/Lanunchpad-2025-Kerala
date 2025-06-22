"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Flag, ArrowLeft, Building2, Briefcase, Users } from "lucide-react"
import Link from "next/link"

type ApprovalItem = {
  id: string
  name: string
  type: "company" | "job_post" | "profile"
  status: "pending" | "approved" | "rejected" | "flagged"
  description: string
}

const mockApprovalItems: ApprovalItem[] = [
  // Companies
  {
    id: "comp1",
    name: "Tech Solutions Inc.",
    type: "company",
    status: "pending",
    description: "New company registration awaiting verification. Check business license and address.",
  },
  {
    id: "comp2",
    name: "Global Innovations Ltd.",
    type: "company",
    status: "approved",
    description: "Company profile approved. All documents verified.",
  },
  {
    id: "comp3",
    name: "Future Dynamics Corp.",
    type: "company",
    status: "flagged",
    description: "Company flagged for suspicious activity. Investigate further.",
  },
  // Job Posts
  {
    id: "job1",
    name: "Senior Software Engineer (React)",
    type: "job_post",
    status: "pending",
    description: "Job post for a senior engineer position. Review job description and salary range.",
  },
  {
    id: "job2",
    name: "Marketing Specialist (Digital)",
    type: "job_post",
    status: "rejected",
    description: "Job post rejected due to incomplete details and vague requirements.",
  },
  {
    id: "job3",
    name: "Data Scientist (AI/ML)",
    type: "job_post",
    status: "pending",
    description: "New job opening for a data scientist. Ensure compliance with posting guidelines.",
  },
  // Profiles
  {
    id: "prof1",
    name: "Alice Johnson (User Profile)",
    type: "profile",
    status: "pending",
    description: "New user profile awaiting initial review. Check for completeness and appropriate content.",
  },
  {
    id: "prof2",
    name: "Bob Williams (User Profile)",
    type: "profile",
    status: "flagged",
    description: "User profile flagged for suspicious activity. Contains inappropriate content.",
  },
  {
    id: "prof3",
    name: "Charlie Davis (User Profile)",
    type: "profile",
    status: "approved",
    description: "User profile approved. All information verified.",
  },
]

export default function ApprovalWorkflowPage() {
  const [items, setItems] = useState<ApprovalItem[]>(mockApprovalItems)
  const [activeTab, setActiveTab] = useState<ApprovalItem["type"]>("company")

  const updateItemStatus = (id: string, newStatus: ApprovalItem["status"]) => {
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, status: newStatus } : item)))
    // In a real application, you would make an API call here to update the backend:
    // fetch(`/api/approvals/${id}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status: newStatus }),
    // }).then(response => response.json()).then(data => console.log(data));
  }

  const getStatusBadgeVariant = (status: ApprovalItem["status"]) => {
    switch (status) {
      case "approved":
        return "default"
      case "rejected":
        return "destructive"
      case "flagged":
        return "secondary"
      case "pending":
      default:
        return "outline"
    }
  }

  const getStatusBadgeColor = (status: ApprovalItem["status"]) => {
    switch (status) {
      case "approved":
        return "bg-green-600 text-white"
      case "rejected":
        return "bg-red-600 text-white"
      case "flagged":
        return "bg-accent-orange text-white" // Use accent orange for flagged
      case "pending":
      default:
        return "bg-secondary-700 text-gray-300 border-gray-600" // Darker pending badge
    }
  }

  const getTabIcon = (type: ApprovalItem["type"]) => {
    switch (type) {
      case "company":
        return <Building2 className="w-4 h-4 mr-2" />
      case "job_post":
        return <Briefcase className="w-4 h-4 mr-2" />
      case "profile":
        return <Users className="w-4 h-4 mr-2" />
      default:
        return null
    }
  }

  const filteredItems = items.filter((item) => item.type === activeTab)

  return (
    <div className="min-h-screen bg-secondary-900 p-6">
      {" "}
      {/* Updated background */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard/admin" // Corrected link path to go back to the main admin dashboard
            className="flex items-center text-gray-400 hover:text-accent-orange transition-colors"
          >
            {" "}
            {/* Adjusted text color */}
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Approval Workflows</h1>
            <p className="text-gray-300">Manage companies, job posts, and user profiles.</p> {/* Adjusted text color */}
          </div>
        </div>

        <Tabs
          defaultValue="company"
          onValueChange={(value) => setActiveTab(value as ApprovalItem["type"])}
          className="space-y-4"
        >
          <TabsList className="bg-secondary-800/50 backdrop-blur-sm border border-accent-orange/20">
            {" "}
            {/* Updated colors */}
            <TabsTrigger
              value="company"
              className="text-gray-300 data-[state=active]:bg-accent-orange data-[state=active]:text-white"
            >
              {getTabIcon("company")} Companies
            </TabsTrigger>
            <TabsTrigger
              value="job_post"
              className="text-gray-300 data-[state=active]:bg-accent-orange data-[state=active]:text-white"
            >
              {getTabIcon("job_post")} Job Posts
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="text-gray-300 data-[state=active]:bg-accent-orange data-[state=active]:text-white"
            >
              {getTabIcon("profile")} Profiles
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <Card className="bg-secondary-800/50 backdrop-blur-md border border-accent-orange/20">
              {" "}
              {/* Updated colors */}
              <CardHeader>
                <CardTitle className="text-white">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace("_", " ")} Approvals
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Review and manage the status of {activeTab.replace("_", " ")} items.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="grid gap-4">
                    {filteredItems.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">
                        No {activeTab.replace("_", " ")} items to display.
                      </p>
                    ) : (
                      filteredItems.map((item) => (
                        <Card key={item.id} className="bg-secondary-700/50 border border-accent-orange/10 text-white">
                          {" "}
                          {/* Updated colors */}
                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-semibold text-white">{item.name}</CardTitle>
                            <Badge
                              variant={getStatusBadgeVariant(item.status)}
                              className={getStatusBadgeColor(item.status)}
                            >
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                          </CardHeader>
                          <CardContent className="pt-2">
                            <p className="text-gray-300 text-sm mb-4">{item.description}</p> {/* Adjusted text color */}
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateItemStatus(item.id, "approved")}
                                disabled={item.status === "approved"}
                                className="bg-green-600 hover:bg-green-700 text-white" // Kept green for approval
                              >
                                <CheckCircle className="w-4 h-4 mr-1" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => updateItemStatus(item.id, "rejected")}
                                disabled={item.status === "rejected"}
                                className="bg-red-600 hover:bg-red-700 text-white" // Kept red for rejection
                              >
                                <XCircle className="w-4 h-4 mr-1" /> Reject
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => updateItemStatus(item.id, "flagged")}
                                disabled={item.status === "flagged"}
                                className="bg-accent-orange hover:bg-orange-600 text-white" // Updated to accent orange for flagged
                              >
                                <Flag className="w-4 h-4 mr-1" /> Flag
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
