import { AnimationTemplate } from "../../types/AnimationTemplate";
import { GameEventType } from "./GameEventType";

export interface FlushPipeEvent {
	type: GameEventType.FlushPipe;
	animationTemplate: AnimationTemplate;
}