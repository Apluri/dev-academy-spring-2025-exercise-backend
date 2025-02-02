export type QueryFilter<T> = {
  [key in keyof T]?: (string | null)[];
};

export type SortCriteria<T> = {
  [key in keyof T]?: "asc" | "desc";
};

export type QueryParams<T> = {
  pageStart?: number;
  pageSize?: number;
  filters?: QueryFilter<T>;
  sorting?: SortCriteria<T>[];
};

export type MetaData = {
  pageStart?: number;
  pageSize?: number;
  totalRowCount: number;
};
