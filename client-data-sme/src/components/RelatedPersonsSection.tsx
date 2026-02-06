import { RelatedPerson } from '@/types'
import { User, UserCheck, ExternalLink } from 'lucide-react'

interface RelatedPersonsSectionProps {
  relatedPersons: RelatedPerson[]
  clientInn: string
}

export function RelatedPersonsSection({ relatedPersons, clientInn }: RelatedPersonsSectionProps) {
  const getPersonIcon = (type: string) => {
    return type === 'ФЛ' ? (
      <User size={16} />
    ) : (
      <UserCheck size={16} />
    )
  }

  const getStatusClass = (isClient: boolean) => {
    return isClient ? 'success' : 'warning'
  }

  const getStatusText = (isClient: boolean) => {
    return isClient ? 'Клиент банка' : 'Не клиент банка'
  }

  return (
    <div className="section">
      <h3 className="section-title">
        <i className="fas fa-users"></i>
        Связанные лица
      </h3>

      {relatedPersons.length === 0 ? (
        <div className="result-box info">
          <i className="fas fa-info-circle"></i>
          Связанные лица не найдены
        </div>
      ) : (
        <div className="related-persons">
          {relatedPersons.map((person) => (
            <div key={person.id} className="person-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>
                    {getPersonIcon(person.type)} {person.name}
                  </strong>
                  <div style={{ fontSize: '0.9rem', color: 'var(--dark-gray)', margin: '5px 0' }}>
                    ИНН: {person.inn} | Тип: {person.type} | {person.relation}
                  </div>
                  <div>
                    <span className={`status-badge status-${getStatusClass(person.isClient)}`}>
                      {getStatusText(person.isClient)}
                    </span>
                  </div>
                </div>
                
                {person.isClient && person.clientLink && (
                  <div>
                    <a 
                      href={person.clientLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        color: 'var(--primary-blue)',
                        textDecoration: 'none',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <ExternalLink size={14} />
                      Карточка клиента ФЛ
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Информация о поиске связанных лиц */}
      <div className="result-box info" style={{ marginTop: '20px' }}>
        <h4><i className="fas fa-info-circle"></i> Информация о связанных лицах</h4>
        <p>
          Данные о связанных лицах получены из базы данных AML SME. 
          Связи определены на основе анализа учредителей, руководителей 
          и других аффилированных лиц.
        </p>
        <p style={{ marginTop: '10px' }}>
          <strong>ИНН основного клиента:</strong> {clientInn}
        </p>
        <p>
          <strong>Найдено связанных лиц:</strong> {relatedPersons.length}
        </p>
      </div>
    </div>
  )
}