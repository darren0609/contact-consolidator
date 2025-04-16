import { parse } from 'csv-parse';

self.onmessage = async (e) => {
  const { csvData, chunkSize = 1000 } = e.data;

  try {
    // First, notify that parsing is starting
    self.postMessage({
      type: 'progress',
      processed: 0,
      total: 100,
      stage: 'parsing'
    });

    const records = await new Promise((resolve, reject) => {
      parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,
      }, (err, records) => {
        if (err) reject(err);
        else resolve(records);
      });
    });

    // Process in chunks with progress updates
    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      self.postMessage({
        type: 'progress',
        processed: i + chunk.length,
        total: records.length,
        stage: 'processing'
      });
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    self.postMessage({ type: 'complete', records });
  } catch (error) {
    self.postMessage({ type: 'error', error: error.message });
  }
};