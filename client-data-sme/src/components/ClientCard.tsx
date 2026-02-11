import { Client, DisplayOptions } from "@/types";
import { Building, User } from "lucide-react";

interface ClientCardProps {
  client: Client;
  displayOptions: DisplayOptions;
  isSelected: boolean;
  onSelect: (client: Client) => void;
}

export function ClientCard({
  client,
  displayOptions,
  isSelected,
  onSelect,
}: ClientCardProps) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "действующий":
        return "status-success";
      case "неактивный":
        return "status-warning";
      default:
        return "status-info";
    }
  };

  const getDataSourceClass = (source: string) => {
    return source === "БД" ? "status-info" : "status-warning";
  };

  // Формируем дополнительную информацию в зависимости от выбранных опций отображения
  const getAdditionalInfo = () => {
    const infoParts: string[] = [];

    if (displayOptions.searchShortOgrn && client.ogrn) {
      infoParts.push(`ОГРН: ${client.ogrn}`);
    }
    if (displayOptions.searchShortKpp && "kpp" in client && client.kpp) {
      infoParts.push(`КПП: ${client.kpp}`);
    }
    if (displayOptions.searchShortAccount && client.accounts.length > 0) {
      infoParts.push(`Счетов: ${client.accounts.length}`);
    }
    if (displayOptions.searchShortRegAddress) {
      infoParts.push("Адрес регистрации: есть");
    }
    if (displayOptions.searchShortRegDate) {
      infoParts.push("Дата регистрации: есть");
    }
    if (displayOptions.searchShortOkved) {
      infoParts.push("ОКВЭД: есть");
    }
    if (displayOptions.searchExtResidency) {
      infoParts.push("Резидент РФ");
    }

    return infoParts.join(" | ");
  };

  return (
    <div
      className={`client-item ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(client)}
    >
      <div className="client-icon">
        {client.type === "ЮЛ" ? <Building size={20} /> : <User size={20} />}
      </div>

      <div className="client-details">
        <div className="client-name">{client.name}</div>
        <div className="client-inn">
          <i className="fas fa-fingerprint"></i> ИНН: {client.inn} |
          <i className="fas fa-id-card"></i> Тип: {client.type} |
          <i className="fas fa-info-circle"></i> Статус: {client.status}
          {getAdditionalInfo() && ` | ${getAdditionalInfo()}`}
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <span className={`status-badge ${getStatusClass(client.status)}`}>
          {client.status}
        </span>
        <span
          className={`status-badge ${getDataSourceClass(client.dataSource)}`}
        >
          {client.dataSource}
        </span>
      </div>
    </div>
  );
}
