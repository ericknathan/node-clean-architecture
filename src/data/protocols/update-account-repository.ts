export interface UpdateAccountDataRepositoryPayload {
  name?: string
  email?: string
}

export interface UpdateAccountRepository {
  updateData: (userId: string, newData: UpdateAccountDataRepositoryPayload) => Promise<boolean>
  updatePassword: (userId: string, newPassword: string) => Promise<boolean>
}
