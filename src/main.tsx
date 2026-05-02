import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }
  componentDidCatch(error: any, info: any) {
    console.error('DesignEasy crashed:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: 40, fontFamily: 'system-ui, sans-serif', color: '#333'}}>
          <h1 style={{fontSize: 24, marginBottom: 16}}>:( 渲染崩溃了</h1>
          <pre style={{background: '#f5f5f5', padding: 16, borderRadius: 8, fontSize: 13, overflow: 'auto', maxHeight: 300}}>
            {this.state.error?.message || String(this.state.error)}
          </pre>
          <button
            style={{marginTop: 20, padding: '10px 24px', background: '#000', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14}}
            onClick={() => { localStorage.removeItem('de_pro_v12'); window.location.reload() }}
          >
            清除缓存并重试
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
