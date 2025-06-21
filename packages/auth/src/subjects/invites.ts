import { z } from "zod";

export const inviteSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('delete'), // revoke apagar um convite que já foi enviado.
  ]),
  z.literal('Invite')
])

export type InviteSubject = z.infer<typeof inviteSubject>