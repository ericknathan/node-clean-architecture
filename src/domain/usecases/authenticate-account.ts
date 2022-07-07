import { CredentialsModel } from '../models/credentials'

export interface AuthenticateAccount {
  authenticate: (credentials: CredentialsModel) => Promise<boolean>
}
