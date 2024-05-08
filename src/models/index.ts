import { DateTime } from 'luxon'
import _ from 'lodash'

export function convertDateToString(timestamp: string) {
    return DateTime.fromISO(timestamp).toFormat('ccc, MMM d yyyy, h:mm a')
}

export interface PaginatedDocument<T = any> {
    docs: T[]
    totalDocs: number
    limit: number
    totalPages: number
    page: number | null
    pagingCounter: number | null
    hasPrevPage: boolean
    hasNextPage: boolean
    prevPage: number | null
    nextPage: number | null
}