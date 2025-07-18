import type { AccountType } from '@/enums/account'
import { defineStore } from 'pinia'

export interface Account {
  id: string
  labels: { text: string }[]
  type: AccountType
  login: string
  password: string | null
}

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: [] as Account[],
  }),
  actions: {
    addAccount(account: Account) {
      this.accounts.push(account)
      this.save()
    },
    updateAccount(updated: Account) {
      const idx = this.accounts.findIndex((a) => a.id === updated.id)
      if (idx !== -1) {
        this.accounts[idx] = updated
        this.save()
      }
    },
    removeAccount(id: string) {
      this.accounts = this.accounts.filter((a) => a.id !== id)
      this.save()
    },
    save() {
      localStorage.setItem('accounts', JSON.stringify(this.accounts))
    },
    load() {
      const data = localStorage.getItem('accounts')
      if (data) this.accounts = JSON.parse(data)
    },
  },
})
