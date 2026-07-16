import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InventoryController } from './inventory.controller'
import { InventoryService } from './services/inventory.service'
import { Inventory } from './entities/inventory.entity'
import { InventoryAudit } from './entities/inventory-audit.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, InventoryAudit])],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
