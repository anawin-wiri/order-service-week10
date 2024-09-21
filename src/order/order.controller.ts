import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ClientProxy, Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { stat } from 'fs';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @Inject('INVENTORY_SERVICE') private inventoryService: ClientProxy,
  ) { }
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const newOrder = await this.orderService.create(createOrderDto);
    this.inventoryService.emit('order_created', newOrder);
    return newOrder;
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }

  @MessagePattern('order_completed')
  async handdleOrderComplete(@Payload() data: any, @Ctx() context: RmqContext) {
    const chanel = context.getChannelRef();
    const originalMsg = context.getMessage();
    data.status = 'complete';
    await this.orderService.update(data.id, data);
    chanel.ack(originalMsg);
  }

  @MessagePattern('order_canceled')
  async handdleOrderCancel(@Payload() data: any, @Ctx() context: RmqContext) {
    const chanel = context.getChannelRef();
    const originalMsg = context.getMessage();
    data.status = 'cancel';
    await this.orderService.update(data.id, data);
    chanel.ack(originalMsg);
  }
}