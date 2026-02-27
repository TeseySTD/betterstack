import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('software')
export class Software {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    categoryId: number;

    @Column()
    name: string;

    @Column()
    websiteUrl: string;

    @Column({ type: 'jsonb', default: {} })
    features: Record<number, any>;
}