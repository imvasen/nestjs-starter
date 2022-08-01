import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Timezone {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  name: string;
}
