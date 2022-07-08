export interface Comparer {
  compare: (value: string, hash: string) => Promise<boolean>
}
