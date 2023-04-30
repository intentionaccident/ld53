import { AnimationTemplate } from "./AnimationTemplate";
import { Pipe } from "../Pipe";

export interface AnimationInstance {
	template: AnimationTemplate;
	flow: number;
	activePipes: Pipe[];
}
