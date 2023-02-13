import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';

export const RawHeaders = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();
        const rawHeader = req.rawHeaders;

        if(!rawHeader)
            throw new UnauthorizedException('RawHeaders not found (request)');

        return rawHeader;
    }
);