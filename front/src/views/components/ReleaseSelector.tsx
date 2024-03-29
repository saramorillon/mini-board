import { useQuery } from '@saramorillon/hooks'
import { format, parseISO } from 'date-fns'
import React, { LabelHTMLAttributes, SelectHTMLAttributes, useEffect } from 'react'
import { getReleases } from '../../services/release'

interface IReleaseSelectorProps {
  label?: string
  value?: number
  onChange: (releaseId: number) => void
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>
  selectProps?: SelectHTMLAttributes<HTMLSelectElement>
}

export function ReleaseSelector({ label, value, onChange, labelProps = {}, selectProps = {} }: IReleaseSelectorProps) {
  const { result: releases, loading } = useQuery(getReleases, { autoRun: true, defaultValue: [] })

  useEffect(() => {
    if (releases.length && !value && !selectProps.placeholder) {
      onChange(releases[0].id)
    }
  }, [releases, value, selectProps.placeholder, onChange])

  return (
    <label aria-busy={loading} {...labelProps}>
      {label}
      <select
        {...selectProps}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={selectProps.disabled || !releases.length}
      >
        {!loading && !releases.length && <option value="">No release found</option>}
        {selectProps.placeholder && releases.length && <option value="">{selectProps.placeholder}</option>}
        {releases.map((release) => (
          <option key={release.id} value={release.id}>
            {format(parseISO(release.dueDate), 'PP')} ({release.name})
          </option>
        ))}
      </select>
    </label>
  )
}
