enum ActionType {
  ACCOUNT_LOCK = "ACCOUNT_LOCK",
  ACCOUNT_UNLOCK = "ACCOUNT_UNLOCK",
  TRANSFER_LOCK = "TRANSFER_LOCK",
  TRANSFER_UNLOCK = "TRANSFER_UNLOCK",
  COMPLIANCE_APPROVED = "COMPLIANCE_APPROVED",
  COMPLIANCE_REJECTED = "COMPLIANCE_REJECTED",
}

export type UserSecurityLogVm = {
  id: string;
  userId: string;
  actionType: ActionType;
  reason: string;
  createdAt: string;
  createdBy: {
    id: string;
    email: string;
    fullName: string;
    avatar: string;
  };
};
