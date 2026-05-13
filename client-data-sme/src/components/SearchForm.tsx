import { Search, Eraser } from 'lucide-react';
import { SearchParams, DisplayOptions } from '@/types';
import { MaskedInput } from './MaskedInput';
import { CheckboxItem } from './CheckboxItem';

interface SearchFormProps {
  searchParams: SearchParams;
  displayOptions: DisplayOptions;
  onSearchParamsChange: (params: SearchParams) => void;
  onDisplayOptionsChange: (options: DisplayOptions) => void;
  onSearch: () => void;
  onClear: () => void;
  isLoading: boolean;
}

export function SearchForm({
  searchParams,
  displayOptions,
  onSearchParamsChange,
  onDisplayOptionsChange,
  onSearch,
  onClear,
  isLoading,
}: SearchFormProps) {
  const updateSearchParams = (key: keyof SearchParams, value: string) => {
    onSearchParamsChange({
      ...searchParams,
      [key]: value || undefined,
    });
  };

  const toggleDisplayOption = (key: keyof DisplayOptions) => {
    onDisplayOptionsChange({
      ...displayOptions,
      [key]: !displayOptions[key],
    });
  };

  return (
    <div className="space-y-6">
      {/* Основные поля поиска */}
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="clientIdInput">ID</label>
          <input
            type="text"
            id="clientIdInput"
            placeholder="ID клиента"
            value={searchParams.clientNumber || ''}
            onChange={(e) => updateSearchParams('clientNumber', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="innInput">ИНН</label>
          <MaskedInput
            id="innInput"
            mask="999999999999"
            placeholder="Введите ИНН (10 или 12 знаков)"
            value={searchParams.inn}
            onChange={(value) => updateSearchParams('inn', value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ogrnInput">ОГРН</label>
          <MaskedInput
            id="ogrnInput"
            mask="999999999999999"
            placeholder="Введите ОГРН (13 или 15 знаков)"
            value={searchParams.ogrn}
            onChange={(value) => updateSearchParams('ogrn', value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="nameInput">Краткое наименование</label>
          <input
            type="text"
            id="nameInput"
            placeholder="Введите название или часть названия"
            value={searchParams.name || ''}
            onChange={(e) => updateSearchParams('name', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="accountInput">Номер счета</label>
          <MaskedInput
            id="accountInput"
            mask="99999999999999999999"
            placeholder="Введите номер счета (20 знаков)"
            value={searchParams.account}
            onChange={(value) => updateSearchParams('account', value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="fioInput">ФИО (для ИП)</label>
          <input
            type="text"
            id="fioInput"
            placeholder="Введите ФИО для ИП"
            value={searchParams.fio || ''}
            onChange={(e) => updateSearchParams('fio', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="actualDateSearch">Дата актуальности</label>
          <div className="date-input-container">
            <input
              type="date"
              id="actualDateSearch"
              value={searchParams.actualDate || ''}
              onChange={(e) => updateSearchParams('actualDate', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      </div>

      {/* Дополнительные данные для отображения */}
      <div className="section" style={{ marginTop: '20px' }}>
        <h4 style={{ marginBottom: '15px', color: 'var(--primary-blue)' }}>
          <i className="fas fa-cogs"></i> Дополнительные данные
        </h4>

        <h5 style={{ marginBottom: '10px', color: 'var(--dark-gray)' }}>
          Краткий набор:
        </h5>
        <div className="checkbox-group">
          <CheckboxItem
            id="searchShortName"
            label="Наименование"
            checked={displayOptions.searchShortName || false}
            onChange={() => toggleDisplayOption('searchShortName')}
          />
          <CheckboxItem
            id="searchShortInn"
            label="ИНН"
            checked={displayOptions.searchShortInn || false}
            onChange={() => toggleDisplayOption('searchShortInn')}
          />
          <CheckboxItem
            id="searchShortOgrn"
            label="ОГРН"
            checked={displayOptions.searchShortOgrn || false}
            onChange={() => toggleDisplayOption('searchShortOgrn')}
          />
          <CheckboxItem
            id="searchShortKpp"
            label="КПП"
            checked={displayOptions.searchShortKpp || false}
            onChange={() => toggleDisplayOption('searchShortKpp')}
          />
          <CheckboxItem
            id="searchShortAccount"
            label="Счет"
            checked={displayOptions.searchShortAccount || false}
            onChange={() => toggleDisplayOption('searchShortAccount')}
          />
          <CheckboxItem
            id="searchShortRegAddress"
            label="Адрес регистрации"
            checked={displayOptions.searchShortRegAddress || false}
            onChange={() => toggleDisplayOption('searchShortRegAddress')}
          />
          <CheckboxItem
            id="searchShortFactAddress"
            label="Адрес фактический"
            checked={displayOptions.searchShortFactAddress || false}
            onChange={() => toggleDisplayOption('searchShortFactAddress')}
          />
          <CheckboxItem
            id="searchShortCeo"
            label="ЕИО: ФИО"
            checked={displayOptions.searchShortCeo || false}
            onChange={() => toggleDisplayOption('searchShortCeo')}
          />
          <CheckboxItem
            id="searchShortBeneficiary"
            label="Бенефициар: ФИО"
            checked={displayOptions.searchShortBeneficiary || false}
            onChange={() => toggleDisplayOption('searchShortBeneficiary')}
          />
          <CheckboxItem
            id="searchShortRegDate"
            label="Дата регистрации"
            checked={displayOptions.searchShortRegDate || false}
            onChange={() => toggleDisplayOption('searchShortRegDate')}
          />
          <CheckboxItem
            id="searchShortOkved"
            label="ОКВЭД"
            checked={displayOptions.searchShortOkved || false}
            onChange={() => toggleDisplayOption('searchShortOkved')}
          />
        </div>

        <h5 style={{ margin: '20px 0 10px 0', color: 'var(--dark-gray)' }}>
          Расширенный набор:
        </h5>
        <div className="checkbox-group">
          <CheckboxItem
            id="searchExtAccountDetails"
            label="Счет"
            checked={displayOptions.searchExtAccountDetails || false}
            onChange={() => toggleDisplayOption('searchExtAccountDetails')}
          />
          <CheckboxItem
            id="searchExtResidency"
            label="Статус (резидент)"
            checked={displayOptions.searchExtResidency || false}
            onChange={() => toggleDisplayOption('searchExtResidency')}
          />
          <CheckboxItem
            id="searchExtCeoDetails"
            label="ЕИО: полные данные"
            checked={displayOptions.searchExtCeoDetails || false}
            onChange={() => toggleDisplayOption('searchExtCeoDetails')}
          />
          <CheckboxItem
            id="searchExtBeneficiaryDetails"
            label="Бенефициар: полные данные"
            checked={displayOptions.searchExtBeneficiaryDetails || false}
            onChange={() => toggleDisplayOption('searchExtBeneficiaryDetails')}
          />
          <CheckboxItem
            id="searchExtAllOkved"
            label="ОКВЭД (все)"
            checked={displayOptions.searchExtAllOkved || false}
            onChange={() => toggleDisplayOption('searchExtAllOkved')}
          />
          <CheckboxItem
            id="searchExtRelatedPersons"
            label="Связанные лица из БД AML SME"
            checked={displayOptions.searchExtRelatedPersons || false}
            onChange={() => toggleDisplayOption('searchExtRelatedPersons')}
          />
        </div>
      </div>

      {/* Кнопки действий */}
      <div>
        <button onClick={onSearch} disabled={isLoading}>
          <Search size={16} />
          {isLoading ? 'Поиск...' : 'Поиск клиентов'}
        </button>
        <button
          className="btn-secondary"
          onClick={onClear}
          style={{ marginLeft: '10px' }}
        >
          <Eraser size={16} />
          Очистить форму
        </button>
      </div>
    </div>
  );
}
