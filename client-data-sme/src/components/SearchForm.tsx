import { Search, Eraser } from "lucide-react";
import { SearchParams, DisplayOptions } from "@/types";
import { MaskedInput } from "./MaskedInput";

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
            value={searchParams.clientNumber || ""}
            onChange={(e) => updateSearchParams("clientNumber", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="innInput">ИНН</label>
          <MaskedInput
            id="innInput"
            mask="999999999999"
            placeholder="Введите ИНН (10 или 12 знаков)"
            value={searchParams.inn}
            onChange={(value) => updateSearchParams("inn", value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ogrnInput">ОГРН</label>
          <MaskedInput
            id="ogrnInput"
            mask="999999999999999"
            placeholder="Введите ОГРН (13 или 15 знаков)"
            value={searchParams.ogrn}
            onChange={(value) => updateSearchParams("ogrn", value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="nameInput">Краткое наименование</label>
          <input
            type="text"
            id="nameInput"
            placeholder="Введите название или часть названия"
            value={searchParams.name || ""}
            onChange={(e) => updateSearchParams("name", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="accountInput">Номер счета</label>
          <MaskedInput
            id="accountInput"
            mask="99999999999999999999"
            placeholder="Введите номер счета (20 знаков)"
            value={searchParams.account}
            onChange={(value) => updateSearchParams("account", value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="fioInput">ФИО (для ИП)</label>
          <input
            type="text"
            id="fioInput"
            placeholder="Введите ФИО для ИП"
            value={searchParams.fio || ""}
            onChange={(e) => updateSearchParams("fio", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="actualDateSearch">Дата актуальности</label>
          <div className="date-input-container">
            <input
              type="date"
              id="actualDateSearch"
              value={searchParams.actualDate || ""}
              onChange={(e) => updateSearchParams("actualDate", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Дополнительные данные для отображения */}
      <div className="section" style={{ marginTop: "20px" }}>
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
              id="searchShortName"
              checked={displayOptions.searchShortName || false}
              onChange={() => toggleDisplayOption("searchShortName")}
            />
            <label htmlFor="searchShortName">Наименование</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="searchShortInn"
              checked={displayOptions.searchShortInn || false}
              onChange={() => toggleDisplayOption("searchShortInn")}
            />
            <label htmlFor="searchShortInn">ИНН</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="searchShortOgrn"
              checked={displayOptions.searchShortOgrn || false}
              onChange={() => toggleDisplayOption("searchShortOgrn")}
            />
            <label htmlFor="searchShortOgrn">ОГРН</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="searchShortKpp"
              checked={displayOptions.searchShortKpp || false}
              onChange={() => toggleDisplayOption("searchShortKpp")}
            />
            <label htmlFor="searchShortKpp">КПП</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="searchShortAccount"
              checked={displayOptions.searchShortAccount || false}
              onChange={() => toggleDisplayOption("searchShortAccount")}
            />
            <label htmlFor="searchShortAccount">Счет</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="searchShortRegAddress"
              checked={displayOptions.searchShortRegAddress || false}
              onChange={() => toggleDisplayOption("searchShortRegAddress")}
            />
            <label htmlFor="searchShortRegAddress">Адрес регистрации</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="searchShortFactAddress"
              checked={displayOptions.searchShortFactAddress || false}
              onChange={() => toggleDisplayOption("searchShortFactAddress")}
            />
            <label htmlFor="searchShortFactAddress">Адрес фактический</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="searchShortCeo"
              checked={displayOptions.searchShortCeo || false}
              onChange={() => toggleDisplayOption("searchShortCeo")}
            />
            <label htmlFor="searchShortCeo">ЕИО: ФИО</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="searchShortBeneficiary"
              checked={displayOptions.searchShortBeneficiary || false}
              onChange={() => toggleDisplayOption("searchShortBeneficiary")}
            />
            <label htmlFor="searchShortBeneficiary">Бенефициар: ФИО</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="searchShortRegDate"
              checked={displayOptions.searchShortRegDate || false}
              onChange={() => toggleDisplayOption("searchShortRegDate")}
            />
            <label htmlFor="searchShortRegDate">Дата регистрации</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="searchShortOkved"
              checked={displayOptions.searchShortOkved || false}
              onChange={() => toggleDisplayOption("searchShortOkved")}
            />
            <label htmlFor="searchShortOkved">ОКВЭД</label>
          </div>
        </div>

        <h5 style={{ margin: "20px 0 10px 0", color: "var(--dark-gray)" }}>
          Расширенный набор:
        </h5>
        <div className="checkbox-group">
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="searchExtAccountDetails"
              checked={displayOptions.searchExtAccountDetails || false}
              onChange={() => toggleDisplayOption("searchExtAccountDetails")}
            />
            <label htmlFor="searchExtAccountDetails">Счет</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="searchExtResidency"
              checked={displayOptions.searchExtResidency || false}
              onChange={() => toggleDisplayOption("searchExtResidency")}
            />
            <label htmlFor="searchExtResidency">Статус (резидент)</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="searchExtCeoDetails"
              checked={displayOptions.searchExtCeoDetails || false}
              onChange={() => toggleDisplayOption("searchExtCeoDetails")}
            />
            <label htmlFor="searchExtCeoDetails">ЕИО: полные данные</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="searchExtBeneficiaryDetails"
              checked={displayOptions.searchExtBeneficiaryDetails || false}
              onChange={() =>
                toggleDisplayOption("searchExtBeneficiaryDetails")
              }
            />
            <label htmlFor="searchExtBeneficiaryDetails">
              Бенефициар: полные данные
            </label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="searchExtAllOkved"
              checked={displayOptions.searchExtAllOkved || false}
              onChange={() => toggleDisplayOption("searchExtAllOkved")}
            />
            <label htmlFor="searchExtAllOkved">ОКВЭД (все)</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="searchExtRelatedPersons"
              checked={displayOptions.searchExtRelatedPersons || false}
              onChange={() => toggleDisplayOption("searchExtRelatedPersons")}
            />
            <label htmlFor="searchExtRelatedPersons">
              Связанные лица из БД AML SME
            </label>
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div>
        <button onClick={onSearch} disabled={isLoading}>
          <Search size={16} />
          {isLoading ? "Поиск..." : "Поиск клиентов"}
        </button>
        <button
          className="btn-secondary"
          onClick={onClear}
          style={{ marginLeft: "10px" }}
        >
          <Eraser size={16} />
          Очистить форму
        </button>
      </div>
    </div>
  );
}
