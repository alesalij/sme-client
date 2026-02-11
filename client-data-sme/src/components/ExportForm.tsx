import { Download, Trash2 } from "lucide-react";
import { ExportOptions } from "@/types";

interface ExportFormProps {
  displayOptions: ExportOptions;
  onDisplayOptionsChange: (options: ExportOptions) => void;
  actualDate: string;
  onActualDateChange: (date: string) => void;
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
      <h4 style={{ marginBottom: "15px", color: "var(--primary-blue)" }}>
        <i className="fas fa-cogs"></i> Дополнительные данные
      </h4>

      <h5 style={{ marginBottom: "10px", color: "var(--dark-gray)" }}>
        Краткий набор:
      </h5>
      <div className="checkbox-group">
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="exportShortName"
            checked={displayOptions.exportShortName}
            onChange={() => toggleDisplayOption("exportShortName")}
          />
          <label htmlFor="exportShortName">Наименование</label>
        </div>
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="exportShortInn"
            checked={displayOptions.exportShortInn}
            onChange={() => toggleDisplayOption("exportShortInn")}
          />
          <label htmlFor="exportShortInn">ИНН</label>
        </div>
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="exportShortOgrn"
            checked={displayOptions.exportShortOgrn}
            onChange={() => toggleDisplayOption("exportShortOgrn")}
          />
          <label htmlFor="exportShortOgrn">ОГРН</label>
        </div>
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="exportShortKpp"
            checked={displayOptions.exportShortKpp}
            onChange={() => toggleDisplayOption("exportShortKpp")}
          />
          <label htmlFor="exportShortKpp">КПП</label>
        </div>
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="exportShortAccount"
            checked={displayOptions.exportShortAccount}
            onChange={() => toggleDisplayOption("exportShortAccount")}
          />
          <label htmlFor="exportShortAccount">Счет</label>
        </div>
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="exportShortRegAddress"
            checked={displayOptions.exportShortRegAddress}
            onChange={() => toggleDisplayOption("exportShortRegAddress")}
          />
          <label htmlFor="exportShortRegAddress">Адрес регистрации</label>
        </div>
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="exportShortFactAddress"
            checked={displayOptions.exportShortFactAddress}
            onChange={() => toggleDisplayOption("exportShortFactAddress")}
          />
          <label htmlFor="exportShortFactAddress">Адрес фактический</label>
        </div>
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="exportShortCeo"
            checked={displayOptions.exportShortCeo}
            onChange={() => toggleDisplayOption("exportShortCeo")}
          />
          <label htmlFor="exportShortCeo">ЕИО: ФИО</label>
        </div>
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="exportShortBeneficiary"
            checked={displayOptions.exportShortBeneficiary}
            onChange={() => toggleDisplayOption("exportShortBeneficiary")}
          />
          <label htmlFor="exportShortBeneficiary">Бенефициар: ФИО</label>
        </div>
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="exportShortRegDate"
            checked={displayOptions.exportShortRegDate}
            onChange={() => toggleDisplayOption("exportShortRegDate")}
          />
          <label htmlFor="exportShortRegDate">Дата регистрации</label>
        </div>
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="exportShortOkved"
            checked={displayOptions.exportShortOkved}
            onChange={() => toggleDisplayOption("exportShortOkved")}
          />
          <label htmlFor="exportShortOkved">ОКВЭД</label>
        </div>
      </div>

      <h5 style={{ margin: "20px 0 10px 0", color: "var(--dark-gray)" }}>
        Расширенный набор:
      </h5>
      <div className="checkbox-group">
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="exportExtAccountDetails"
            checked={displayOptions.exportExtAccountDetails}
            onChange={() => toggleDisplayOption("exportExtAccountDetails")}
          />
          <label htmlFor="exportExtAccountDetails">Счет</label>
        </div>
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="exportExtResidency"
            checked={displayOptions.exportExtResidency}
            onChange={() => toggleDisplayOption("exportExtResidency")}
          />
          <label htmlFor="exportExtResidency">Статус (резидент)</label>
        </div>
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="exportExtCeoDetails"
            checked={displayOptions.exportExtCeoDetails}
            onChange={() => toggleDisplayOption("exportExtCeoDetails")}
          />
          <label htmlFor="exportExtCeoDetails">ЕИО: полные данные</label>
        </div>
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="exportExtBeneficiaryDetails"
            checked={displayOptions.exportExtBeneficiaryDetails}
            onChange={() => toggleDisplayOption("exportExtBeneficiaryDetails")}
          />
          <label htmlFor="exportExtBeneficiaryDetails">
            Бенефициар: полные данные
          </label>
        </div>
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="exportExtAllOkved"
            checked={displayOptions.exportExtAllOkved}
            onChange={() => toggleDisplayOption("exportExtAllOkved")}
          />
          <label htmlFor="exportExtAllOkved">ОКВЭД (все)</label>
        </div>
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="exportExtRelatedPersons"
            checked={displayOptions.exportExtRelatedPersons}
            onChange={() => toggleDisplayOption("exportExtRelatedPersons")}
          />
          <label htmlFor="exportExtRelatedPersons">
            Связанные лица из БД AML SME
          </label>
        </div>
      </div>

      {/* Дата актуальности */}
      <div className="form-group" style={{ marginTop: "20px" }}>
        <label htmlFor="actualDateExport">Дата актуальности</label>
        <div className="date-input-container">
          <input
            type="date"
            id="actualDateExport"
            value={actualDate}
            onChange={(e) => onActualDateChange(e.target.value)}
          />
        </div>
      </div>

      {/* Кнопки действий */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <button
          onClick={onStartExport}
          disabled={isExporting || exportItemsCount === 0}
        >
          <Download size={16} />
          {isExporting ? "Выгрузка..." : "Запустить выгрузку"}
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
