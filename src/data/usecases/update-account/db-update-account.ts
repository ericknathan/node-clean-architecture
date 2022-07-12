import { UnauthorizedError } from '../../../presentation/errors'
import { UpdateAccount, Comparer, UpdateAccountRepository, UpdateAccountDataModel, UpdateAccountPasswordModel, GetAccountRepository, Encrypter } from './db-update-account-protocols'

export class DbUpdateAccount implements UpdateAccount {
  constructor (
    private readonly cryptographer: Comparer & Encrypter,
    private readonly accountRepository: GetAccountRepository & UpdateAccountRepository
  ) {}

  async updateData (userId: string, newData: UpdateAccountDataModel): Promise<boolean> {
    const accountUpdated = await this.accountRepository.updateData(userId, newData)
    return accountUpdated
  }

  async updatePassword (userId: string, passwords: UpdateAccountPasswordModel): Promise<boolean> {
    const { currentPassword, newPassword } = passwords

    const account = await this.accountRepository.getById(userId)

    const passwordsMatches = await this.cryptographer.compare(currentPassword, account.password)
    if (!passwordsMatches) throw new UnauthorizedError()

    const hashedPassword = await this.cryptographer.encrypt(newPassword)

    const accountUpdated = await this.accountRepository.updatePassword(userId, hashedPassword)
    return accountUpdated
  }
}
