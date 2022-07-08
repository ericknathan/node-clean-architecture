export interface AccessTokenRepository {
  update: (accountId: string, accessToken: string) => Promise<void>
}
