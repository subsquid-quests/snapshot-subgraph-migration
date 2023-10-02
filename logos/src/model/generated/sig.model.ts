import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class Sig {
    constructor(props?: Partial<Sig>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    account!: string

    @Column_("text", {nullable: false})
    msgHash!: string

    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date
}
