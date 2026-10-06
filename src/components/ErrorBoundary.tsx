import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // W produkcji tu trafiłoby logowanie do zewnętrznego systemu.
    console.error('RID Connect – nieobsłużony błąd:', error, info);
  }

  handleReload = (): void => {
    this.setState({ hasError: false, message: '' });
    if (typeof window !== 'undefined') window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg-light)' }}>
          <div className="card" style={{ maxWidth: '460px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', color: '#ef4444', marginBottom: '12px' }}>
              <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
            </div>
            <h2 style={{ fontSize: '20px', color: 'var(--primary-dark)', fontWeight: 700, marginBottom: '8px' }}>Coś poszło nie tak</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '20px' }}>
              Wystąpił nieoczekiwany błąd w aplikacji. Spróbuj odświeżyć stronę.
            </p>
            <button className="btn" onClick={this.handleReload}>Odśwież aplikację</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
