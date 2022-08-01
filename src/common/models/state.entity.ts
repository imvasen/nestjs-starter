import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Country } from '@/common/models/country.entity';
import { City } from '@/common/models/city.entity';

@Entity()
export class State {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ name: 'code' })
  code: string;

  @Column({ nullable: true })
  type: string | null;

  @Column({ nullable: true })
  longitude?: string;

  @Column({ nullable: true })
  latitude?: string;

  @ManyToOne(() => Country, { eager: true })
  @JoinColumn({ name: 'country_id', referencedColumnName: 'id' })
  country: Country;

  @OneToMany(() => City, (city) => city.state, { cascade: true })
  cities: City[];
}
