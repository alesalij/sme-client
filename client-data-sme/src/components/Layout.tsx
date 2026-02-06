import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { User, LogOut } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()

  const handleLogout = () => {
    if (confirm('Вы уверены, что хотите выйти?')) {
      toast.success('Вы вышли из системы')
      // В реальном приложении здесь был бы редирект на страницу входа
    }
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="main-header">
          <div className="container">
            <div className="header-content">
              <div className="logo-container">
                <div className="logo">
                  <div className="logo-icon">
                    <svg
                      width="300"
                      height="134"
                      viewBox="0 0 300 134"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.0200195 60.55V132.08H22.03V60.55C22.03 39.28 39.27 22.03 60.55 22.03H110.07V49.54C110.07 70.81 92.83 88.06 71.55 88.06H33.03V110.07H71.55C104.98 110.07 132.08 82.97 132.08 49.54V5.53003C132.08 2.49003 129.62 0.0300293 126.58 0.0300293H60.55C27.12 0.0300293 0.0200195 27.13 0.0200195 60.56V60.55Z"
                        fill="var(--primary-pink)"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="logo-text">Client Data SME</div>
                    <div className="logo-subtitle">
                      Система управления данными клиентов
                    </div>
                  </div>
                </div>
              </div>
              <div className="user-info">
                <div className="user-avatar">
                  <User size={20} />
                </div>
                <div>
                  <div>Иванов И.И.</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Отдел SME</div>
                </div>
                <button className="btn-secondary" onClick={handleLogout}>
                  <LogOut size={16} /> Выйти
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container">
        <div className="tabs-container">
          <div className="tabs">
            <Link
              to="/search"
              className={`tab ${isActive('/search') || isActive('/') ? 'active' : ''}`}
            >
              <i className="fas fa-search"></i>
              Поиск клиентов
            </Link>
            <Link
              to="/export"
              className={`tab ${isActive('/export') ? 'active' : ''}`}
            >
              <i className="fas fa-download"></i>
              Массовая выгрузка
            </Link>
          </div>

          <div className="tab-content active">
            {children}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-links">
              <a href="#">Документация</a>
              <a href="#">Поддержка</a>
              <a href="#">Контакты</a>
            </div>
            <div className="copyright">
              © 2023 АО «Ренессанс Кредит». Все права защищены.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}