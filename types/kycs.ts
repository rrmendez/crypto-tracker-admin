export interface KYCDocumentVm {
  id: string;
  type: string;
  description: string;
  fileUrl: string;
  extension: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  groupType: string;
  rejectReason: string | null;
}

export interface KYCResponseVm {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  type: "IDENTITY_PJ" | "IDENTITY_PF" | string;
  isMandatory: boolean;
  status: "PENDING" | "VALIDATED" | "REJECTED" | string;
  rejectReason: string | null;
  documents: KYCDocumentVm[];
  user: {
    email: string;
    fullName: string;
    phone: string;
  };
}
