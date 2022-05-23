import { Request, Response } from 'express'
import { z } from 'zod'
import { start } from '../../libs/logger'
import { prisma } from '../../prisma'

const schema = {
  params: z.object({
    id: z.string().transform(Number),
  }),
}

export async function deleteIssue(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('delete_issue', { req })
  try {
    const { id } = schema.params.parse(req.params)
    await prisma.issue.delete({ where: { id } })
    res.sendStatus(204)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}