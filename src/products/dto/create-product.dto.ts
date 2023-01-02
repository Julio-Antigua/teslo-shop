import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";


export class CreateProductDto {

    @IsString()
    @MinLength(1)
    title: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @IsString({ each: true }) //each: true hace referencia a que todos los elementos de este arreglo deben cumplir la condicion de que debe ser de tipo string
    @IsArray()
    sizes: string[];

    @IsIn(['men','woman','kid','unisex']) //este decorrador dice que este ditio sera tipo de lo que este en este arreglo que tendra men, woman, ...
    gender: string;
}

// Aqui se estara utilizando las librerias class-validator y class-transformer
// npm install class-validator class-transformer