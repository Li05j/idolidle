import type { DreamUpgradeDef } from './dream_upgrade_definition';
import { ALL_DREAM_UPGRADES } from './dream_upgrade_table';

export const DREAM_REGISTRY: Map<string, DreamUpgradeDef> = new Map(
    ALL_DREAM_UPGRADES.map(u => [u.id, u])
);

export { ALL_DREAM_UPGRADES } from './dream_upgrade_table';
export { upgrade_cost } from './dream_upgrade_definition';
export type { DreamUpgradeDef, DreamUpgradeCategory } from './dream_upgrade_definition';
