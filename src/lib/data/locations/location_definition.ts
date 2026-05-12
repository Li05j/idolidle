import type { BasicStats, Reward } from '$lib/types';
import type { EquipDropTable } from '$lib/data/equipment/equipment_definition';

export type ActionKind = 'training' | 'earning' | 'spending' | 'special';

export type ActionDef = {
    name: string;
    desc: string;
    base_time: number;
    kind: ActionKind;
    uses?: number;
    /** Action name to share a mastery pool with (typically the un-upgraded base action). */
    mastery_id?: string;

    rewards: Reward[];
    costs?: { stat: BasicStats; amount: number }[];
    equip_drops?: EquipDropTable;
    no_drops?: boolean;

    requires?: {
        text: string;
        /** Returns true when the prereq is satisfied (action is enabled). */
        is_met: () => boolean;
    };

    on_complete?: {
        fn: () => void;
        /** Short description of what the on_complete bonus does, shown in tooltip. */
        desc?: string;
    };

    /** When truthy, the action is filtered out of the action list entirely. Distinct from `requires` (which only disables). */
    hidden?: () => boolean;

    /** Marks the action as a one-shot button: clicking opens a confirm modal, then runs `fn`. No timer, rewards, mastery, or drops. */
    instant?: {
        confirm: { title: string; body: string };
        fn: () => void;
    };
};

export type UpgradeDef = {
    /** Name of the action whose completion fires this upgrade. Must have `uses` set. */
    trigger: string;
    /** Replacement LocationDef installed under the base's name when the upgrade fires. */
    upgrade_to: LocationDef;
    on_trigger?: () => void;
};

export type LocationDef = {
    name: string;
    desc: string;
    base_time: number;
    rewards: Reward[];
    equip_drops?: EquipDropTable;
    requires?: {
        text: string;
        is_met: () => boolean;
    };
    /** Returns child locations to unlock on arrival. Function form defers evaluation to avoid circular imports. */
    unlocks: () => LocationDef[];
    actions: ActionDef[];
    upgrades?: UpgradeDef[];
};
