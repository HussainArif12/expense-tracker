import { hexy } from './generateRandomColor'

export const mapRecordToChartData = (
  record: Record<string, number> | undefined,
) =>
  record
    ? Object.entries(record).map(([name, value]) => ({
        name,
        value,
        color: hexy(),
      }))
    : undefined
