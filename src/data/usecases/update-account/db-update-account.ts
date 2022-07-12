import { UpdateAccountDataModel, UpdateAccountPasswordModel } from '../../../domain/usecases/update-account'
import { UpdateAccount, Comparer, UpdateAccountRepository, GetAccountRepository } from './db-update-account-protocols'

export class DbUpdateAccount implements UpdateAccount {
  constructor (
    private readonly comparer: Comparer,
    private readonly getAccountRepository: GetAccountRepository,
    private readonly updateAccountRepository: UpdateAccountRepository
  ) {}

  async updateData (userId: string, newData: UpdateAccountDataModel): Promise<boolean> {
    const accountUpdated = await this.updateAccountRepository.updateData(userId, newData)
    return accountUpdated
  }

  async updatePassword (userId: string, passwords: UpdateAccountPasswordModel): Promise<boolean> {
    const { currentPassword, newPassword } = passwords

    const account = await this.getAccountRepository.getById(userId)
    const passwordsMatches = await this.comparer.compare(currentPassword, account.password)
    if (!passwordsMatches) return false

    const accountUpdated = await this.updateAccountRepository.updatePassword(userId, newPassword)
    return accountUpdated
  }
}
