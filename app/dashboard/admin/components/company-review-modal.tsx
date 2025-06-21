"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Building2,
  FileText,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  MapPin,
  Calendar,
} from "lucide-react"

interface CompanyReviewModalProps {
  company: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (companyId: number) => void
  onReject: (companyId: number) => void
  onSetUnderReview: (companyId: number) => void
}

export function CompanyReviewModal({
  company,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onSetUnderReview,
}: CompanyReviewModalProps) {
  const [comments, setComments] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")

  if (!company) return null

  const handleApprove = () => {
    onApprove(company.id)
    onOpenChange(false)
    setComments("")
  }

  const handleReject = () => {
    onReject(company.id)
    onOpenChange(false)
    setComments("")
    setRejectionReason("")
  }

  const handleSetUnderReview = () => {
    onSetUnderReview(company.id)
    onOpenChange(false)
    setComments("")
  }

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

  const requiredDocsComplete = company.documents.filter((doc: any) => doc.required).every((doc: any) => doc.uploaded)
  const totalDocs = company.documents.length
  const uploadedDocs = company.documents.filter((doc: any) => doc.uploaded).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-[#3a3a3a] border border-[#ff6b35]/20">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-white flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {company.companyName} - Verification Review
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Review company application and make approval decision
              </DialogDescription>
            </div>
            <Badge className={getStatusColor(company.status)}>
              {getStatusIcon(company.status)}
              <span className="ml-2 capitalize">{company.status.replace("_", " ")}</span>
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[600px] pr-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Company Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="bg-[#2e2e2e] border border-[#ff6b35]/20">
                <CardHeader>
                  <CardTitle className="text-white">Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Company Name</p>
                        <p className="text-white font-medium">{company.companyName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Industry</p>
                        <p className="text-white font-medium">{company.industry}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Company Size</p>
                        <p className="text-white font-medium">{company.companySize} employees</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Submitted Date</p>
                        <div className="flex items-center gap-2 text-white">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(company.submittedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Documents Status</p>
                        <p className="text-white font-medium">
                          {uploadedDocs}/{totalDocs} uploaded
                          {requiredDocsComplete ? (
                            <span className="text-[#50c878] ml-2">✓ All required docs complete</span>
                          ) : (
                            <span className="text-red-400 ml-2">⚠ Missing required documents</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="bg-[#2e2e2e] border border-[#ff6b35]/20">
                <CardHeader>
                  <CardTitle className="text-white">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-400">Contact Person</p>
                          <p className="text-white font-medium">{company.contactPerson}</p>
                          <p className="text-gray-300 text-sm">{company.designation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="text-white font-medium">{company.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-400">Phone</p>
                          <p className="text-white font-medium">{company.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-400">Address</p>
                          <p className="text-white font-medium">{company.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card className="bg-[#2e2e2e] border border-[#ff6b35]/20">
                <CardHeader>
                  <CardTitle className="text-white">Submitted Documents</CardTitle>
                  <CardDescription className="text-gray-400">
                    Review all submitted documents for verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {company.documents.map((doc: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-[#3a3a3a] rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-[#ff6b35]" />
                          <div>
                            <p className="text-white font-medium">
                              {doc.name}
                              {doc.required && <span className="text-red-400 ml-1">*</span>}
                            </p>
                            <p className="text-gray-400 text-sm">{doc.type} • PDF Document</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.uploaded ? (
                            <>
                              <Badge className="bg-[#50c878]/20 text-[#50c878] border-[#50c878]/30">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Uploaded
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-[#2e2e2e] border-[#ff6b35]/30 text-white hover:bg-[#ff6b35]/10"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-[#2e2e2e] border-[#ff6b35]/30 text-white hover:bg-[#ff6b35]/10"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </>
                          ) : (
                            <Badge
                              className={
                                doc.required
                                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                                  : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                              }
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              {doc.required ? "Missing (Required)" : "Not Uploaded"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions Panel */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="bg-[#2e2e2e] border border-[#ff6b35]/20">
                <CardHeader>
                  <CardTitle className="text-white">Application Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <Badge className={getStatusColor(company.status)}>{company.status.replace("_", " ")}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Documents:</span>
                      <span className="text-white">
                        {uploadedDocs}/{totalDocs}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Required Docs:</span>
                      <span className={requiredDocsComplete ? "text-[#50c878]" : "text-red-400"}>
                        {requiredDocsComplete ? "Complete" : "Incomplete"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Days Pending:</span>
                      <span className="text-white">
                        {Math.floor(
                          (new Date().getTime() - new Date(company.submittedDate).getTime()) / (1000 * 60 * 60 * 24),
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Review Actions */}
              <Card className="bg-[#2e2e2e] border border-[#ff6b35]/20">
                <CardHeader>
                  <CardTitle className="text-white">Review Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="comments" className="text-white">
                      Review Comments
                    </Label>
                    <Textarea
                      id="comments"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="bg-[#3a3a3a] border-[#ff6b35]/30 text-white"
                      placeholder="Add notes about the verification process..."
                      rows={4}
                    />
                  </div>

                  {company.status === "rejected" && (
                    <div className="space-y-2">
                      <Label htmlFor="rejectionReason" className="text-white">
                        Rejection Reason
                      </Label>
                      <Textarea
                        id="rejectionReason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="bg-[#3a3a3a] border-[#ff6b35]/30 text-white"
                        placeholder="Specify reason for rejection..."
                        rows={3}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    {company.status === "pending" && (
                      <>
                        <Button
                          onClick={handleSetUnderReview}
                          className="w-full bg-[#4a90e2] hover:bg-[#357abd] text-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Start Review Process
                        </Button>
                        <Button
                          onClick={handleApprove}
                          disabled={!requiredDocsComplete}
                          className="w-full bg-[#50c878] hover:bg-[#45b369] text-white disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Quick Approve
                        </Button>
                      </>
                    )}

                    {company.status === "under_review" && (
                      <Button
                        onClick={handleApprove}
                        disabled={!requiredDocsComplete}
                        className="w-full bg-[#50c878] hover:bg-[#45b369] text-white disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve Company
                      </Button>
                    )}

                    {(company.status === "pending" || company.status === "under_review") && (
                      <Button onClick={handleReject} className="w-full bg-red-500 hover:bg-red-600 text-white">
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject Application
                      </Button>
                    )}

                    {company.status !== "pending" && company.status !== "under_review" && (
                      <div className="text-center py-4">
                        <p className="text-gray-400">This application has been {company.status}</p>
                      </div>
                    )}
                  </div>

                  {!requiredDocsComplete && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-sm">⚠ Cannot approve: Missing required documents</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#ff6b35]/20">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-[#2e2e2e] border-[#ff6b35]/30 text-white hover:bg-[#ff6b35]/10"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
