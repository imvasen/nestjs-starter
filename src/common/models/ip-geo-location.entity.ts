import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import { Country } from '@/common/models/country.entity';
import { State } from '@/common/models/state.entity';
import { City } from '@/common/models/city.entity';

export enum IPVersion {
  v4 = 'v4',
  v6 = 'v6',
}

@Entity({ name: 'ip_geo_location' })
export class IpGeoLocation {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: string;

  @Exclude()
  @CreateDateColumn({ name: 'registration_date' })
  registrationDate: Date;

  /**
   * For IPv6 using FFFF:FFFF:FFFF:: "mask", for IPv4 using 255.255.255.0.
   */
  @Column({ name: 'prefix', type: 'varchar', unique: true })
  prefixOrBlock: string;

  @Column({ name: 'ip_version', type: 'varchar', enum: IPVersion })
  version: IPVersion;

  @Exclude()
  @ManyToOne(() => Country, { nullable: true, eager: true })
  @JoinColumn({ name: 'country_id', referencedColumnName: 'id' })
  country?;

  @Exclude()
  @ManyToOne(() => State, { nullable: true, eager: true })
  @JoinColumn({ name: 'state_id', referencedColumnName: 'id' })
  state?;

  @Exclude()
  @ManyToOne(() => City, { nullable: true, eager: true })
  @JoinColumn({ name: 'city_id', referencedColumnName: 'id' })
  city?;

  @Expose()
  get location() {
    const { country, state, city } = this;
    return { country, state, city };
  }
}
