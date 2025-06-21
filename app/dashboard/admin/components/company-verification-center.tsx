"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Building2,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  X,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Plus,
} from "lucide-react"
import { CompanyRegistrationForm } from "./company-registration-form"
import { CompanyReviewModal } from "./company-review-modal"

// Mock company data
const mockCompanies = [
  {
    id: 1,
    companyName: "TechCorp Solutions",
    contactPerson: "John Smith",
    designation: "CEO",
    email: "john@techcorp.com",
    phone: "+1-555-0123",
    address: "123 Tech Street, Silicon Valley, CA 94000",
    city: "Silicon Valley",
    state: "CA",
    submittedDate: "2024-01-15",
    status: "pending",
    industry: "Technology",
    companySize: "51-200",
    documents: [
      { name: "Business License", type: "pdf", uploaded: true, required: true },
      { name: "Tax Certificate", type: "pdf", uploaded: true, required: true },
      { name: "Incorporation Documents", type: "pdf", uploaded: true, required: true },
      { name: "Financial Statements", type: "pdf", uploaded: false, required: false },
    ],
  },
  {
    id: 2,
    companyName: "InnovateLab Inc",
    contactPerson: "Sarah Johnson",
    designation: "Founder & CTO",
    email: "sarah@innovatelab.com",
    phone: "+1-555-0456",
    address: "456 Innovation Blvd, Austin, TX 78701",
    city: "Austin",
    state: "TX",
    submittedDate: "2024-01-18",
    status: "under_review",
    industry: "Healthcare",
    companySize: "11-50",
    documents: [
      { name: "Business License", type: "pdf", uploaded: true, required: true },
      { name: "Tax Certificate", type: "pdf", uploaded: true, required: true },
      { name: "Incorporation Documents", type: "pdf", uploaded: true, required: true },
      { name: "Financial Statements", type: "pdf", uploaded: true, required: false },
    ],
  },
  {
    id: 3,
    companyName: "Digital Dynamics",
    contactPerson: "Mike Chen",
    designation: "CTO",
    email: "mike@digitaldynamics.com",
    phone: "+1-555-0789",
    address: "789 Digital Ave, Seattle, WA 98101",
    city: "Seattle",
    state: "WA",
    submittedDate: "2024-01-20",
    status: "approved",
    industry: "Technology",
    companySize: "201-500",
    documents: [
      { name: "Business License", type: "pdf", uploaded: true, required: true },
      { name: "Tax Certificate", type: "pdf", uploaded: true, required: true },
      { name: "Incorporation Documents", type: "pdf", uploaded: true, required: true },
      { name: "Financial Statements", type: "pdf", uploaded: true, required: false },
    ],
  },
  {
    id: 4,
    companyName: "Green Energy Solutions",
    contactPerson: "Emma Davis",
    designation: "Managing Director",
    email: "emma@greenenergy.com",
    phone: "+1-555-0321",
    address: "321 Green St, Portland, OR 97201",
    city: "Portland",
    state: "OR",
    submittedDate: "2024-01-22",
    status: "pending",
    industry: "Energy",
    companySize: "11-50",
    documents: [
      { name: "Business License", type: "pdf", uploaded: true, required: true },
      { name: "Tax Certificate", type: "pdf", uploaded: false, required: true },
      { name: "Incorporation Documents", type: "pdf", uploaded: true, required: true },
      { name: "Financial Statements", type: "pdf", uploaded: false, required: false },
    ],
  },
  {
    id: 5,
    companyName: "FinTech Innovations",
    contactPerson: "Robert Wilson",
    designation: "CEO",
    email: "robert@fintech.com",
    phone: "+1-555-0654",
    address: "654 Finance Blvd, New York, NY 10001",
    city: "New York",
    state: "NY",
    submittedDate: "2024-01-25",
    status: "rejected",
    industry: "Finance",
    companySize: "501+",
    documents: [
      { name: "Business License", type: "pdf", uploaded: true, required: true },
      { name: "Tax Certificate", type: "pdf", uploaded: true, required: true },
      { name: "Incorporation Documents", type: "pdf", uploaded: false, required: true },
      { name: "Financial Statements", type: "pdf", uploaded: false, required: false },
    ],
  },
]

interface CompanyVerificationCenterProps {
  onBack: () => void
}

export function CompanyVerificationCenter({ onBack }: CompanyVerificationCenterProps) {
  const [companies, setCompanies] = useState(mockCompanies)
  const [activeTab, setActiveTab] = useState("pending")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("submittedDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)

  // Filter states
  const [filters, setFilters] = useState({
    industry: "",
    companySize: "",
    state: "",
    dateRange: "",
    documentStatus: "",
  })

  // Get unique values for filter options
  const industries = [...new Set(companies.map((c) => c.industry))].filter(Boolean)
  const companySizes = [...new Set(companies.map((c) => c.companySize))].filter(Boolean)
  const states = [...new Set(companies.map((c) => c.state))].filter(Boolean)

  // Filter and search logic
  const filteredCompanies = companies
    .filter((company) => {
      // Tab filter
      if (activeTab !== "all" && company.status !== activeTab) return false

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const matchesSearch =
          company.companyName.toLowerCase().includes(searchLower) ||
          company.contactPerson.toLowerCase().includes(searchLower) ||
          company.email.toLowerCase().includes(searchLower) ||
          company.phone.includes(searchTerm) ||
          company.address.toLowerCase().includes(searchLower)

        if (!matchesSearch) return false
      }

      // Apply other filters
      if (filters.industry && filters.industry !== "all_industries" && company.industry !== filters.industry)
        return false
      if (filters.companySize && filters.companySize !== "all_sizes" && company.companySize !== filters.companySize)
        return false
      if (filters.state && filters.state !== "all_states" && company.state !== filters.state) return false

      // Document status filter
      if (filters.documentStatus && filters.documentStatus !== "all_documents") {
        const requiredDocs = company.documents.filter((doc) => doc.required)
        const allRequiredUploaded = requiredDocs.every((doc) => doc.uploaded)
        const hasIncompleteRequired = requiredDocs.some((doc) => !doc.uploaded)

        if (filters.documentStatus === "complete" && !allRequiredUploaded) return false
        if (filters.documentStatus === "incomplete" && !hasIncompleteRequired) return false
      }

      // Date range filter
      if (filters.dateRange && filters.dateRange !== "all_time") {
        const submittedDate = new Date(company.submittedDate)
        const now = new Date()
        const daysAgo = Math.floor((now.getTime() - submittedDate.getTime()) / (1000 * 60 * 60 * 24))

        switch (filters.dateRange) {
          case "today":
            if (daysAgo > 0) return false
            break
          case "week":
            if (daysAgo > 7) return false
            break
          case "month":
            if (daysAgo > 30) return false
            break
        }
      }

      return true
    })
    .sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "companyName":
          aValue = a.companyName.toLowerCase()
          bValue = b.companyName.toLowerCase()
          break
        case "submittedDate":
          aValue = new Date(a.submittedDate)
          bValue = new Date(b.submittedDate)
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        default:
          aValue = a[sortBy]
          bValue = b[sortBy]
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const clearFilters = () => {
    setFilters({
      industry: "",
      companySize: "",
      state: "",
      dateRange: "",
      documentStatus: "",
    })
    setSearchTerm("")
  }

  const activeFiltersCount =
    Object.values(filters).filter(
      (value) =>
        value &&
        value !== "all_industries" &&
        value !== "all_sizes" &&
        value !== "all_states" &&
        value !== "all_time" &&
        value !== "all_documents",
    ).length + (searchTerm ? 1 : 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-[#f1c40f]/20 text-[#f1c40f] border-[#f1c40f]/30"
      case "under_review":
        return "bg-[#4a90e2]/20 text-[#4a90e2] border-[#4a90e2]/30"
      case "approved":
        return "bg-[#50c878]/20 text-[#50c878] border-[#50c878]/30"
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "under_review":
        return <Eye className="w-4 h-4" />
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const handleApprove = (companyId: number) => {
    setCompanies((prev) =>
      prev.map((company) => (company.id === companyId ? { ...company, status: "approved" as const } : company)),
    )
  }

  const handleReject = (companyId: number) => {
    setCompanies((prev) =>
      prev.map((company) => (company.id === companyId ? { ...company, status: "rejected" as const } : company)),
    )
  }

  const handleSetUnderReview = (companyId: number) => {
    setCompanies((prev) =>
      prev.map((company) => (company.id === companyId ? { ...company, status: "under_review" as const } : company)),
    )
  }

  return (
    <div className="min-h-screen bg-[#2e2e2e] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              className="bg-[#3a3a3a] border-[#ff6b35]/30 text-white hover:bg-[#ff6b35]/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Company Verification Center</h1>
              <p className="text-gray-400">Manage company onboarding and verification process</p>
            </div>
          </div>
          <Button onClick={() => setShowRegistrationForm(true)} className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add New Company
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <Card className="bg-[#3a3a3a] border border-[#ff6b35]/20 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search companies, contacts, email, phone, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#2e2e2e] border-[#ff6b35]/30 text-white"
                />
              </div>

              {/* Filter Toggle */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="bg-[#2e2e2e] border-[#ff6b35]/30 text-white hover:bg-[#ff6b35]/10"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-2 bg-[#ff6b35] text-white">{activeFiltersCount}</Badge>
                  )}
                </Button>

                {/* Sort Options */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 bg-[#2e2e2e] border-[#ff6b35]/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="submittedDate">Date Submitted</SelectItem>
                    <SelectItem value="companyName">Company Name</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  variant="outline"
                  className="bg-[#2e2e2e] border-[#ff6b35]/30 text-white hover:bg-[#ff6b35]/10"
                >
                  {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-[#ff6b35]/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <Label className="text-white text-sm">Industry</Label>
                    <Select
                      value={filters.industry}
                      onValueChange={(value) => setFilters({ ...filters, industry: value })}
                    >
                      <SelectTrigger className="bg-[#2e2e2e] border-[#ff6b35]/30 text-white">
                        <SelectValue placeholder="All Industries" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_industries">All Industries</SelectItem>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white text-sm">Company Size</Label>
                    <Select
                      value={filters.companySize}
                      onValueChange={(value) => setFilters({ ...filters, companySize: value })}
                    >
                      <SelectTrigger className="bg-[#2e2e2e] border-[#ff6b35]/30 text-white">
                        <SelectValue placeholder="All Sizes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_sizes">All Sizes</SelectItem>
                        {companySizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white text-sm">State</Label>
                    <Select value={filters.state} onValueChange={(value) => setFilters({ ...filters, state: value })}>
                      <SelectTrigger className="bg-[#2e2e2e] border-[#ff6b35]/30 text-white">
                        <SelectValue placeholder="All States" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_states">All States</SelectItem>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white text-sm">Date Range</Label>
                    <Select
                      value={filters.dateRange}
                      onValueChange={(value) => setFilters({ ...filters, dateRange: value })}
                    >
                      <SelectTrigger className="bg-[#2e2e2e] border-[#ff6b35]/30 text-white">
                        <SelectValue placeholder="All Time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_time">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">Last 7 Days</SelectItem>
                        <SelectItem value="month">Last 30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white text-sm">Documents</Label>
                    <Select
                      value={filters.documentStatus}
                      onValueChange={(value) => setFilters({ ...filters, documentStatus: value })}
                    >
                      <SelectTrigger className="bg-[#2e2e2e] border-[#ff6b35]/30 text-white">
                        <SelectValue placeholder="All Documents" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_documents">All Documents</SelectItem>
                        <SelectItem value="complete">Complete</SelectItem>
                        <SelectItem value="incomplete">Incomplete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {activeFiltersCount > 0 && (
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-gray-400 text-sm">
                      Showing {filteredCompanies.length} of {companies.length} companies
                    </p>
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      size="sm"
                      className="bg-[#2e2e2e] border-[#ff6b35]/30 text-white hover:bg-[#ff6b35]/10"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-transparent border-none p-0 space-x-2">
            <TabsTrigger
              value="pending"
              className="bg-[#ff6b35] text-white data-[state=inactive]:bg-[#3a3a3a] data-[state=inactive]:text-gray-300 border-none"
            >
              Pending ({companies.filter((c) => c.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger
              value="under_review"
              className="bg-[#ff6b35] text-white data-[state=inactive]:bg-[#3a3a3a] data-[state=inactive]:text-gray-300 border-none"
            >
              Under Review ({companies.filter((c) => c.status === "under_review").length})
            </TabsTrigger>
            <TabsTrigger
              value="approved"
              className="bg-[#ff6b35] text-white data-[state=inactive]:bg-[#3a3a3a] data-[state=inactive]:text-gray-300 border-none"
            >
              Approved ({companies.filter((c) => c.status === "approved").length})
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="bg-[#ff6b35] text-white data-[state=inactive]:bg-[#3a3a3a] data-[state=inactive]:text-gray-300 border-none"
            >
              Rejected ({companies.filter((c) => c.status === "rejected").length})
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="bg-[#ff6b35] text-white data-[state=inactive]:bg-[#3a3a3a] data-[state=inactive]:text-gray-300 border-none"
            >
              All ({companies.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredCompanies.length === 0 ? (
              <Card className="bg-[#3a3a3a] border border-[#ff6b35]/20">
                <CardContent className="p-8 text-center">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-medium mb-2">No companies found</h3>
                  <p className="text-gray-400">
                    {searchTerm || activeFiltersCount > 0
                      ? "Try adjusting your search or filters"
                      : "No companies match the current status"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <ScrollArea className="h-[600px]">
                <div className="grid gap-4 pr-4">
                  {filteredCompanies.map((company) => (
                    <Card key={company.id} className="bg-[#3a3a3a] border border-[#ff6b35]/20">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-[#4a90e2]/10">
                              <Building2 className="w-6 h-6 text-[#4a90e2]" />
                            </div>
                            <div>
                              <CardTitle className="text-white">{company.companyName}</CardTitle>
                              <CardDescription className="text-gray-400">
                                {company.industry} • {company.companySize} employees • Submitted on{" "}
                                {new Date(company.submittedDate).toLocaleDateString()}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={getStatusColor(company.status)}>
                            {getStatusIcon(company.status)}
                            <span className="ml-2 capitalize">{company.status.replace("_", " ")}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-300">
                              <User className="w-4 h-4" />
                              <span>
                                {company.contactPerson} - {company.designation}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                              <Mail className="w-4 h-4" />
                              <span>{company.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                              <Phone className="w-4 h-4" />
                              <span>{company.phone}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2 text-gray-300">
                              <MapPin className="w-4 h-4 mt-1" />
                              <span>{company.address}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-white font-medium mb-2">Documents Status</h4>
                          <div className="flex flex-wrap gap-2">
                            {company.documents.map((doc: any, index: number) => (
                              <Badge
                                key={index}
                                className={
                                  doc.uploaded
                                    ? "bg-[#50c878]/20 text-[#50c878] border-[#50c878]/30"
                                    : doc.required
                                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                                      : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                                }
                              >
                                <FileText className="w-3 h-3 mr-1" />
                                {doc.name}
                                {doc.required && !doc.uploaded && " *"}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => setSelectedCompany(company)}
                            className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Review Application
                          </Button>
                          {company.status === "pending" && (
                            <>
                              <Button
                                onClick={() => handleSetUnderReview(company.id)}
                                variant="outline"
                                className="bg-[#4a90e2]/20 border-[#4a90e2]/30 text-[#4a90e2] hover:bg-[#4a90e2]/10"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Start Review
                              </Button>
                              <Button
                                onClick={() => handleApprove(company.id)}
                                variant="outline"
                                className="bg-[#50c878]/20 border-[#50c878]/30 text-[#50c878] hover:bg-[#50c878]/10"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Quick Approve
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <CompanyRegistrationForm
          open={showRegistrationForm}
          onOpenChange={setShowRegistrationForm}
          onSubmit={(data) => {
            // Add new company to the list
            const newCompany = {
              id: companies.length + 1,
              ...data,
              submittedDate: new Date().toISOString().split("T")[0],
              status: "pending" as const,
            }
            setCompanies((prev) => [...prev, newCompany])
            setShowRegistrationForm(false)
          }}
        />

        <CompanyReviewModal
          company={selectedCompany}
          open={!!selectedCompany}
          onOpenChange={() => setSelectedCompany(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onSetUnderReview={handleSetUnderReview}
        />
      </div>
    </div>
  )
}
