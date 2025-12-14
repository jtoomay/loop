import React, { Component, ReactNode, Suspense } from 'react'

type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
}

type ErrorBoundaryProps = {
  children: ReactNode
  errorFallback?: ReactNode
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
      return this.props.errorFallback || null
    }

    return this.props.children
  }
}

export type BoundaryProps = {
  children: ReactNode
  suspenseFallback?: ReactNode
  errorFallback?: ReactNode
  errorComponent?: (error: Error) => ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export function Boundary({ children, suspenseFallback, errorFallback, errorComponent, onError }: BoundaryProps) {
  return (
    <ErrorBoundary errorFallback={errorFallback} errorComponent={errorComponent} onError={onError}>
      <Suspense fallback={suspenseFallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}
