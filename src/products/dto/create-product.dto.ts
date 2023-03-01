import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";


export class CreateProductDto {

    @ApiProperty({
        description: 'Product title (unique)',
        nullable: false,
        minLength: 1
      })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty()
    @IsString({ each: true }) //each: true hace referencia a que todos los elementos de este arreglo deben cumplir la condicion de que debe ser de tipo string
    @IsArray()
    sizes: string[];

    @ApiProperty()
    @IsIn(['men','woman','kid','unisex']) //este decorrador dice que este ditio sera tipo de lo que este en este arreglo que tendra men, woman, ...
    gender: string;

    @ApiProperty()
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    tags: string[];

    @ApiProperty()
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    images?: string[];
}

// Aqui se estara utilizando las librerias class-validator y class-transformer
// npm install class-validator class-transformer