import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";
import { META_ROLES, RoleProtected } from './role-protected.decorator';
import { AuthGuard } from "@nestjs/passport";
import { UserRoleGuard } from "../guards/user-role/user-role.guard";
import { ValidRoles } from "../interfaces";


export const Auth = (...roles: ValidRoles[]) => {
    return applyDecorators(
        RoleProtected( ...roles),
        UseGuards(AuthGuard(), UserRoleGuard)
    );
}