import { injectable } from 'tsyringe';
import { sqlServerPool100916 } from '../../config/database/sqlServer.config';

@injectable()
export class PosNameService {
    private posNameCache: Map<string, string> = new Map();

    constructor() {}

    async getPosName(posCode: string): Promise<string> {
        const cachedName = this.posNameCache.get(posCode);
        if (cachedName) {
            return cachedName;
        }

        try {
            const pool = await sqlServerPool100916;
            const result = await pool.request()
                .input('posCode', posCode)
                .query('SELECT POSName FROM pos WHERE POSCode = @posCode');

            if (result.recordset.length > 0) {
                const posName = result.recordset[0].POSName;
                this.posNameCache.set(posCode, posName);
                return posName;
            }

            return posCode;
        } catch (err) {
            console.error(`Error fetching POS name for code ${posCode} from SQL Server:`, err);
            return posCode;
        }
    }

    async clearCache(): Promise<void> {
        this.posNameCache.clear();
    }
} 