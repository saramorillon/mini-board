import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'
import { parseError } from '../utils/parseError'

const schema = {
  get: z.object({
    id: z.string().transform(Number),
  }),
  post: z.object({
    content: z.string(),
  }),
}

export async function getComments(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('get_comments')
  try {
    const { id } = schema.get.parse(req.params)
    const comments = await prisma.comment.findMany({
      where: { issueId: id },
      orderBy: { createdAt: 'asc' },
      include: { author: true },
    })
    res.json(comments)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(parseError(error))
  }
}

export async function postComment(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('post_comment')
  try {
    const { id } = schema.get.parse(req.params)
    const { content } = schema.post.parse(req.body)
    const comment = await prisma.comment.create({ data: { authorId: req.user.id, issueId: id, content } })
    res.status(201).json(comment.id)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(parseError(error))
  }
}

export async function deleteComment(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('delete_comment')
  try {
    const { id } = schema.get.parse(req.params)
    await prisma.comment.delete({ where: { id } })
    res.sendStatus(204)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(parseError(error))
  }
}
