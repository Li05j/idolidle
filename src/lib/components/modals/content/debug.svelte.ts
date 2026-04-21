import {
	CURRENT_PRESET,
	PRESET_NAMES,
	switch_preset_and_restart,
	restart_game,
	type PresetName,
} from "$lib/config";

export class DebugVM {
	staged = $state<PresetName>(CURRENT_PRESET);
	readonly current: PresetName = CURRENT_PRESET;
	readonly options: PresetName[] = PRESET_NAMES;

	get can_apply() {
		return this.staged !== this.current;
	}

	apply() {
		if (!this.can_apply) return;
		switch_preset_and_restart(this.staged);
	}

	restart() {
		if (!window.confirm("Restart game? All progress will be lost.")) return;
		restart_game();
	}
}
