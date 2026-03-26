import React, { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { Upload, Plus, FileText } from "lucide-react";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import { exportApi, validationApi } from "@/api/client";
import { ExportItem, ExportResult, ExportOptions } from "@/types";
import { ExportForm } from "@/components/ExportForm";
import { ExportProgress } from "@/components/ExportProgress";
import { ExportResults } from "@/components/ExportResults";

// Функция парсинга XLSX файла
function parseXlsxFile(file: File): Promise<ExportItem[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const items: ExportItem[] = (jsonData as Record<string, unknown>[])
          .map((row) => {
            const item: ExportItem = {};

            // Маппинг полей из Excel
            const inn = row["ИНН"] || row["inn"] || row["INN"];
            const ogrn = row["ОГРН"] || row["ogrn"] || row["OGRN"];
            const account =
              row["Счет"] || row["account"] || row["Расчетный счет"];
            const name =
              row["Наименование"] || row["name"] || row["Краткое наименование"];

            if (inn) item.inn = String(inn);
            if (ogrn) item.ogrn = String(ogrn);
            if (account) item.account = String(account);
            if (name) item.name = String(name);

            // Определение типа
            if (item.inn) {
              item.type = item.inn.length === 10 ? "ЮЛ" : "ИП";
            }

            return item;
          })
          .filter((item) => item.inn || item.ogrn || item.account || item.name);

        resolve(items);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Ошибка чтения файла"));
    reader.readAsBinaryString(file);
  });
}

export function ExportPage() {
  const [exportItems, setExportItems] = useState<ExportItem[]>([]);
  const [displayOptions, setDisplayOptions] = useState<ExportOptions>({
    // Краткий набор
    exportShortName: true,
    exportShortInn: true,
    exportShortOgrn: true,
    exportShortKpp: true,
    exportShortAccount: true,
    exportShortRegAddress: true,
    exportShortFactAddress: true,
    exportShortCeo: true,
    exportShortBeneficiary: true,
    exportShortRegDate: true,
    exportShortOkved: true,

    // Расширенный набор
    exportExtAccountDetails: false,
    exportExtResidency: false,
    exportExtCeoDetails: false,
    exportExtBeneficiaryDetails: false,
    exportExtAllOkved: false,
    exportExtRelatedPersons: true,
  });
  const [actualDate, setActualDate] = useState<string>("");
  const [notifyEmail, setNotifyEmail] = useState<string>(() => {
    return localStorage.getItem("notifyEmail") || "";
  });
  const [manualData, setManualData] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);

  // Сохранение email в localStorage при изменении
  const handleNotifyEmailChange = (email: string) => {
    setNotifyEmail(email);
    localStorage.setItem("notifyEmail", email);
  };

  // Мутация для массовой выгрузки
  const massExportMutation = useMutation({
    mutationFn: (params: {
      items: ExportItem[];
      options: ExportOptions;
      actualDate?: string;
      notifyEmail?: string;
    }) =>
      exportApi.massExport(
        params.items,
        params.options,
        params.actualDate,
        params.notifyEmail,
      ),
    onSuccess: (data) => {
      setExportResult(data);
      setIsExporting(false);
      setProgress(100);
      toast.success("Массовая выгрузка завершена успешно");
    },
    onError: (error: unknown) => {
      setIsExporting(false);
      setProgress(0);
      const errorMessage =
        error instanceof Error ? error.message : "Неизвестная ошибка";
      toast.error(`Ошибка при выгрузке: ${errorMessage}`);
    },
  });

  // Обработка загрузки файла
  const handleFileUpload = useCallback(async (file: File) => {
    try {
      // Парсим XLSX локально
      const items = await parseXlsxFile(file);

      // Сохраняем в локальный стейт (НЕ отправляем на бэк)
      setExportItems((prev) => [...prev, ...items]);

      toast.success(
        `Файл "${file.name}" успешно обработан. Добавлено клиентов: ${items.length}`,
      );
      setSelectedFile(null);
    } catch (error) {
      toast.error("Ошибка при обработке файла");
      console.error("File upload error:", error);
    }
  }, []);

  // Обработка drag & drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (
        file &&
        (file.name.endsWith(".xlsx") ||
          file.name.endsWith(".xls") ||
          file.name.endsWith(".csv"))
      ) {
        handleFileUpload(file);
      } else {
        toast.error("Поддерживаются только файлы Excel и CSV");
      }
    },
    [handleFileUpload],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Парсинг ручных данных
  const handleParseManualData = () => {
    if (!manualData.trim()) {
      toast.error("Введите данные для парсинга");
      return;
    }

    const lines = manualData
      .trim()
      .split("\n")
      .filter((line) => line.trim());
    let addedCount = 0;
    const newItems: ExportItem[] = [];

    lines.forEach((line) => {
      const item: ExportItem = {};

      // Парсинг различных форматов ввода
      const innMatch = line.match(/ИНН:\s*(\d+)/);
      const ogrnMatch = line.match(/ОГРН:\s*(\d+)/);
      const accountMatch = line.match(/Счет:\s*(\d+)/);
      const nameMatch = line.match(/Краткое наименование:\s*(.+)/);
      const fioMatch = line.match(/ФИО:\s*(.+)/);

      if (innMatch) item.inn = innMatch[1];
      if (ogrnMatch) item.ogrn = ogrnMatch[1];
      if (accountMatch) item.account = accountMatch[1];
      if (nameMatch) item.name = nameMatch[1].trim();
      if (fioMatch) item.fio = fioMatch[1].trim();

      if (Object.keys(item).length > 0) {
        item.type = item.inn ? (item.inn.length === 10 ? "ЮЛ" : "ИП") : "ЮЛ";
        newItems.push(item);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      setExportItems((prev) => [...prev, ...newItems]);
      toast.success(`Успешно добавлено клиентов: ${addedCount}`);
      setManualData("");
    } else {
      toast.error("Не удалось распознать данные. Проверьте формат ввода.");
    }
  };

  // Запуск массовой выгрузки
  const handleStartExport = async () => {
    if (exportItems.length === 0) {
      toast.error("Добавьте клиентов для выгрузки");
      return;
    }

    // Валидация даты
    if (actualDate) {
      const dateValidation = validationApi.validateDate(actualDate);
      if (!dateValidation.isValid) {
        toast.error(dateValidation.error || "Некорректная дата");
        return;
      }
    }

    setIsExporting(true);
    setProgress(0);
    setExportResult(null);

    // Симуляция прогресса
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return newProgress;
      });
    }, 300);

    // Запуск выгрузки
    try {
      await massExportMutation.mutateAsync({
        items: exportItems,
        options: displayOptions,
        actualDate: actualDate || undefined,
        notifyEmail: notifyEmail || undefined,
      });
    } catch {
      clearInterval(progressInterval);
      setProgress(0);
    }
  };

  // Скачивание результата
  const handleDownloadResult = async () => {
    if (!exportResult) return;

    try {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportResult.items);
      XLSX.utils.book_append_sheet(wb, ws, "Результат выгрузки");

      const fileName = `client_data_export_${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.success("Файл скачан успешно");
    } catch (error) {
      toast.error("Ошибка при скачивании файла");
      console.error("Download error:", error);
    }
  };

  // Очистка данных
  const handleClearData = () => {
    setExportItems([]);
    setSelectedFile(null);
    setExportResult(null);
    setProgress(0);
    setManualData("");
    toast.success("Данные очищены");
  };

  return (
    <div className="space-y-6">
      {/* Загрузка файла */}
      <div className="section">
        <h3 className="section-title">
          <Upload size={20} />
          Загрузка файла с входными данными
        </h3>

        <div
          className="file-upload"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <FileText
            size={48}
            style={{ color: "var(--primary-blue)", marginBottom: "15px" }}
          />
          <p>Перетащите файл сюда или нажмите для выбора</p>
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--dark-gray)",
              marginTop: "10px",
            }}
          >
            Поддерживаемые форматы: XLS, XLSX, CSV
          </p>
          <input
            id="file-input"
            type="file"
            accept=".xls,.xlsx,.csv"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
          {selectedFile && (
            <div className="file-name">Выбран файл: {selectedFile.name}</div>
          )}
        </div>
      </div>

      {/* Ручной ввод данных */}
      <div className="section">
        <h3 className="section-title">
          <Plus size={20} />
          Ручной ввод данных
        </h3>

        <div className="form-group">
          <label htmlFor="manualDataInput">
            Входные данные (каждый клиент с новой строки)
          </label>
          <textarea
            id="manualDataInput"
            rows={8}
            placeholder="Формат ввода:
ИНН: 7713123456
ИНН: 123456789012, Счет: 40817810099910004312
ОГРН: 1027700132195, Краткое наименование: РОМАШКА"
            value={manualData}
            onChange={(e) => setManualData(e.target.value)}
          />
        </div>

        <button onClick={handleParseManualData}>
          <Plus size={16} />
          Добавить данные
        </button>
      </div>

      {/* Настройки экспорта */}
      <ExportForm
        displayOptions={displayOptions}
        onDisplayOptionsChange={setDisplayOptions}
        actualDate={actualDate}
        onActualDateChange={setActualDate}
        notifyEmail={notifyEmail}
        onNotifyEmailChange={handleNotifyEmailChange}
        exportItemsCount={exportItems.length}
        onStartExport={handleStartExport}
        onClearData={handleClearData}
        isExporting={isExporting}
      />

      {/* Прогресс выгрузки */}
      {isExporting && <ExportProgress progress={progress} />}

      {/* Результаты выгрузки */}
      {exportResult && (
        <ExportResults
          result={exportResult}
          onDownload={handleDownloadResult}
        />
      )}

      {/* Информация о загруженных данных */}
      {exportItems.length > 0 && !exportResult && (
        <div className="section">
          <h3 className="section-title">
            <i className="fas fa-info-circle"></i>
            Загруженные данные
          </h3>

          <div className="result-box info">
            <p>
              <strong>Количество клиентов:</strong> {exportItems.length}
            </p>
            <div style={{ marginTop: "10px" }}>
              <strong>Предварительный просмотр:</strong>
              <div style={{ marginTop: "5px", fontSize: "0.9rem" }}>
                {exportItems.slice(0, 5).map((item, index) => (
                  <div key={index} style={{ marginBottom: "5px" }}>
                    {item.inn ||
                      item.ogrn ||
                      item.account ||
                      item.name ||
                      item.fio}
                  </div>
                ))}
                {exportItems.length > 5 && (
                  <div
                    style={{ fontStyle: "italic", color: "var(--dark-gray)" }}
                  >
                    ... и еще {exportItems.length - 5} клиентов
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
