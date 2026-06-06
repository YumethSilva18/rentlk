import { UserRole } from '@/common/enums/user-role.enum';

export const ROLES_KEY = 'roles';
export const ALL_ROLES = [UserRole.CUSTOMER, UserRole.OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN];
export const ADMIN_ROLES = [UserRole.ADMIN, UserRole.SUPER_ADMIN];
