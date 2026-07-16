import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsString,
  IsEnum,
  MaxLength,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { CreateOrderItemDto } from './create-order-item.dto'

/**
 * Create Order DTO
 */
export class CreateOrderDto {
  @IsEnum(['dine_in', 'takeout', 'delivery'])
  @IsNotEmpty()
  orderType: 'dine_in' | 'takeout' | 'delivery'

  @IsOptional()
  @IsUUID()
  customerId?: string

  @IsOptional()
  @IsUUID()
  locationId?: string

  @IsOptional()
  @IsString()
  @MaxLength(50)
  tableNumber?: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[]
}
