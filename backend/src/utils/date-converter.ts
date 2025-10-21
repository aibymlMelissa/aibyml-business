export class DateConverter {
  static toISOString(date: Date | string | null | undefined): string | undefined {
    if (!date) return undefined;
    if (typeof date === 'string') return date;
    return date.toISOString();
  }

  static fromISOString(isoString: string | null | undefined): Date | undefined {
    if (!isoString) return undefined;
    return new Date(isoString);
  }

  static convertServiceRequestDates(request: any): any {
    return {
      ...request,
      createdAt: this.toISOString(request.created_at || request.createdAt),
      updatedAt: this.toISOString(request.updated_at || request.updatedAt),
      registeredAt: this.toISOString(request.registered_at || request.registeredAt),
      classifiedAt: this.toISOString(request.classified_at || request.classifiedAt),
      fulfilledAt: this.toISOString(request.fulfilled_at || request.fulfilledAt),
      closedAt: this.toISOString(request.closed_at || request.closedAt),
      // Remove database column names
      created_at: undefined,
      updated_at: undefined,
      registered_at: undefined,
      classified_at: undefined,
      fulfilled_at: undefined,
      closed_at: undefined
    };
  }
}