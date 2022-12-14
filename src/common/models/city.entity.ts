import { Expose, Transform } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { State } from '@/common/models/state.entity';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  longitude: string;

  @Column()
  latitude: string;

  @Expose({ name: 'stateId' })
  @Transform(({ value }) => value.id)
  @ManyToOne(() => State, { eager: true })
  @JoinColumn({ name: 'state_id', referencedColumnName: 'id' })
  state: State;
}
