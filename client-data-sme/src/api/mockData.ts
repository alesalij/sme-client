import { Client, RelatedPerson, SearchParams } from "@/types";

// Тестовые данные для демонстрации
export const mockClients: Client[] = [
  {
    id: 1,
    type: "ЮЛ",
    inn: "7713123456",
    ogrn: "1027700132195",
    name: 'ООО "РОМАШКА"',
    fullName: 'Общество с ограниченной ответственностью "РОМАШКА"',
    kpp: "771401001",
    clientNumber: "CL001234",
    status: "действующий",
    dataSource: "БД",
    accounts: [
      {
        number: "40702810123456789012",
        status: "открыт",
        openDate: "2020-01-15",
      },
      {
        number: "40702810123456789013",
        status: "закрыт",
        openDate: "2019-01-15",
        closeDate: "2026-06-30",
      },
    ],
    regAddress: "г. Москва, ул. Ленина, д. 1",
    factAddress: "г. Москва, ул. Пушкина, д. 10",
    ceo: "Иванов Иван Иванович",
    beneficiary: "Петров Петр Петрович",
    regDate: "2019-12-01",
    okved: "62.01 - Разработка компьютерного программного обеспечения",
  },
  {
    id: 2,
    type: "ЮЛ",
    inn: "7713987654",
    ogrn: "1027700132196",
    name: 'ООО "РОМАШКА ПЛЮС"',
    fullName: 'Общество с ограниченной ответственностью "РОМАШКА ПЛЮС"',
    kpp: "771401002",
    clientNumber: "CL001235",
    status: "действующий",
    dataSource: "ручной ввод",
    accounts: [
      {
        number: "40702810987654321098",
        status: "открыт",
        openDate: "2022-05-20",
      },
    ],
    regAddress: "г. Москва, ул. Тверская, д. 15",
    factAddress: "г. Москва, ул. Тверская, д. 15",
    ceo: "Сидоров Сидор Сидорович",
    beneficiary: "Сидоров Сидор Сидорович",
    regDate: "2022-05-01",
    okved:
      "62.02 - Деятельность по оказанию услуг в области информационных технологий",
  },
  {
    id: 3,
    type: "ИП",
    inn: "123456789012",
    ogrn: "321774600401362",
    name: "Иванов Иван Иванович",
    fullName: "Иванов Иван Иванович",
    clientNumber: "CL005678",
    status: "действующий",
    dataSource: "БД",
    fio: "Иванов Иван Иванович",
    accounts: [
      {
        number: "40817810099910004312",
        status: "открыт",
        openDate: "2021-03-10",
      },
    ],
    regAddress: "г. Санкт-Петербург, пр. Невский, д. 28",
    factAddress: "г. Санкт-Петербург, пр. Невский, д. 28",
    ceo: "Иванов Иван Иванович",
    beneficiary: "Иванов Иван Иванович",
    regDate: "2021-03-01",
    okved:
      "47.91.2 - Торговля розничная, осуществляемая непосредственно при помощи информационно-коммуникационной сети Интернет",
  },
  {
    id: 4,
    type: "ИП",
    inn: "987654321098",
    ogrn: "321774600401363",
    name: "Петров Петр Петрович",
    fullName: "Петров Петр Петрович",
    clientNumber: "CL005679",
    status: "неактивный",
    dataSource: "БД",
    fio: "Петров Петр Петрович",
    accounts: [
      {
        number: "40817810099910004313",
        status: "закрыт",
        openDate: "2020-01-01",
        closeDate: "2026-01-01",
      },
    ],
    regAddress: "г. Екатеринбург, ул. Ленина, д. 50",
    factAddress: "г. Екатеринбург, ул. Ленина, д. 50",
    ceo: "Петров Петр Петрович",
    beneficiary: "Петров Петр Петрович",
    regDate: "2019-12-01",
    okved:
      "45.20.1 - Техническое обслуживание и ремонт легковых автомобилей и легких грузовых автомобилей",
  },
];

export const mockRelatedPersons: RelatedPerson[] = [
  {
    id: 1,
    type: "ФЛ",
    name: "Иванов Иван Иванович",
    inn: "123456789012",
    relation: "Единоличный исполнительный орган",
    isClient: true,
    clientLink: "http://dca.rccf.ru:8080/client-data-service?id=123",
  },
  {
    id: 2,
    type: "ИП",
    name: "Петров Петр Петрович",
    inn: "987654321098",
    relation: "Бенефициарный владелец",
    isClient: false,
    clientLink: undefined,
  },
  {
    id: 3,
    type: "ФЛ",
    name: "Сидоров Сидор Сидорович",
    inn: "456789123456",
    relation: "Связанное лицо",
    isClient: true,
    clientLink: "http://dca.rccf.ru:8080/client-data-service?id=456",
  },
];

// Функция для поиска клиентов (тестовая)
export function mockSearchClients(params: SearchParams) {
  let filteredClients = [...mockClients];

  // Фильтрация по ИНН
  if (params.inn) {
    filteredClients = filteredClients.filter((client) =>
      client.inn.includes(params.inn as string),
    );
  }

  // Фильтрация по ОГРН
  if (params.ogrn) {
    filteredClients = filteredClients.filter((client) =>
      client.ogrn.includes(params.ogrn as string),
    );
  }

  // Фильтрация по названию
  if (params.name) {
    filteredClients = filteredClients.filter(
      (client) =>
        client.name
          .toLowerCase()
          .includes((params.name as string).toLowerCase()) ||
        client.fullName
          .toLowerCase()
          .includes((params.name as string).toLowerCase()),
    );
  }

  // Фильтрация по номеру клиента
  if (params.clientNumber) {
    filteredClients = filteredClients.filter((client) =>
      client.clientNumber.includes(params.clientNumber as string),
    );
  }

  // Фильтрация по счету
  if (params.account) {
    filteredClients = filteredClients.filter((client) =>
      client.accounts.some((account) =>
        account.number.includes(params.account as string),
      ),
    );
  }

  // Фильтрация по ФИО (для ИП)
  if (params.fio) {
    filteredClients = filteredClients.filter(
      (client) =>
        client.type === "ИП" &&
        client.fio
          ?.toLowerCase()
          .includes((params.fio as string).toLowerCase()),
    );
  }

  return {
    clients: filteredClients,
    totalCount: filteredClients.length,
    hasMore: false,
  };
}

// Функция для получения связанных лиц (тестовая)
export function mockGetRelatedPersons(inn: string): RelatedPerson[] {
  return mockRelatedPersons.filter(
    (person) => person.inn !== inn, // Исключаем самого клиента
  );
}
