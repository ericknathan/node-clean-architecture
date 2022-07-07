import { CredentialsModel } from '../models/credentials'

export interface AuthenticateAccountModel {
  accessToken: string
}

export interface AuthenticateAccount {
  authenticate: (credentials: CredentialsModel) => Promise<AuthenticateAccountModel>
}
