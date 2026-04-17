import { EquipM, type EquipSlotKey, type OwnedEquip } from '$lib/state/equipment.svelte';
import { EQUIP_REGISTRY } from '$lib/data/equipment';
import { ALL_EQUIPMENT } from '$lib/data/equipment/equipment_table';
import { EQUIP_DROP_LOCATION } from '$lib/data/locations/index';
import {
	type EquipDef,
	type EquipSkillDef,
	type EquipStatBonus,
	type EquipSlot,
	type Rarity,
	EQUIP_CONFIG,
	RARITY_ORDER,
	effective_bonus,
	exp_to_next_level,
	resolve_equip,
	resolve_skill_string,
} from '$lib/data/equipment/equipment_definition';
import type { BasicStats } from '$lib/types';

type SlotDisplay = {
	slot: EquipSlotKey;
	label: string;
	item: OwnedEquip | null;
	def: EquipDef | null;
};

export type SelectedSkillView = {
	skill: EquipSkillDef;
	cond_string: string;
	eff_string: string;
};

type EffectiveBonus = {
	stat: BasicStats;
	target: 'base' | 'multi';
	value: number;
};

export type CodexEntry = {
	def: EquipDef;
	status: 'current' | 'previous' | 'unknown';
	drop_location: string;
};

type EquippedSkillInfo = {
	item_name: string;
	skill_name: string;
	triggers: string;
	chance: number;
	cond_string: string;
	eff_string: string;
};

const SLOT_LABELS: Record<EquipSlotKey, string> = {
	hat: 'Hat',
	top: 'Top',
	bottom: 'Bottom',
	shoes: 'Shoes',
	accessory_1: 'Acc 1',
	accessory_2: 'Acc 2',
};

const SLOT_TO_EQUIP_SLOT: Record<EquipSlotKey, EquipSlot> = {
	hat: 'hat',
	top: 'top',
	bottom: 'bottom',
	shoes: 'shoes',
	accessory_1: 'accessory',
	accessory_2: 'accessory',
};

const SLOT_ORDER: EquipSlotKey[] = ['hat', 'top', 'bottom', 'shoes', 'accessory_1', 'accessory_2'];

export class EquipmentPanelVM {
	selected_item_id: string | null = $state(null);
	selected_source: 'equipped' | 'inventory' | 'codex' | null = $state(null);
	selected_slot: EquipSlotKey | null = $state(null);
	codex_open: boolean = $state(false);
	codex_hide_unlocked: boolean = $state(false);

	get selected_item(): OwnedEquip | null {
		if (!this.selected_item_id) return null;
		return EquipM.get_owned(this.selected_item_id) ?? null;
	}

	get selected_def(): EquipDef | null {
		if (!this.selected_item_id) return null;
		return EQUIP_REGISTRY.get(this.selected_item_id) ?? null;
	}

	get selected_skill_view(): SelectedSkillView | null {
		const def = this.selected_def;
		if (!def) return null;
		const item = this.selected_item;
		const resolved = resolve_equip(def, item?.rarity ?? 'N');
		const skill = resolved.skill;
		if (!skill) return null;
		const values = skill.values ?? {};
		return {
			skill,
			cond_string: resolve_skill_string(skill.cond_string, values),
			eff_string: resolve_skill_string(skill.eff_string, values),
		};
	}

	get selected_codex_stat_bonuses(): EquipStatBonus[] {
		const def = this.selected_def;
		if (!def) return [];
		return resolve_equip(def, 'N').stat_bonuses;
	}

	get selected_effective_bonuses(): EffectiveBonus[] {
		const item = this.selected_item;
		const def = this.selected_def;
		if (!item || !def) return [];
		const resolved = resolve_equip(def, item.rarity);
		return resolved.stat_bonuses.map((b) => ({
			stat: b.stat,
			target: b.target,
			value: effective_bonus(b, item.level, resolved.stat_mult),
		}));
	}

	get selected_exp_progress(): { current: number; needed: number; percent: number } | null {
		const item = this.selected_item;
		if (!item) return null;
		if (item.level >= EQUIP_CONFIG.level_cap) return null;
		const needed = exp_to_next_level(item.level);
		return { current: item.exp, needed, percent: (item.exp / needed) * 100 };
	}

	get selected_is_equipped(): boolean {
		if (!this.selected_item_id) return false;
		return Object.values(EquipM.equipped).includes(this.selected_item_id);
	}

	get selected_equipped_slot(): EquipSlotKey | null {
		if (!this.selected_item_id) return null;
		for (const [slot, id] of Object.entries(EquipM.equipped)) {
			if (id === this.selected_item_id) return slot as EquipSlotKey;
		}
		return null;
	}

	get slot_display(): SlotDisplay[] {
		return SLOT_ORDER.map((slot) => {
			const item = EquipM.get_equipped_in_slot(slot);
			const def = item ? EQUIP_REGISTRY.get(item.equip_id) ?? null : null;
			return { slot, label: SLOT_LABELS[slot], item, def };
		});
	}

	get inventory_list(): { id: string; item: OwnedEquip; def: EquipDef; skill_name: string | null }[] {
		const items: { id: string; item: OwnedEquip; def: EquipDef; skill_name: string | null }[] = [];
		for (const [id, item] of EquipM.inventory) {
			const def = EQUIP_REGISTRY.get(id);
			if (!def) continue;
			const skill_name = resolve_equip(def, item.rarity).skill?.name ?? null;
			items.push({ id, item, def, skill_name });
		}
		// Sort by slot order, then rarity descending, then name
		const slot_order: Record<EquipSlot, number> = { hat: 0, top: 1, bottom: 2, shoes: 3, accessory: 4 };
		items.sort((a, b) => {
			const s = slot_order[a.def.slot] - slot_order[b.def.slot];
			if (s !== 0) return s;
			const r = RARITY_ORDER.indexOf(b.item.rarity) - RARITY_ORDER.indexOf(a.item.rarity);
			if (r !== 0) return r;
			return a.def.name.localeCompare(b.def.name);
		});
		return items;
	}

	get equipped_summary_stats(): Map<BasicStats, { base: number; multi: number }> {
		const stats = new Map<BasicStats, { base: number; multi: number }>();
		for (const item of EquipM.get_all_equipped()) {
			const def = EQUIP_REGISTRY.get(item.equip_id);
			if (!def) continue;
			const resolved = resolve_equip(def, item.rarity);
			for (const b of resolved.stat_bonuses) {
				const value = effective_bonus(b, item.level, resolved.stat_mult);
				const entry = stats.get(b.stat) ?? { base: 0, multi: 0 };
				if (b.target === 'base') entry.base += value;
				else entry.multi += value;
				stats.set(b.stat, entry);
			}
		}
		return stats;
	}

	get equipped_skills(): EquippedSkillInfo[] {
		const skills: EquippedSkillInfo[] = [];
		for (const item of EquipM.get_all_equipped()) {
			const def = EQUIP_REGISTRY.get(item.equip_id);
			if (!def) continue;
			const resolved = resolve_equip(def, item.rarity);
			const skill = resolved.skill;
			if (!skill) continue;
			const values = skill.values ?? {};
			skills.push({
				item_name: def.name,
				skill_name: skill.name,
				triggers: skill.triggers.join(', '),
				chance: skill.chance,
				cond_string: resolve_skill_string(skill.cond_string, values),
				eff_string: resolve_skill_string(skill.eff_string, values),
			});
		}
		return skills;
	}

	is_item_equipped(equip_id: string): boolean {
		return Object.values(EquipM.equipped).includes(equip_id);
	}

	select_equipped(slot: EquipSlotKey): void {
		const item = EquipM.get_equipped_in_slot(slot);
		if (!item) {
			this.clear_selection();
			return;
		}
		if (this.selected_item_id === item.equip_id && this.selected_source === 'equipped') {
			this.clear_selection();
			return;
		}
		this.selected_item_id = item.equip_id;
		this.selected_source = 'equipped';
		this.selected_slot = slot;
	}

	select_inventory(equip_id: string): void {
		if (this.selected_item_id === equip_id && this.selected_source === 'inventory') {
			this.clear_selection();
			return;
		}
		this.selected_item_id = equip_id;
		this.selected_source = 'inventory';
		// Keep selected_slot if it was set from a prior equipped click (for accessory targeting)
	}

	clear_selection(): void {
		this.selected_item_id = null;
		this.selected_source = null;
		this.selected_slot = null;
	}

	do_equip(): void {
		const item = this.selected_item;
		const def = this.selected_def;
		if (!item || !def) return;

		const slot = this._find_target_slot(def);
		if (!slot) return;

		EquipM.equip(item.equip_id, slot);
		this.clear_selection();
	}

	do_unequip(): void {
		const slot = this.selected_equipped_slot;
		if (!slot) return;
		EquipM.unequip(slot);
		this.clear_selection();
	}

	toggle_codex(): void {
		this.codex_open = !this.codex_open;
		if (!this.codex_open) {
			this.codex_hide_unlocked = false;
		}
		this.clear_selection();
	}

	toggle_codex_hide_unlocked(): void {
		this.codex_hide_unlocked = !this.codex_hide_unlocked;
	}

	get codex_list(): CodexEntry[] {
		let entries = ALL_EQUIPMENT.map(def => {
			const in_current = EquipM.has_in_current_run(def.id);
			const ever = EquipM.ever_obtained.has(def.id);
			const status: CodexEntry['status'] = in_current ? 'current' : ever ? 'previous' : 'unknown';
			const drop_location = EQUIP_DROP_LOCATION.get(def.id) ?? '???';
			return { def, status, drop_location };
		});

		if (this.codex_hide_unlocked) {
			entries = entries.filter(e => e.status !== 'current');
		}

		return entries;
	}

	select_codex(equip_id: string): void {
		const entry = this.codex_list.find(e => e.def.id === equip_id);
		if (!entry || entry.status === 'unknown') {
			this.clear_selection();
			return;
		}
		if (this.selected_item_id === equip_id && this.selected_source === 'codex') {
			this.clear_selection();
			return;
		}
		this.selected_item_id = equip_id;
		this.selected_source = 'codex';
	}

	get selected_codex_entry(): CodexEntry | null {
		if (this.selected_source !== 'codex' || !this.selected_item_id) return null;
		return this.codex_list.find(e => e.def.id === this.selected_item_id) ?? null;
	}

	private _find_target_slot(def: EquipDef): EquipSlotKey | null {
		if (def.slot === 'accessory') {
			// Honor a previously clicked accessory slot
			if (this.selected_slot === 'accessory_1' || this.selected_slot === 'accessory_2') {
				return this.selected_slot;
			}
			// Prefer empty slot
			if (!EquipM.equipped.accessory_1) return 'accessory_1';
			if (!EquipM.equipped.accessory_2) return 'accessory_2';
			return 'accessory_1'; // Default: replace slot 1
		}
		// Non-accessory: direct mapping
		for (const [slotKey, equipSlot] of Object.entries(SLOT_TO_EQUIP_SLOT)) {
			if (equipSlot === def.slot) return slotKey as EquipSlotKey;
		}
		return null;
	}
}
