import React, { Component, ReactNode, Suspense } from 'react'

type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
}

type ErrorBoundaryProps = {
  children: ReactNode
  fallback?: ReactNode
  errorComponent?: (error: Error) => ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.errorComponent) {
        return this.props.errorComponent(this.state.error)
      }
      return this.props.fallback || null
    }

    return this.props.children
  }
}

export type BoundaryProps = {
  children: ReactNode
  fallback?: ReactNode
  errorComponent?: (error: Error) => ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export function Boundary({ children, fallback, errorComponent, onError }: BoundaryProps) {
  return (
    <ErrorBoundary fallback={fallback} errorComponent={errorComponent} onError={onError}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}
