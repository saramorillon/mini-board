import { IconTrash } from '@tabler/icons'
import React, { FormEvent, useCallback, useState } from 'react'
import { IComment } from '../../models/Comment'
import { deleteComment, getComments, saveComment } from '../../services/comment'
import { FetchContainer } from './FetchContainer'

interface ICommentsProps {
  issueId: number
}

export function Comments({ issueId }: ICommentsProps) {
  const fetch = useCallback(() => getComments(issueId), [issueId])

  return (
    <>
      <hr className="my2" />
      <h3>Comments</h3>
      <FetchContainer
        fetchFn={fetch}
        defaultValue={[]}
        loadingMessage="Loading comments"
        errorMessage="An error occurred while loading comments"
        notFoundMessage="Comments not found"
      >
        {(comments, refresh) => (
          <>
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} refresh={refresh} />
            ))}
            <CommentForm issueId={issueId} refresh={refresh} />
          </>
        )}
      </FetchContainer>
    </>
  )
}

interface ICommentProps {
  comment: IComment
  refresh: () => void
}

function Comment({ comment, refresh }: ICommentProps): JSX.Element {
  const onDelete = useCallback(() => deleteComment(comment).then(refresh), [comment, refresh])

  return (
    <article className="my1">
      <h5>
        {comment.author.username} <small>{comment.createdAt}</small>
      </h5>
      <button onClick={onDelete} className="right">
        <IconTrash /> Delete
      </button>
      <p>{comment.content}</p>
    </article>
  )
}

interface ICommentFormProps {
  issueId: number
  refresh: () => void
}

function CommentForm({ issueId, refresh }: ICommentFormProps) {
  const [content, setContent] = useState('')

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      return saveComment(issueId, content)
        .then(refresh)
        .then(() => setContent(''))
    },
    [issueId, content, refresh]
  )

  return (
    <form name="add-comment" onSubmit={onSubmit}>
      <label>
        <textarea placeholder="Add a comment" value={content} onChange={(e) => setContent(e.target.value)} required />
      </label>
      <button type="submit" className="right">
        Send
      </button>
    </form>
  )
}
