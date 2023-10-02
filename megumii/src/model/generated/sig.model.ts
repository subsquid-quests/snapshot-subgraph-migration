import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Sig {
    constructor(props?: Partial<Sig>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    owner!: string

    @Column_("text", {nullable: false})
    approvedHash!: string

    @Column_("text", {nullable: false})
    handler!: string

    @Column_("text", {nullable: false})
    guard!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    threshold!: bigint

    @Column_("text", {nullable: false})
    initiator!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    payment!: bigint

    @Column_("text", {nullable: false})
    sender!: string

    @Column_("text", {array: true, nullable: false})
    owners!: (string | undefined | null)[]

    @Column_("text", {nullable: false})
    proxy!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    value!: bigint

    @Column_("text", {nullable: false})
    initializer!: string

    @Column_("text", {nullable: false})
    fallbackHandler!: string

    @Column_("text", {nullable: false})
    txHash!: string

    @Column_("text", {nullable: false})
    module!: string

    @Column_("bytea", {nullable: false})
    account!: Uint8Array

    @Column_("text", {nullable: false})
    msgHash!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    timestamp!: bigint
}
