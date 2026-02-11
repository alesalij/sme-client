import React from "react";
import { Client, DisplayOptions } from "@/types";
import {
  MapPin,
  CreditCard,
  Calendar,
  List,
  UserCheck,
  Crown,
  ExternalLink,
} from "lucide-react";

interface ClientDetailsProps {
  client: Client;
  displayOptions: DisplayOptions;
}

export function ClientDetails({ client, displayOptions }: ClientDetailsProps) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "действующий":
        return "success";
      case "неактивный":
        return "warning";
      default:
        return "info";
    }
  };

  const getDataSourceClass = (source: string) => {
    return source === "БД" ? "info" : "warning";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU");
  };

  const getAccountStatusClass = (status: string) => {
    switch (status) {
      case "открыт":
        return "success";
      case "закрыт":
        return "danger";
      case "блокирован":
        return "warning";
      default:
        return "info";
    }
  };

  // Расширенная информация
  const getExtendedInfoHTML = (): React.ReactElement[] => {
    const infoParts: React.ReactElement[] = [];

    // Детальная информация по счетам
    if (displayOptions.searchExtAccountDetails) {
      infoParts.push(
        <div key="account-details" className="result-box info">
          <h4>
            <CreditCard size={16} /> Детальная информация по счетам
          </h4>
          {client.accounts.map((account, index) => (
            <div
              key={index}
              style={{
                margin: "10px 0",
                padding: "10px",
                background: "white",
                borderRadius: "4px",
                borderLeft: "4px solid var(--primary-blue)",
              }}
            >
              <strong>{account.number}</strong> -
              <span
                className={`status-badge status-${getAccountStatusClass(account.status)}`}
              >
                {account.status}
              </span>
              {account.openDate && (
                <>
                  <br />
                  <Calendar size={14} /> Дата открытия:{" "}
                  {formatDate(account.openDate)}
                </>
              )}
              {account.closeDate && (
                <>
                  <br />
                  <Calendar size={14} /> Дата закрытия:{" "}
                  {formatDate(account.closeDate)}
                </>
              )}
              {account.blockDate && (
                <>
                  <br />
                  <Calendar size={14} /> Дата блокировки:{" "}
                  {formatDate(account.blockDate)}
                </>
              )}
            </div>
          ))}
        </div>,
      );
    }

    // Статус резидентности
    if (displayOptions.searchExtResidency) {
      infoParts.push(
        <div key="residency" className="result-box info">
          <h4>
            <ExternalLink size={16} /> Статус резидентности
          </h4>
          <p>
            <strong>Статус:</strong>{" "}
            <span className="status-badge status-success">Резидент РФ</span>
          </p>
        </div>,
      );
    }

    // Детальная информация по ЕИО
    if (displayOptions.searchExtCeoDetails) {
      infoParts.push(
        <div key="ceo-details" className="result-box info">
          <h4>
            <UserCheck size={16} /> Детальная информация по ЕИО
          </h4>
          <p>
            <strong>ФИО:</strong> {client.ceo}
          </p>
          <p>
            <strong>Дата рождения:</strong> 15.03.1975
          </p>
          <p>
            <strong>Паспорт:</strong> 1234 567890
          </p>
          <p>
            <strong>ИНН:</strong> 123456789012
          </p>
          <p>
            <strong>Статус:</strong>{" "}
            <span className="status-badge status-success">Клиент банка</span>
          </p>
          <p>
            <strong>Адрес регистрации:</strong> г. Москва, ул. Ленина, д. 1
          </p>
          <p>
            <strong>Фактический адрес:</strong> г. Москва, ул. Пушкина, д. 10
          </p>
        </div>,
      );
    }

    // Детальная информация по бенефициару
    if (displayOptions.searchExtBeneficiaryDetails) {
      infoParts.push(
        <div key="beneficiary-details" className="result-box info">
          <h4>
            <Crown size={16} /> Детальная информация по бенефициару
          </h4>
          <p>
            <strong>ФИО:</strong> {client.beneficiary}
          </p>
          <p>
            <strong>Дата рождения:</strong> 22.07.1978
          </p>
          <p>
            <strong>Паспорт:</strong> 9876 543210
          </p>
          <p>
            <strong>ИНН:</strong> 987654321098
          </p>
          <p>
            <strong>Статус:</strong>{" "}
            <span className="status-badge status-warning">Не клиент банка</span>
          </p>
          <p>
            <strong>Адрес регистрации:</strong> г. Санкт-Петербург, пр. Невский,
            д. 28
          </p>
          <p>
            <strong>Фактический адрес:</strong> г. Санкт-Петербург, пр. Невский,
            д. 28
          </p>
        </div>,
      );
    }

    // Все виды деятельности (ОКВЭД)
    if (displayOptions.searchExtAllOkved) {
      infoParts.push(
        <div key="all-okved" className="result-box info">
          <h4>
            <List size={16} /> Все виды деятельности (ОКВЭД)
          </h4>
          <ul style={{ marginLeft: "20px" }}>
            <li>
              <strong>62.01</strong> - Разработка компьютерного программного
              обеспечения (основной)
            </li>
            <li>
              <strong>62.02</strong> - Деятельность по оказанию услуг в области
              информационных технологий
            </li>
            <li>
              <strong>63.11.1</strong> - Деятельность по созданию и
              использованию баз данных и информационных ресурсов
            </li>
          </ul>
        </div>,
      );
    }

    return infoParts;
  };

  return (
    <div className="section">
      <h3 className="section-title">
        <i className="fas fa-info-circle"></i>
        Детали клиента
      </h3>

      {/* Основная информация */}
      <div className={`result-box ${getStatusClass(client.status)}`}>
        <h4>
          <i className="fas fa-info-circle"></i> Основная информация
        </h4>
        <div className="form-grid">
          <div>
            <strong>Тип клиента:</strong> {client.type}
          </div>
          <div>
            <strong>Наименование:</strong> {client.fullName}
          </div>
          <div>
            <strong>ИНН:</strong> {client.inn}
          </div>
          <div>
            <strong>ОГРН:</strong> {client.ogrn}
          </div>
          {"kpp" in client && client.kpp && (
            <div>
              <strong>КПП:</strong> {client.kpp}
            </div>
          )}
          <div>
            <strong>Номер клиента:</strong> {client.clientNumber}
          </div>
          <div>
            <strong>Статус:</strong>{" "}
            <span
              className={`status-badge status-${getStatusClass(client.status)}`}
            >
              {client.status}
            </span>
          </div>
          <div>
            <strong>Источник данных:</strong>{" "}
            <span
              className={`status-badge status-${getDataSourceClass(client.dataSource)}`}
            >
              {client.dataSource}
            </span>
          </div>
        </div>
      </div>

      {/* Адреса */}
      {(displayOptions.searchShortRegAddress ||
        displayOptions.searchShortFactAddress) && (
        <div className="result-box info">
          <h4>
            <MapPin size={16} /> Адреса
          </h4>
          {displayOptions.searchShortRegAddress && (
            <p>
              <strong>Адрес регистрации:</strong> {client.regAddress}
            </p>
          )}
          {displayOptions.searchShortFactAddress && (
            <p>
              <strong>Фактический адрес:</strong> {client.factAddress}
            </p>
          )}
        </div>
      )}

      {/* Финансовая информация */}
      <div className="result-box info">
        <h4>
          <CreditCard size={16} /> Финансовая информация
        </h4>
        {displayOptions.searchShortRegDate && (
          <p>
            <strong>Дата регистрации:</strong> {formatDate(client.regDate)}
          </p>
        )}
        {displayOptions.searchShortOkved && (
          <p>
            <strong>Основной ОКВЭД:</strong> {client.okved}
          </p>
        )}

        <div style={{ marginTop: "10px" }}>
          <strong>Счета:</strong>
          {client.accounts.map((account, index) => (
            <div
              key={index}
              style={{
                margin: "5px 0",
                padding: "5px",
                background: "white",
                borderRadius: "4px",
              }}
            >
              <strong>{account.number}</strong> -
              <span
                className={`status-badge status-${getAccountStatusClass(account.status)}`}
              >
                {account.status}
              </span>
              {account.openDate && (
                <>
                  <br />
                  Дата открытия: {formatDate(account.openDate)}
                </>
              )}
              {account.closeDate && (
                <>
                  <br />
                  Дата закрытия: {formatDate(account.closeDate)}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Управляющие лица */}
      <div className="result-box info">
        <h4>
          <UserCheck size={16} /> Управляющие лица
        </h4>
        {displayOptions.searchShortCeo && (
          <p>
            <strong>ЕИО:</strong> {client.ceo}
          </p>
        )}
        {displayOptions.searchShortBeneficiary && (
          <p>
            <strong>Бенефициар:</strong> {client.beneficiary}
          </p>
        )}
      </div>

      {/* Расширенная информация */}
      {getExtendedInfoHTML()}
    </div>
  );
}
