import { IsNotEmpty, IsNumber } from "class-validator";

import { Transform } from "class-transformer";

export class idDto {
    @IsNotEmpty()
    @IsNumber()
    @Transform((param) => parseInt(param.value))
    id: number;
}
