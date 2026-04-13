import type { EquipDropTable } from './equipment_definition';

export const LOCATION_DROPS: Record<string, EquipDropTable> = {
    'Living Room': {
        chance: 0.08,
        table: [{ equip_id: 'comfy_slippers', weight: 1 }],
    },
    'Park': {
        chance: 0.05,
        table: [{ equip_id: 'buskers_cap', weight: 1 }],
    },
    'School': {
        chance: 0.03,
        table: [
            { equip_id: 'reading_glasses', weight: 2 },
            { equip_id: 'stage_microphone', weight: 1 },
        ],
    },
    'Mall': {
        chance: 0.05,
        table: [{ equip_id: 'designer_jacket', weight: 1 }],
    },
    'Gym': {
        chance: 0.04,
        table: [{ equip_id: 'training_shorts', weight: 1 }],
    },
    'Maid Cafe': {
        chance: 0.04,
        table: [{ equip_id: 'cat_ear_headband', weight: 1 }],
    },
};

export const EQUIP_DROP_LOCATION: Map<string, string> = new Map(
    Object.entries(LOCATION_DROPS).flatMap(([loc, table]) =>
        table.table.map(entry => [entry.equip_id, loc] as const)
    )
);
