import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('criteria')
export class Criterion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column({ type: 'int', default: 0 })
    weight: number;
}