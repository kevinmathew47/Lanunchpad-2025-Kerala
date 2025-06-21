"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, FileText, Building2, CheckCircle, X } from "lucide-react"

interface CompanyRegistrationFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

interface DocumentUpload {
  id: string
  name: string
  type: string
  file: File | null
  required: boolean
  uploaded: boolean
}

const requiredDocuments: Omit<DocumentUpload, "id" | "file" | "uploaded">[] = [
  { name: "Business License", type: "business-license", required: true },
  { name: "Tax Registration Certificate", type: "tax-certificate", required: true },
  { name: "Incorporation Documents", type: "incorporation", required: true },
  { name: "Financial Statements", type: "financial", required: false },
  { name: "Insurance Certificate", type: "insurance", required: false },
]

export function CompanyRegistrationForm({ open, onOpenChange, onSubmit }: CompanyRegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    companyName: "",
    registrationNumber: "",
    taxId: "",
    industry: "",
    foundedYear: "",
    companySize: "",
    website: "",
    description: "",
    contactPerson: "",
    designation: "",
    email: "",
    phone: "",
    alternatePhone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  })

  const [documents, setDocuments] = useState<DocumentUpload[]>(
    requiredDocuments.map((doc, index) => ({
      ...doc,
      id: `doc-${index}`,
      file: null,
      uploaded: false,
    })),
  )

  const [termsAccepted, setTermsAccepted] = useState(false)

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (docId: string, file: File) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === docId ? { ...doc, file, uploaded: true, name: file.name } : doc)),
    )
  }

  const removeDocument = (docId: string) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === docId ? { ...doc, file: null, uploaded: false } : doc)))
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.companyName && formData.registrationNumber && formData.industry
      case 2:
        return formData.contactPerson && formData.email && formData.phone
      case 3:
        return formData.address && formData.city && formData.state
      case 4:
        const requiredDocsUploaded = documents.filter((doc) => doc.required).every((doc) => doc.uploaded)
        return requiredDocsUploaded && termsAccepted
      default:
        return false
    }
  }

  const handleSubmit = () => {
    const submissionData = {
      ...formData,
      documents: documents.map((doc) => ({
        name: doc.name,
        type: doc.type,
        uploaded: doc.uploaded,
        required: doc.required,
      })),
    }

    onSubmit(submissionData)

    // Reset form
    setCurrentStep(1)
    setFormData({
      companyName: "",
      registrationNumber: "",
      taxId: "",
      industry: "",
      foundedYear: "",
      companySize: "",
      website: "",
      description: "",
      contactPerson: "",
      designation: "",
      email: "",
      phone: "",
      alternatePhone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    })
    setDocuments(
      requiredDocuments.map((doc, index) => ({
        ...doc,
        id: `doc-${index}`,
        file: null,
        uploaded: false,
      })),
    )
    setTermsAccepted(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-[#3a3a3a] border border-[#ff6b35]/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Company Registration
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Complete the registration process to join our platform
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <ScrollArea className="h-[500px] pr-4">
            {currentStep === 1 && <CompanyInfoStep formData={formData} onInputChange={handleInputChange} />}
            {currentStep === 2 && <ContactInfoStep formData={formData} onInputChange={handleInputChange} />}
            {currentStep === 3 && <AddressInfoStep formData={formData} onInputChange={handleInputChange} />}
            {currentStep === 4 && (
              <DocumentUploadStep
                documents={documents}
                onFileUpload={handleFileUpload}
                onRemoveDocument={removeDocument}
                termsAccepted={termsAccepted}
                onTermsChange={setTermsAccepted}
              />
            )}
          </ScrollArea>

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t border-[#ff6b35]/20">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="bg-[#2e2e2e] border-[#ff6b35]/30 text-white hover:bg-[#ff6b35]/10"
            >
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                disabled={!canProceedToNext()}
                className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceedToNext()}
                className="bg-[#50c878] hover:bg-[#45b369] text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Submit Registration
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CompanyInfoStep({
  formData,
  onInputChange,
}: {
  formData: any
  onInputChange: (field: string, value: string) => void
}) {
  return (
    <Card className="bg-[#2e2e2e] border border-[#ff6b35]/20">
      <CardHeader>
        <CardTitle className="text-white">Company Information</CardTitle>
        <CardDescription className="text-gray-400">Basic information about your company</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-gray-300">
              Company Name *
            </Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => onInputChange("companyName", e.target.value)}
              className="bg-[#3a3a3a] border-[#ff6b35]/30 text-white"
              placeholder="Enter company name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registrationNumber" className="text-gray-300">
              Registration Number *
            </Label>
            <Input
              id="registrationNumber"
              value={formData.registrationNumber}
              onChange={(e) => onInputChange("registrationNumber", e.target.value)}
              className="bg-[#3a3a3a] border-[#ff6b35]/30 text-white"
              placeholder="Enter registration number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxId" className="text-gray-300">
              Tax ID
            </Label>
            <Input
              id="taxId"
              value={formData.taxId}
              onChange={(e) => onInputChange("taxId", e.target.value)}
              className="bg-[#3a3a3a] border-[#ff6b35]/30 text-white"
              placeholder="Enter tax ID"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry" className="text-gray-300">
              Industry *
            </Label>
            <Select value={formData.industry} onValueChange={(value) => onInputChange("industry", value)}>
              <SelectTrigger className="bg-[#3a3a3a] border-[#ff6b35]/30 text-white">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="energy">Energy</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="foundedYear" className="text-gray-300">
              Founded Year
            </Label>
            <Input
              id="foundedYear"
              type="number"
              value={formData.foundedYear}
              onChange={(e) => onInputChange("foundedYear", e.target.value)}
              className="bg-[#3a3a3a] border-[#ff6b35]/30 text-white"
              placeholder="Enter founded year"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companySize" className="text-gray-300">
              Company Size
            </Label>
            <Select value={formData.companySize} onValueChange={(value) => onInputChange("companySize", value)}>
              <SelectTrigger className="bg-[#3a3a3a] border-[#ff6b35]/30 text-white">
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10</SelectItem>
                <SelectItem value="11-50">11-50</SelectItem>
                <SelectItem value="51-200">51-200</SelectItem>
                <SelectItem value="201-500">201-500</SelectItem>
                <SelectItem value="501+">501+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="website" className="text-gray-300">
            Website
          </Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => onInputChange("website", e.target.value)}
            className="bg-[#3a3a3a] border-[#ff6b35]/30 text-white"
            placeholder="https://www.example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description" className="text-gray-300">
            Company Description
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            className="bg-[#3a3a3a] border-[#ff6b35]/30 text-white"
            placeholder="Brief description of your company"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function ContactInfoStep({
  formData,
  onInputChange,
}: {
  formData: any
  onInputChange: (field: string, value: string) => void
}) {
  return (
    <Card className="bg-[#2e2e2e] border border-[#ff6b35]/20">
      <CardHeader>
        <CardTitle className="text-white">Contact Information</CardTitle>
        <CardDescription className="text-gray-400">Primary contact person details (Company Admin)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactPerson" className="text-gray-300">
              Contact Person *
            </Label>
            <Input
              id="contactPerson"
              value={formData.contactPerson}
              onChange={(e) => onInputChange("contactPerson", e.target.value)}
              className="bg-[#3a3a3a] border-[#ff6b35]/30 text-white"
              placeholder="Enter contact person name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="designation" className="text-gray-300">
              Designation *
            </Label>
            <Input
              id="designation"
              value={formData.designation}
              onChange={(e) => onInputChange("designation", e.target.value)}
              className="bg-[#3a3a3a] border-[#ff6b35]/30 text-white"
              placeholder="e.g., CEO, Manager, Director"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange("email", e.target.value)}
              className="bg-[#3a3a3a] border-[#ff6b35]/30 text-white"
              placeholder="Enter email address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-300">
              Phone Number *
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => onInputChange("phone", e.target.value)}
              className="bg-[#3a3a3a] border-[#ff6b35]/30 text-white"
              placeholder="Enter phone number"
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="alternatePhone" className="text-gray-300">
              Alternate Phone
            </Label>
            <Input
              id="alternatePhone"
              value={formData.alternatePhone}
              onChange={(e) => onInputChange("alternatePhone", e.target.value)}
              className="bg-[#3a3a3a] border-[#ff6b35]/30 text-white"
              placeholder="Enter alternate phone number"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AddressInfoStep({
  formData,
  onInputChange,
}: {
  formData: any
  onInputChange: (field: string, value: string) => void
}) {
  return (
    <Card className="bg-[#2e2e2e] border border-[#ff6b35]/20">
      <CardHeader>
        <CardTitle className="text-white">Address Information</CardTitle>
        <CardDescription className="text-gray-400">Company address details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address" className="text-gray-300">
            Street Address *
          </Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => onInputChange("address", e.target.value)}
            className="bg-[#3a3a3a] border-[#ff6b35]/30 text-white"
            placeholder="Enter complete address"
            rows={2}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-gray-300">
              City *
            </Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => onInputChange("city", e.target.value)}
              className="bg-[#3a3a3a] border-[#ff6b35]/30 text-white"
              placeholder="Enter city"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state" className="text-gray-300">
              State/Province *
            </Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => onInputChange("state", e.target.value)}
              className="bg-[#3a3a3a] border-[#ff6b35]/30 text-white"
              placeholder="Enter state/province"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode" className="text-gray-300">
              ZIP/Postal Code
            </Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => onInputChange("zipCode", e.target.value)}
              className="bg-[#3a3a3a] border-[#ff6b35]/30 text-white"
              placeholder="Enter ZIP/postal code"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country" className="text-gray-300">
              Country
            </Label>
            <Select value={formData.country} onValueChange={(value) => onInputChange("country", value)}>
              <SelectTrigger className="bg-[#3a3a3a] border-[#ff6b35]/30 text-white">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="fr">France</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DocumentUploadStep({
  documents,
  onFileUpload,
  onRemoveDocument,
  termsAccepted,
  onTermsChange,
}: {
  documents: DocumentUpload[]
  onFileUpload: (docId: string, file: File) => void
  onRemoveDocument: (docId: string) => void
  termsAccepted: boolean
  onTermsChange: (accepted: boolean) => void
}) {
  return (
    <Card className="bg-[#2e2e2e] border border-[#ff6b35]/20">
      <CardHeader>
        <CardTitle className="text-white">Document Upload</CardTitle>
        <CardDescription className="text-gray-400">Upload required documents for verification</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="border border-[#ff6b35]/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#ff6b35]" />
                  <span className="text-white font-medium">{doc.name}</span>
                  {doc.required && <span className="text-red-400 text-sm">*</span>}
                </div>
                {doc.uploaded && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRemoveDocument(doc.id)}
                    className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {!doc.uploaded ? (
                <div className="border-2 border-dashed border-[#ff6b35]/30 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-[#ff6b35] mx-auto mb-2" />
                  <p className="text-gray-400 mb-2">Click to upload or drag and drop</p>
                  <p className="text-gray-500 text-sm">PDF, DOC, DOCX up to 10MB</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) onFileUpload(doc.id, file)
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-[#50c878]/10 border border-[#50c878]/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-[#50c878]" />
                  <div className="flex-1">
                    <p className="text-white font-medium">{doc.file?.name}</p>
                    <p className="text-gray-400 text-sm">
                      {doc.file ? `${(doc.file.size / 1024 / 1024).toFixed(2)} MB` : ""}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2 pt-4 border-t border-[#ff6b35]/20">
          <Checkbox id="terms" checked={termsAccepted} onCheckedChange={onTermsChange} />
          <Label htmlFor="terms" className="text-gray-300 text-sm">
            I agree to the{" "}
            <a href="#" className="text-[#ff6b35] hover:underline">
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#ff6b35] hover:underline">
              Privacy Policy
            </a>
          </Label>
        </div>
      </CardContent>
    </Card>
  )
}
