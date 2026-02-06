// Типы клиентов
export type ClientType = "ЮЛ" | "ИП";

// Типы источников данных
export type DataSource = "БД" | "ручной ввод";

// Типы статусов клиентов
export type ClientStatus = "действующий" | "неактивный";

// Типы статусов счетов
export type AccountStatus = "открыт" | "закрыт" | "блокирован";

// Основная информация о клиенте
export interface BaseClient {
  id: number;
  type: ClientType;
  inn: string;
  ogrn: string;
  name: string;
  fullName: string;
  clientNumber: string;
  status: ClientStatus;
  dataSource: DataSource;
}

// Счет
export interface Account {
  number: string;
  status: AccountStatus;
  openDate: string;
  closeDate?: string;
  blockDate?: string;
}

// Адрес
export interface Address {
  regAddress?: string;
  factAddress?: string;
}

// Юридическое лицо
export interface LegalEntity extends BaseClient {
  type: "ЮЛ";
  kpp: string;
  accounts: Account[];
  regAddress: string;
  factAddress: string;
  ceo: string;
  beneficiary: string;
  regDate: string;
  okved: string;
}

// Индивидуальный предприниматель
export interface IndividualEntrepreneur extends BaseClient {
  type: "ИП";
  accounts: Account[];
  regAddress: string;
  factAddress: string;
  ceo: string;
  beneficiary: string;
  regDate: string;
  okved: string;
  fio: string;
}

// Объединенный тип клиента
export type Client = LegalEntity | IndividualEntrepreneur;

// Расширенная информация о ЕИО
export interface CeoDetails {
  fio: string;
  birthDate: string;
  passport: string;
  inn: string;
  isClient: boolean;
  regAddress: string;
  factAddress: string;
}

// Расширенная информация о бенефициаре
export interface BeneficiaryDetails {
  fio: string;
  birthDate: string;
  passport: string;
  inn: string;
  isClient: boolean;
  regAddress: string;
  factAddress: string;
}

// ОКВЭД
export interface Okved {
  code: string;
  name: string;
  isMain: boolean;
}

// Связанное лицо
export interface RelatedPerson {
  id: number;
  type: ClientType | "ФЛ";
  name: string;
  inn: string;
  relation: string;
  isClient: boolean;
  clientLink?: string;
}

// Параметры поиска
export interface SearchParams {
  inn?: string;
  ogrn?: string;
  name?: string;
  clientNumber?: string;
  account?: string;
  fio?: string;
  actualDate?: string;
}

// Опции отображения данных
export interface DisplayOptions {
  // Краткий набор
  searchShortName?: boolean;
  searchShortInn?: boolean;
  searchShortOgrn?: boolean;
  searchShortKpp?: boolean;
  searchShortAccount?: boolean;
  searchShortRegAddress?: boolean;
  searchShortFactAddress?: boolean;
  searchShortCeo?: boolean;
  searchShortBeneficiary?: boolean;
  searchShortRegDate?: boolean;
  searchShortOkved?: boolean;

  // Расширенный набор
  searchExtAccountDetails?: boolean;
  searchExtResidency?: boolean;
  searchExtCeoDetails?: boolean;
  searchExtBeneficiaryDetails?: boolean;
  searchExtAllOkved?: boolean;
  searchExtRelatedPersons?: boolean;
}

// Результат поиска
export interface SearchResult {
  clients: Client[];
  totalCount: number;
  hasMore: boolean;
}

// Элемент для массовой выгрузки
export interface ExportItem {
  inn?: string;
  ogrn?: string;
  account?: string;
  name?: string;
  fio?: string;
  type?: ClientType;
}

// Результат массовой выгрузки
export interface ExportResult {
  totalClients: number;
  successCount: number;
  errorCount: number;
  items: Client[];
  selectedFields: string[];
  actualDate: string;
}
