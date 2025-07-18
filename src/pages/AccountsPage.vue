<template>
  <v-container class="py-4">
    <v-row align="center" justify="space-between" class="mb-4">
      <v-col cols="auto">
        <h2>Учетные записи</h2>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="addAccount" icon>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-alert type="info" variant="outlined" class="mb-4">
      <span>
        <b>Метка</b> — можно ввести несколько меток, разделяя их через <b>;</b>.<br />
        <b>Пример:</b> <code>рабочий;личный;VPN</code>
      </span>
    </v-alert>
    <AccountsList />
  </v-container>
</template>

<script setup lang="ts">
import AccountsList from '@/components/AccountsList.vue'
import { useAccountsStore } from '@/stores/accounts'
import { onMounted } from 'vue'
import { AccountType } from '@/enums/account'
const store = useAccountsStore()
onMounted(() => store.load())

function addAccount() {
  store.addAccount({
    id: Date.now().toString(),
    labels: [],
    type: AccountType.LDAP,
    login: '',
    password: null,
  })
}
</script>
