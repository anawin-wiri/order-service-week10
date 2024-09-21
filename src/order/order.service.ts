import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) { }
  create(createOrderDto: CreateOrderDto) {
    const order = new Order();
    order.email = createOrderDto.email;
    order.productId = createOrderDto.productId;
    order.status = 'draft';

    return this.ordersRepository.save(order);;
  }

  findAll() {
    return this.ordersRepository.find();
  }

  findOne(id: number) {
    return this.ordersRepository.findOne({
      where: { id: id },
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.ordersRepository.findOne({
      where: { id: id },
    });
    const updateOrder = { ...order, ...updateOrderDto };
    return this.ordersRepository.save(updateOrder);
  }

  remove(id: number) {
    return this.ordersRepository.delete(id);
  }
}
