import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class Delegation {
    constructor(props?: Partial<Delegation>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    delegator!: string

    @Column_("text", {nullable: false})
    space!: string

    @Column_("text", {nullable: false})
    delegate!: string

    @Column_("int4", {nullable: false})
    timestamp!: number
}
