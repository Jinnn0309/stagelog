import { ShowRecord } from "../types";

const STORAGE_KEY = 'stagelog_records';

export const getRecords = (): ShowRecord[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveRecord = (record: ShowRecord) => {
  const records = getRecords();
  const updatedRecords = [...records, record];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
};

export const updateRecord = (updatedRecord: ShowRecord) => {
  const records = getRecords();
  const index = records.findIndex(r => r.id === updatedRecord.id);
  if (index !== -1) {
    records[index] = updatedRecord;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }
};

export const deleteRecord = (id: string) => {
  const records = getRecords();
  const updatedRecords = records.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
};

// Helper to calculate stats
export const getStatsForMonth = (year: number, month: number) => {
  const records = getRecords();
  const filtered = records.filter(r => {
    const d = new Date(r.date);
    return d.getFullYear() === year && d.getMonth() === month && r.status === 'watched';
  });

  return {
    records: filtered,
    totalSpent: filtered.reduce((acc, curr) => acc + curr.price, 0),
    totalShows: filtered.length,
  };
};