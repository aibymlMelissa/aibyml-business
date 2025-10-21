import { DatabaseConnection } from '../../database/connection.js';

interface LogProcessingData {
  requestId: string;
  engineName: string;
  engineType: 'classification' | 'handling';
  inputData: any;
  outputData: any;
  confidenceScore?: number;
  processingTimeMs?: number;
  success: boolean;
  errorMessage?: string;
}

export class AIProcessingRepository {
  private db = DatabaseConnection.getInstance();

  async logProcessing(data: LogProcessingData): Promise<void> {
    const query = `
      INSERT INTO ai_processing_logs (
        request_id, engine_name, engine_type, input_data, output_data,
        confidence_score, processing_time_ms, success, error_message
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    
    const values = [
      data.requestId,
      data.engineName,
      data.engineType,
      JSON.stringify(data.inputData),
      JSON.stringify(data.outputData),
      data.confidenceScore,
      data.processingTimeMs,
      data.success,
      data.errorMessage
    ];

    await this.db.query(query, values);
  }

  async getProcessingHistory(requestId: string): Promise<any[]> {
    const query = `
      SELECT * FROM ai_processing_logs 
      WHERE request_id = $1 
      ORDER BY created_at ASC
    `;
    
    const result = await this.db.query(query, [requestId]);
    return result.rows.map(row => ({
      ...row,
      inputData: JSON.parse(row.input_data),
      outputData: JSON.parse(row.output_data)
    }));
  }
}