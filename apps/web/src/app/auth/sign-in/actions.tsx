'use server'

import { api } from '@/http/api-client'

export async function signInWithEmailAndPassword(data: FormData) {
  const { email, password } = Object.fromEntries(data)
  console.log(Object.fromEntries(data))
  const result = await api
    .post('session/password', {
      json: {
        email,
        password,
      },
    })
    .json()

  console.log(result)
}
