import { Loader } from "lucide-react";

interface ExportProgressProps {
  progress: number;
}

export function ExportProgress({ progress }: ExportProgressProps) {
  return (
    <div className="section">
      <h3 className="section-title">
        <i className="fas fa-spinner"></i>
        Прогресс выгрузки
      </h3>

      <div className="loading">
        <Loader
          size={50}
          style={{
            color: "var(--primary-blue)",
            animation: "spin 1s linear infinite",
          }}
        />

        <div
          className="progress-bar"
          style={{
            margin: "20px auto",
            maxWidth: "400px",
          }}
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <p style={{ marginTop: "15px" }}>
          <strong>Прогресс:</strong> {Math.floor(progress)}%
        </p>

        {progress < 100 && (
          <div
            style={{
              fontSize: "0.9rem",
              color: "var(--dark-gray)",
              marginTop: "10px",
            }}
          >
            Обработка клиентских данных...
          </div>
        )}

        {progress >= 100 && (
          <div
            style={{
              fontSize: "0.9rem",
              color: "var(--success-color)",
              marginTop: "10px",
            }}
          >
            Выгрузка завершена!
          </div>
        )}
      </div>
    </div>
  );
}
