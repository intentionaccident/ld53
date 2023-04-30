import { AnimationTemplate } from "./AnimationTemplate";
import { Pipe } from "../Pipe";

export interface AnimationInstance {
	template: AnimationTemplate;
	overflow: number;
	activePipes: Pipe[];
}
