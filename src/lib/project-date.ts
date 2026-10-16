const PROJECT_MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function toProjectMonthInput(value: string | null | undefined) {
  return value?.match(/^\d{4}-\d{2}/)?.[0] ?? "";
}

export function fromProjectMonthInput(value: string) {
  return value ? `${value}-01` : null;
}

export function formatProjectMonth(value: string) {
  const month = toProjectMonthInput(value);
  if (!month) return value;

  return PROJECT_MONTH_FORMATTER.format(new Date(`${month}-01T00:00:00Z`));
}

export function formatProjectTimeline(
  start: string | null | undefined,
  end: string | null | undefined,
) {
  if (start && end) {
    return `${formatProjectMonth(start)} — ${formatProjectMonth(end)}`;
  }

  if (start) return `Started ${formatProjectMonth(start)}`;
  if (end) return `Completed ${formatProjectMonth(end)}`;
  return null;
}
