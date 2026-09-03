import React from 'react'

interface EmptyStateProps {
  icon?: string
  title: string
  text?: string
  action?: React.ReactNode
}

export default function EmptyState({ icon = '📦', title, text, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {text && <p className="empty-state-text">{text}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}
