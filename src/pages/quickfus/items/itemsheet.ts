import { bindable, IEventAggregator, inject } from "aurelia";
import { db } from "../../../DofusDB/db";

@inject(db)
export class itemsheet {

    @bindable
    public item;


    public constructor(readonly db: db, @IEventAggregator readonly ea: IEventAggregator) {

    }

}