export function formatTimeSpan(seconds: number): string {
	seconds = Math.abs(Math.ceil(seconds));
	let hh = (seconds - seconds % 3600) / 3600;
	let mm = (seconds - seconds % 60) / 60 % 60;
	let ss = seconds % 60;
	const pad = (x: number) => x < 10 ? ("0" + x.toString()) : x.toString();
	return `${hh}:${mm}:${pad(ss)}`;
}
