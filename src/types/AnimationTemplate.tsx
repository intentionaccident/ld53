import { Pipe } from "../Pipe";
import { Node } from '../dijkstraGraph'
import {SinkFeature, SourceFeature} from "./RoomFeature";

export interface AnimationTemplate {
	path: Pipe[];
	gloop: number;
	target: SourceFeature | SinkFeature
}
