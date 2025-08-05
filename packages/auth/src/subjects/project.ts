// definindo as ações por tipo de role.

import { z } from 'zod'

import { projectSchema } from '../models/project'
/**
 * tuplas é quando array tem duas posições
 * nesse array na primeira posição fica todas as ações que pode ser feita, na segunda é o nome da subject.
 */
export const projectSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('Project'), projectSchema]),
])
export type ProjectSubject = z.infer<typeof projectSubject>
