<template>
  <v-list lines="one">
    <div v-for="account in accounts" :key="account.id" class="mb-4">
      <AccountItem :account="account" />
    </div>
  </v-list>
</template>

<script setup lang="ts">
import { useAccountsStore } from '@/stores/accounts'
import { computed } from 'vue'
import AccountItem from './AccountItem.vue'
const store = useAccountsStore()
const accounts = computed(() => store.accounts)
</script>
