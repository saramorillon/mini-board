import { useFetch } from '@saramorillon/hooks'
import { IconGitBranch, IconWorld } from '@tabler/icons'
import React from 'react'
import { getApp } from '../../services/app'

export function Footer(): JSX.Element | null {
  const [app] = useFetch(getApp, null)

  if (!app) return null

  return (
    <footer className="center">
      <b>{app.name}</b>
      <small className="mx1">v{app.version}</small>
      <br />
      <a href={app.repository.url} target="_blank" rel="noopener noreferrer">
        <IconGitBranch /> {app.repository.url}
      </a>
      <br />
      <a href={app.author.url} target="_blank" rel="noopener noreferrer">
        <IconWorld /> {app.author.url}
      </a>
      <br />
      &copy; {app.author.name} {new Date().getFullYear()}
    </footer>
  )
}
