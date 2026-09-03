import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  required?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, className = '', ...props }, ref) => {
    return (
      <div className="form-group">
        {label && (
          <label className={`form-label${required ? ' required' : ''}`}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`form-input${error ? ' error' : ''} ${className}`}
          {...props}
        />
        {error && <span className="form-error">{error}</span>}
        {hint && !error && <span className="form-hint">{hint}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
