import Papa from "papaparse";

export interface CsvData {
  headers: string[];
  /**
   * Represents sample rows from the CSV file. Each inner array is a row, and each string is a cell value.
   * For example, `[["Alice", "30"], ["Bob", "24"]]`
   */
  sampleRows: string[][];
}

export const extractCsvData = (file: File): Promise<CsvData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = (results.meta.fields || []).map((field) =>
          field.trim()
        );
        const allRows = results.data as string[][];
        const sampleRows: string[][] = [];

        if (allRows.length <= 4) {
          sampleRows.push(...allRows);
        } else {
          const step = (allRows.length - 1) / 3;
          for (let i = 0; i < 4; i++) {
            sampleRows.push(allRows[Math.floor(i * step)]);
          }
        }

        console.log("CSV Headers:", headers);
        console.log("CSV Sample Rows:", sampleRows);

        resolve({ headers, sampleRows });
      },
      error: (error) => {
        console.error("Error parsing CSV:", error.message);
        reject(error);
      },
    });
  });
};
