import { Download, Trash2, Mail } from 'lucide-react';
import { ExportOptions } from '@/types';
import { CheckboxItem } from './CheckboxItem';

interface ExportFormProps {
  displayOptions: ExportOptions;
  onDisplayOptionsChange: (options: ExportOptions) => void;
  actualDate: string;
  onActualDateChange: (date: string) => void;
  notifyEmail: string;
  onNotifyEmailChange: (email: string) => void;
  exportItemsCount: number;
  onStartExport: () => void;
  onClearData: () => void;
  isExporting: boolean;
}

export function ExportForm({
  displayOptions,
  onDisplayOptionsChange,
  actualDate,
  onActualDateChange,
  notifyEmail,
  onNotifyEmailChange,
  exportItemsCount,
  onStartExport,
  onClearData,
  isExporting,
}: ExportFormProps) {
  const toggleDisplayOption = (key: keyof ExportOptions) => {
    onDisplayOptionsChange({
      ...displayOptions,
      [key]: !displayOptions[key],
    });
  };

  return (
    <div className="section">
      <h4 style={{ marginBottom: '15px', color: 'var(--primary-blue)' }}>
        <i className="fas fa-cogs"></i> Дополнительные данные
      </h4>

      <h5 style={{ marginBottom: '10px', color: 'var(--dark-gray)' }}>
        Краткий набор:
      </h5>
      <div className="checkbox-group">
        <CheckboxItem
          id="exportShortName"
          label="Наименование"
          checked={displayOptions.exportShortName}
          onChange={() => toggleDisplayOption('exportShortName')}
        />
        <CheckboxItem
          id="exportShortInn"
          label="ИНН"
          checked={displayOptions.exportShortInn}
          onChange={() => toggleDisplayOption('exportShortInn')}
        />
        <CheckboxItem
          id="exportShortOgrn"
          label="ОГРН"
          checked={displayOptions.exportShortOgrn}
          onChange={() => toggleDisplayOption('exportShortOgrn')}
        />
        <CheckboxItem
          id="exportShortKpp"
          label="КПП"
          checked={displayOptions.exportShortKpp}
          onChange={() => toggleDisplayOption('exportShortKpp')}
        />
        <CheckboxItem
          id="exportShortAccount"
          label="Счет"
          checked={displayOptions.exportShortAccount}
          onChange={() => toggleDisplayOption('exportShortAccount')}
        />
        <CheckboxItem
          id="exportShortRegAddress"
          label="Адрес регистрации"
          checked={displayOptions.exportShortRegAddress}
          onChange={() => toggleDisplayOption('exportShortRegAddress')}
        />
        <CheckboxItem
          id="exportShortFactAddress"
          label="Адрес фактический"
          checked={displayOptions.exportShortFactAddress}
          onChange={() => toggleDisplayOption('exportShortFactAddress')}
        />
        <CheckboxItem
          id="exportShortCeo"
          label="ЕИО: ФИО"
          checked={displayOptions.exportShortCeo}
          onChange={() => toggleDisplayOption('exportShortCeo')}
        />
        <CheckboxItem
          id="exportShortBeneficiary"
          label="Бенефициар: ФИО"
          checked={displayOptions.exportShortBeneficiary}
          onChange={() => toggleDisplayOption('exportShortBeneficiary')}
        />
        <CheckboxItem
          id="exportShortRegDate"
          label="Дата регистрации"
          checked={displayOptions.exportShortRegDate}
          onChange={() => toggleDisplayOption('exportShortRegDate')}
        />
        <CheckboxItem
          id="exportShortOkved"
          label="ОКВЭД"
          checked={displayOptions.exportShortOkved}
          onChange={() => toggleDisplayOption('exportShortOkved')}
        />
      </div>

      <h5 style={{ margin: '20px 0 10px 0', color: 'var(--dark-gray)' }}>
        Расширенный набор:
      </h5>
      <div className="checkbox-group">
        <CheckboxItem
          id="exportExtAccountDetails"
          label="Счет"
          checked={displayOptions.exportExtAccountDetails}
          onChange={() => toggleDisplayOption('exportExtAccountDetails')}
        />
        <CheckboxItem
          id="exportExtResidency"
          label="Статус (резидент)"
          checked={displayOptions.exportExtResidency}
          onChange={() => toggleDisplayOption('exportExtResidency')}
        />
        <CheckboxItem
          id="exportExtCeoDetails"
          label="ЕИО: полные данные"
          checked={displayOptions.exportExtCeoDetails}
          onChange={() => toggleDisplayOption('exportExtCeoDetails')}
        />
        <CheckboxItem
          id="exportExtBeneficiaryDetails"
          label="Бенефициар: полные данные"
          checked={displayOptions.exportExtBeneficiaryDetails}
          onChange={() => toggleDisplayOption('exportExtBeneficiaryDetails')}
        />
        <CheckboxItem
          id="exportExtAllOkved"
          label="ОКВЭД (все)"
          checked={displayOptions.exportExtAllOkved}
          onChange={() => toggleDisplayOption('exportExtAllOkved')}
        />
        <CheckboxItem
          id="exportExtRelatedPersons"
          label="Связанные лица из БД AML SME"
          checked={displayOptions.exportExtRelatedPersons}
          onChange={() => toggleDisplayOption('exportExtRelatedPersons')}
        />
      </div>

      {/* Дата актуальности */}
      <div className="form-group" style={{ marginTop: '20px' }}>
        <label htmlFor="actualDateExport">Дата актуальности</label>
        <div className="date-input-container">
          <input
            type="date"
            id="actualDateExport"
            value={actualDate}
            onChange={(e) => onActualDateChange(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {/* Email для уведомления */}
      <div className="form-group" style={{ marginTop: '15px' }}>
        <label htmlFor="notifyEmail">
          <Mail size={14} style={{ marginRight: '5px' }} />
          Email для отправки результата
        </label>
        <input
          type="email"
          id="notifyEmail"
          placeholder="email@example.com"
          value={notifyEmail}
          onChange={(e) => onNotifyEmailChange(e.target.value)}
        />
      </div>

      {/* Кнопки действий */}
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        <button
          onClick={onStartExport}
          disabled={isExporting || exportItemsCount === 0}
        >
          <Download size={16} />
          {isExporting ? 'Выгрузка...' : 'Запустить выгрузку'}
        </button>

        <button
          className="btn-secondary"
          onClick={onClearData}
          disabled={isExporting}
        >
          <Trash2 size={16} />
          Очистить данные
        </button>

        {exportItemsCount > 0 && (
          <div className="result-box info">
            <strong>Готово к выгрузке:</strong> {exportItemsCount} клиентов
          </div>
        )}
      </div>
    </div>
  );
}
