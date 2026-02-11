import { Download, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { ExportResult } from "@/types";

interface ExportResultsProps {
  result: ExportResult;
  onDownload: () => void;
}

export function ExportResults({ result, onDownload }: ExportResultsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU");
  };

  const getSuccessRate = () => {
    return Math.round((result.successCount / result.totalClients) * 100);
  };

  return (
    <div className="section">
      <h3 className="section-title">
        <CheckCircle size={20} />
        Результаты выгрузки
      </h3>

      {/* Основные результаты */}
      <div className="result-box success">
        <h4>
          <i className="fas fa-check-circle"></i> Выгрузка завершена
        </h4>
        <div className="form-grid">
          <div>
            <strong>Всего клиентов:</strong> {result.totalClients}
          </div>
          <div>
            <strong>Успешно обработано:</strong> {result.successCount}
          </div>
          <div>
            <strong>Ошибок:</strong> {result.errorCount}
          </div>
          <div>
            <strong>Процент успеха:</strong> {getSuccessRate()}%
          </div>
          <div>
            <strong>Выбранных полей:</strong> {result.selectedFields.length}
          </div>
          <div>
            <strong>Дата актуальности:</strong> {formatDate(result.actualDate)}
          </div>
        </div>
      </div>

      {/* Детализация по статусам */}
      <div className="result-box info">
        <h4>
          <FileText size={16} /> Детализация результатов
        </h4>

        <div style={{ display: "grid", gap: "15px", marginTop: "15px" }}>
          {/* Успешные */}
          <div
            style={{
              padding: "15px",
              background: "rgba(16, 185, 129, 0.1)",
              borderRadius: "8px",
              borderLeft: "4px solid var(--success-color)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong style={{ color: "var(--success-color)" }}>
                  <CheckCircle size={16} style={{ marginRight: "8px" }} />
                  Успешно обработано
                </strong>
              </div>
              <div
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "var(--success-color)",
                }}
              >
                {result.successCount}
              </div>
            </div>
            <div
              style={{
                fontSize: "0.9rem",
                color: "var(--dark-gray)",
                marginTop: "5px",
              }}
            >
              Данные клиентов успешно извлечены и включены в выгрузку
            </div>
          </div>

          {/* Ошибки */}
          {result.errorCount > 0 && (
            <div
              style={{
                padding: "15px",
                background: "rgba(239, 68, 68, 0.1)",
                borderRadius: "8px",
                borderLeft: "4px solid var(--danger-color)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong style={{ color: "var(--danger-color)" }}>
                    <AlertCircle size={16} style={{ marginRight: "8px" }} />
                    Ошибки
                  </strong>
                </div>
                <div
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "var(--danger-color)",
                  }}
                >
                  {result.errorCount}
                </div>
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "var(--dark-gray)",
                  marginTop: "5px",
                }}
              >
                Клиенты не найдены в базе данных или содержат некорректные
                данные
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Информация о выбранных полях */}
      <div className="result-box info">
        <h4>
          <i className="fas fa-list"></i> Выбранные поля для выгрузки
        </h4>
        <div style={{ marginTop: "10px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "10px",
            }}
          >
            {result.selectedFields.map((field, index) => (
              <div
                key={index}
                style={{
                  padding: "8px 12px",
                  background: "white",
                  borderRadius: "4px",
                  border: "1px solid var(--medium-gray)",
                  fontSize: "0.9rem",
                }}
              >
                {field}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Кнопка скачивания */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={onDownload}
          className="btn-success"
          style={{ padding: "16px 32px", fontSize: "1.1rem" }}
        >
          <Download size={20} />
          Скачать результат
        </button>
      </div>

      {/* Дополнительная информация */}
      <div className="result-box warning" style={{ marginTop: "20px" }}>
        <h4>
          <i className="fas fa-info-circle"></i> Информация
        </h4>
        <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>Файл будет скачан в формате Excel (.xlsx)</li>
          <li>Результат содержит только успешно обработанные записи</li>
          <li>
            Для повторной выгрузки с другими параметрами, очистите данные и
            добавьте новые
          </li>
          <li>Максимальное время хранения результата: 24 часа</li>
        </ul>
      </div>
    </div>
  );
}
