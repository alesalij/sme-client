import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { searchApi, validationApi } from '@/api/client'
import { SearchParams, DisplayOptions, Client } from '@/types'
import { ClientCard } from '@/components/ClientCard'
import { ClientDetails } from '@/components/ClientDetails'
import { RelatedPersonsSection } from '@/components/RelatedPersonsSection'
import { SearchForm } from '@/components/SearchForm'

export function SearchPage() {
  const [searchParams, setSearchParams] = useState<SearchParams>({})
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    searchShortName: true,
    searchShortInn: true,
    searchShortOgrn: true,
    searchShortKpp: true,
    searchShortAccount: true,
    searchShortRegAddress: true,
    searchShortFactAddress: true,
    searchShortCeo: true,
    searchShortBeneficiary: true,
    searchShortRegDate: true,
    searchShortOkved: true,
    searchExtRelatedPersons: true
  })
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showExamples, setShowExamples] = useState(true)

  // Запрос поиска клиентов
  const { data: searchResult, isFetching, refetch } = useQuery({
    queryKey: ['clients', searchParams, displayOptions],
    queryFn: () => searchApi.searchClients({ ...searchParams, ...displayOptions }),
    enabled: false, // Запускаем вручную
  })

  // Запрос связанных лиц
  const { data: relatedPersons } = useQuery({
    queryKey: ['related', selectedClient?.inn],
    queryFn: () => selectedClient ? searchApi.getRelatedPersons(selectedClient.inn) : [],
    enabled: !!selectedClient && displayOptions.searchExtRelatedPersons,
  })

  const handleSearch = async () => {
    // Валидация входных данных
    if (searchParams.inn) {
      const innValidation = validationApi.validateInn(searchParams.inn)
      if (!innValidation.isValid) {
        toast.error(innValidation.error || 'Некорректный ИНН')
        return
      }
    }

    if (searchParams.ogrn) {
      const ogrnValidation = validationApi.validateOgrn(searchParams.ogrn)
      if (!ogrnValidation.isValid) {
        toast.error(ogrnValidation.error || 'Некорректный ОГРН')
        return
      }
    }

    if (searchParams.account) {
      const accountValidation = validationApi.validateAccountNumber(searchParams.account)
      if (!accountValidation.isValid) {
        toast.error(accountValidation.error || 'Некорректный номер счета')
        return
      }
    }

    if (searchParams.actualDate) {
      const dateValidation = validationApi.validateDate(searchParams.actualDate)
      if (!dateValidation.isValid) {
        toast.error(dateValidation.error || 'Некорректная дата')
        return
      }
    }

    // Проверяем, что введен хотя бы один параметр
    const hasParams = Object.values(searchParams).some(param => param && param.trim())
    if (!hasParams) {
      toast.error('Пожалуйста, введите хотя бы один параметр поиска')
      return
    }

    try {
      await refetch()
    } catch (error) {
      toast.error('Ошибка при поиске клиентов')
      console.error('Search error:', error)
    }
  }

  const handleClearForm = () => {
    setSearchParams({})
    setSelectedClient(null)
  }

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client)
  }

  const fillExample = (inn: string, type: 'ЮЛ' | 'ИП') => {
    setSearchParams({ inn })
    toast.success(`Заполнен пример ${type}: ${inn}`)
  }

  return (
    <div className="space-y-6">
      {/* Форма поиска */}
      <div className="section">
        <h3 className="section-title">
          <Search size={20} />
          Поиск клиентов
        </h3>

        {/* Примеры для тестирования */}
        {showExamples && (
          <div className="examples">
            <div className="flex justify-between items-center mb-4">
              <h4>
                <i className="fas fa-lightbulb"></i> Примеры для тестирования:
              </h4>
              <button
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                onClick={() => setShowExamples(false)}
              >
                <EyeOff size={16} /> Скрыть примеры
              </button>
            </div>
            <div className="example-grid">
              <div className="example-item" onClick={() => fillExample('7713123456', 'ЮЛ')}>
                <div className="example-type">Юридическое лицо</div>
                <div className="example-value">7713123456</div>
              </div>
              <div className="example-item" onClick={() => fillExample('7713987654', 'ЮЛ')}>
                <div className="example-type">Юридическое лицо</div>
                <div className="example-value">7713987654</div>
              </div>
              <div className="example-item" onClick={() => fillExample('123456789012', 'ИП')}>
                <div className="example-type">Индивидуальный предприниматель</div>
                <div className="example-value">123456789012</div>
              </div>
              <div className="example-item" onClick={() => fillExample('987654321098', 'ИП')}>
                <div className="example-type">Индивидуальный предприниматель</div>
                <div className="example-value">987654321098</div>
              </div>
            </div>
          </div>
        )}

        {!showExamples && (
          <div className="mb-4">
            <button
              className="btn-secondary"
              onClick={() => setShowExamples(true)}
            >
              <Eye size={16} /> Показать примеры
            </button>
          </div>
        )}

        <SearchForm
          searchParams={searchParams}
          displayOptions={displayOptions}
          onSearchParamsChange={setSearchParams}
          onDisplayOptionsChange={setDisplayOptions}
          onSearch={handleSearch}
          onClear={handleClearForm}
          isLoading={isFetching}
        />
      </div>

      {/* Результаты поиска */}
      {searchResult && (
        <div className="section">
          <h3 className="section-title">
            <i className="fas fa-list"></i>
            Результаты поиска
          </h3>
          
          {searchResult.clients.length === 0 ? (
            <div className="result-box warning">
              <i className="fas fa-exclamation-triangle"></i>
              Клиенты не найдены
            </div>
          ) : (
            <div className="client-list">
              {searchResult.clients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  displayOptions={displayOptions}
                  isSelected={selectedClient?.id === client.id}
                  onSelect={handleClientSelect}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Детали клиента */}
      {selectedClient && (
        <ClientDetails
          client={selectedClient}
          displayOptions={displayOptions}
        />
      )}

      {/* Связанные лица */}
      {selectedClient && displayOptions.searchExtRelatedPersons && relatedPersons && (
        <RelatedPersonsSection
          relatedPersons={relatedPersons}
          clientInn={selectedClient.inn}
        />
      )}
    </div>
  )
}