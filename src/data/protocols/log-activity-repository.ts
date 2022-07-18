export interface LogActivityRepository {
  logActivity: (input: any, output: any) => Promise<void>
}
