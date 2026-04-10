import type { EquipDef } from './equipment_definition';
import { living_room_equipment } from './living_room_equipment';
import { park_equipment } from './park_equipment';
import { school_equipment } from './school_equipment';
import { mall_equipment } from './mall_equipment';
import { gym_equipment } from './gym_equipment';
import { maid_cafe_equipment } from './maid_cafe_equipment';

const all_equipment: EquipDef[] = [
    ...living_room_equipment,
    ...park_equipment,
    ...school_equipment,
    ...mall_equipment,
    ...gym_equipment,
    ...maid_cafe_equipment,
];

export const EQUIP_REGISTRY: Map<string, EquipDef> = new Map(
    all_equipment.map(e => [e.id, e])
);
