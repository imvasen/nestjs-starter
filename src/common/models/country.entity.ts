import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Timezone } from '@/common/models/timezone.entity';
import { State } from '@/common/models/state.entity';

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'iso_alpha_3', type: 'varchar', unique: true })
  isoAlpha3: string;

  @Column({ name: 'iso_alpha_2', type: 'varchar', unique: true })
  isoAlpha2: string;

  @Column({ name: 'iso_numeric', type: 'varchar', unique: true })
  isoNumeric: string;

  @Column({ name: 'name_native', nullable: true })
  nameNative?: string;

  @Column({ name: 'phone_code', type: 'varchar' })
  phoneCode: string;

  @Column()
  capital: string;

  // Currency abbreviation
  @Column({ name: 'currency', type: 'varchar' })
  currency: string;

  @Column({ name: 'currency_name', type: 'varchar' })
  currencyName: string;

  @Column({ name: 'currency_symbol', type: 'varchar' })
  currencySymbol: string;

  @Column({ type: 'varchar' })
  flag: string;

  @Column()
  region: string;

  @Column()
  subregion: string;

  @Column()
  longitude: string;

  @Column()
  latitude: string;

  @OneToMany(() => State, (state) => state.country, { cascade: true })
  @JoinColumn()
  states: State[];

  @ManyToMany(() => Timezone, { cascade: true })
  @JoinTable({
    name: 'country_timezone',
    joinColumn: { name: 'country_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'timezone_id', referencedColumnName: 'id' },
  })
  timezones: Timezone[];
}
