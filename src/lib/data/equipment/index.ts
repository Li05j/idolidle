import type { EquipDef } from './equipment_definition';
import { ALL_EQUIPMENT } from './equipment_table';

export const EQUIP_REGISTRY: Map<string, EquipDef> = new Map(
    ALL_EQUIPMENT.map(e => [e.id, e])
);
