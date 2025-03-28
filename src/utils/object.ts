export const objectToQueryString = (
  params: Record<string, unknown> | undefined,
): string => {
  const queryParts: string[] = [];

  if (!params) return '';

  Object.entries(params).forEach(([key, initialValue]) => {
    const value =
      typeof initialValue === 'boolean' || typeof initialValue === 'number'
        ? JSON.stringify(initialValue)
        : initialValue;
    const isObject = initialValue?.constructor === Object;

    if (!value) return;
    if (isObject) throw new Error(`객체는 올 수 없습니다.`);

    if (Array.isArray(value)) {
      const uniqueValue = Array.from(new Set(value));
      queryParts.push(`${key}=${uniqueValue.join(`&${key}=`)}`);
      return;
    }
    queryParts.push(`${key}=${value}`);
  });

  return queryParts.length ? `?${queryParts.join('&')}` : '';
};
