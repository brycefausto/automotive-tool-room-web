export interface PropsWithId {
  id: string
}

export interface ParamsWithId {
  params: {
    id: string
  }
}

export interface SearchParamsQuery {
  searchParams: {
    page?: number,
    limit?: number,
    q?: string,
    category?: string
  }
}

export interface PropsWithData<T = any> {
  data: T
}

export interface SelectOption {
  label: string
  value: string
}