import type { BasicStats, Reward } from '$lib/types';
import type { EquipDropTable } from '$lib/data/equipment/equipment_definition';

export type ActionKind = 'training' | 'earning' | 'spending';

export type ActionDef = {
    name: string;
    desc: string;
    base_time: number;
    kind: ActionKind;
    uses?: number;
    mastery_id?: string;

    rewards: Reward[];
    costs?: { stat: BasicStats; amount: number }[];
    equip_drops?: EquipDropTable;
    no_drops?: boolean;

    requires?: {
        text: string;
        check: () => boolean;
    };

    on_complete?: {
        fn: () => void;
        hint?: string;
    };
};

export type UpgradeDef = {
    trigger: ActionDef;
    remove_actions?: ActionDef[];
    add_actions?: ActionDef[];
    replace_all?: boolean;
    on_trigger?: () => void;
};

export type LocationDef = {
    name: string;
    desc: string;
    base_time: number;
    hint?: string;
    rewards: Reward[];
    equip_drops?: EquipDropTable;
    requires?: {
        text: string;
        check: () => boolean;
    };
    unlocks: () => LocationDef[];
    actions: ActionDef[];
    upgrades?: UpgradeDef[];
};
