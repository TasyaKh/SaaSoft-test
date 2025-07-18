<template>
  <v-form @submit.prevent>
    <v-row class="mb-0" dense>
      <v-col cols="12" sm="3">
        <!-- label mark -->
        <v-text-field
          v-model="labelInput"
          :rules="labelRules"
          label="Метка (через ;)"
          maxlength="50"
          :hide-details="false"
          density="comfortable"
          variant="outlined"
          rounded="md"
          @blur="save"
        />
      </v-col>
      <!-- type -->
      <v-col cols="12" sm="2">
        <v-select
          v-model="type"
          :items="typeItems"
          :rules="[(v) => !!v || 'Тип обязателен']"
          label="Тип записи"
          :hide-details="false"
          density="comfortable"
          variant="outlined"
          rounded="md"
          @update:model-value="save"
        />
      </v-col>
      <!-- login -->
      <v-col cols="12" :sm="type === AccountType.Local ? 3 : 6">
        <v-text-field
          v-model="login"
          :rules="loginRules"
          label="Логин"
          maxlength="100"
          :hide-details="false"
          density="comfortable"
          variant="outlined"
          rounded="md"
          @blur="save"
        />
      </v-col>
      <!-- password  -->
      <v-col cols="12" sm="3" v-if="type === AccountType.Local">
        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Пароль"
          maxlength="100"
          :type="showPassword ? 'text' : 'password'"
          :hide-details="false"
          density="comfortable"
          variant="outlined"
          rounded="md"
          @blur="save"
        >
          <template #append-inner>
            <v-icon
              :icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              class="mr-2"
              @click.stop="showPassword = !showPassword"
              style="cursor: pointer"
            />
          </template>
        </v-text-field>
      </v-col>
      <!-- remove -->
      <v-col cols="12" sm="1" class="d-flex align-start justify-center">
        <v-btn icon color="error" @click="remove" variant="tonal" size="large">
          <v-icon size="24">mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import type { Account } from '@/stores/accounts'
import { AccountType } from '@/enums/account'

const props = defineProps<{ account: Account }>()
const store = useAccountsStore()

const labelInput = ref(props.account.labels.map((l) => l.text).join(';'))
const type = ref<AccountType>(props.account.type as AccountType)
const login = ref(props.account.login)
const password = ref(props.account.password ?? '')
const showPassword = ref(false)

const typeItems = [
  { title: 'LDAP', value: AccountType.LDAP },
  { title: 'Локальная', value: AccountType.Local },
]

const labelRules = [(v: string) => v.length <= 50 || 'Максимум 50 символов']
const loginRules = [
  (v: string) => !!v || 'Логин обязателен',
  (v: string) => v.length <= 100 || 'Максимум 100 символов',
]
const passwordRules = computed<((v: string) => true | string)[]>(() => {
  if (type.value === AccountType.LDAP) return []
  else {
    return [
      (v: string) => !!v || 'Пароль обязателен',
      (v: string) => v.length <= 100 || 'Максимум 100 символов',
    ]
  }
})

function isValidInput(): boolean {
  const validate = (rules: ((v: string) => true | string)[], value: string) =>
    rules.every((rule) => rule(value) === true)

  return (
    validate(labelRules, labelInput.value) &&
    validate(loginRules, login.value) &&
    validate(passwordRules.value, password.value)
  )
}

function save() {
  if (!isValidInput()) return
  store.updateAccount({
    ...props.account,
    labels: labelInput.value
      .split(';')
      .filter(Boolean)
      .map((text) => ({ text: text.trim() })),
    type: type.value,
    login: login.value,
    password: type.value === AccountType.LDAP ? null : password.value,
  })
}

function remove() {
  store.removeAccount(props.account.id)
}
</script>
