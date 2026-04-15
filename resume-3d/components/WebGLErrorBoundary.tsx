'use client'

import { Component, type ReactNode } from 'react'

interface Props  { children: ReactNode }
interface State  { failed: boolean; message: string }

/**
 * Catches "Error creating WebGL context" and similar Three.js / R3F crashes
 * and shows a human-friendly fallback instead of a white screen.
 */
export default class WebGLErrorBoundary extends Component<Props, State> {
  state: State = { failed: false, message: '' }

  static getDerivedStateFromError(err: Error): State {
    return { failed: true, message: err.message ?? String(err) }
  }

  render() {
    if (!this.state.failed) return this.props.children

    const isWebGL = /webgl/i.test(this.state.message)

    return (
      <div style={{
        position      : 'fixed',
        inset         : 0,
        display       : 'flex',
        flexDirection : 'column',
        alignItems    : 'center',
        justifyContent: 'center',
        background    : '#C4B5A0',
        color         : '#3a2e24',
        fontFamily    : 'system-ui, -apple-system, sans-serif',
        padding       : '40px',
        textAlign     : 'center',
        gap           : '16px',
      }}>
        <div style={{ fontSize: '48px' }}>⚠️</div>

        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
          {isWebGL ? 'WebGL not available' : 'Something went wrong'}
        </h2>

        {isWebGL ? (
          <>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.75, maxWidth: '420px', lineHeight: 1.6 }}>
              Your browser couldn't create a WebGL context. This usually means
              hardware acceleration is disabled.
            </p>
            <ol style={{
              textAlign : 'left',
              fontSize  : '13px',
              lineHeight: 1.8,
              opacity   : 0.70,
              maxWidth  : '380px',
              margin    : 0,
              paddingLeft: '20px',
            }}>
              <li>Open <strong>chrome://settings/system</strong> (or <em>about:config</em> in Firefox)</li>
              <li>Enable <strong>"Use hardware acceleration when available"</strong></li>
              <li>Restart the browser, then reload this page</li>
              <li>If still broken, try a different browser (Chrome / Edge work best)</li>
            </ol>
          </>
        ) : (
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.75, maxWidth: '420px' }}>
            {this.state.message}
          </p>
        )}

        <button
          onClick={() => this.setState({ failed: false, message: '' })}
          style={{
            marginTop    : '8px',
            padding      : '10px 28px',
            background   : 'rgba(255,255,255,0.25)',
            border       : '1px solid rgba(255,255,255,0.40)',
            borderRadius : '8px',
            cursor       : 'pointer',
            fontSize     : '13px',
            color        : '#3a2e24',
            letterSpacing: '0.06em',
          }}
        >
          Try again
        </button>
      </div>
    )
  }
}
