export interface UpdateAccountDataModel {
  name?: string
  email?: string
}

export interface UpdateAccountPasswordModel {
  currentPassword: string
  newPassword: string
}

export interface UpdateAccount {
  updateData: (userId: string, newData: UpdateAccountDataModel) => Promise<boolean>
  updatePassword: (userId: string, passwords: UpdateAccountPasswordModel) => Promise<boolean>
}
