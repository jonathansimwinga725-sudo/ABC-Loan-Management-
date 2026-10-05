import type { TenantContext } from "../domain/types.js";

export class TenantAccessError extends Error {
  constructor(message = "Tenant access denied") {
    super(message);
    this.name = "TenantAccessError";
  }
}

/**
 * Domain/repository methods should receive this context from authenticated
 * server-side session data. Never construct it from an organisationId in a
 * request body or query string.
 */
export function requireRole(context: TenantContext, allowed: string[]): void {
  if (!context.roleCodes.some((role) => allowed.includes(role))) {
    throw new TenantAccessError("Your role is not allowed to perform this action.");
  }
}
