import React from 'react';
import type { ChecklistItem as ChecklistItemType } from '../types';

export interface ChecklistItem {
  id: number;
  text: string;
  completed: boolean;
  action?: () => void;
}

export type ItemGrade = 'common' | 'rare' | 'epic';

export interface ItemEffect {
  attack?: number;
  defense?: number;
  maxHp?: number;
}

export interface EquippedItem {
  recipeId: string;
  name: string;
  grade: ItemGrade;
  stats: Required<ItemEffect>;
  type: 'weapon' | 'armor';
  enchantLevel: number;
}

export interface Proficiency {
  level: number;
  exp: number;
}

export interface Player {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  equipment: {
    weapon: EquippedItem | null;
    armor: EquippedItem | null;
  };
  trainingLevels: {
    attack: number;
    defense: number;
    maxHp: number;
    inn: number;
  };
  proficiency: {
    blacksmithing: Proficiency;
    alchemy: Proficiency;
  };
  buffs: {
    attack: number;
    defense: number;
  } | null;
  potions: {
    health: number;
    sharpening_stone: number;
    shielding_oil: number;
    giants_strength_potion: number;
    stoneskin_elixir: number;
    luck_potion: number;
  };
  npcReputation: Record<string, number>;
}

export interface Resources {
  gold: number;
  wood: number;
  stone: number;
  iron: number;
  ancientShard: number;
}

export interface Building {
  id: string;
  name:string;
  description: string;
  cost: Resources;
  built: boolean;
  level: number;
  baseUpgradeCost: Resources;
  defense?: number;
  damaged?: boolean;
  maxLevel?: number;
}

export interface CraftableItem {
  id: string;
  name: string;
  description: string;
  cost: Resources;
  baseStats: ItemEffect;
  requiredBuildingLevel: number;
  type: 'weapon' | 'armor';
  requiredReputation?: { npcId: string; level: number; };
}

export interface CraftablePotion {
  id: 'health_potion' | 'sharpening_stone' | 'shielding_oil' | 'giants_strength_potion' | 'stoneskin_elixir' | 'luck_potion';
  name: string;
  description: string;
  cost: Resources;
  maxQuantity: number;
  requiredBuildingLevel: number;
}

export interface Training {
  id: 'attack' | 'defense' | 'maxHp';
  name: string;
  description: string;
  baseCost: Resources;
  effect: ItemEffect;
}

export interface Furniture {
  id: string;
  name: string;
  description: string;
  cost: Resources;
  isPlaced: boolean;
  effect: ItemEffect;
  proficiencyBonus?: number;
  goldBonus?: number;
}

export interface Monster {
  id:string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  image: string;
  drops: Resources;
}

export interface MonsterData {
  id: string;
  name: string;
  maxHp: number;
  attack: number;
  image: string;
  drops: Resources;
}

export interface MonsterEvent {
  type: 'monster';
  monsterId: string;
  nextEventId: string | 'town';
}

export interface TreasureEvent {
  type: 'treasure';
  text: string;
  reward: Partial<Resources>;
  nextEventId: string | 'town';
}

export interface TrapEvent {
  type: 'trap';
  text: string;
  damage: number; // HP damage
  nextEventId: string | 'town';
}

export interface ChoiceEvent {
  type: 'choice';
  text: string;
  options: {
    text: string;
    nextEventId: string;
  }[];
}

export type DungeonEvent = MonsterEvent | TreasureEvent | TrapEvent | ChoiceEvent;

export interface Dungeon {
  id: string;
  name: string;
  description: string;
  startEventId: string;
  events: Record<string, DungeonEvent>;
  unlocksAfter?: string; // ID of monster to defeat to unlock this dungeon
  primaryDrops: Array<keyof Omit<Resources, 'ancientShard'>>;
}

export type DungeonAffixType = 'positive' | 'negative';

export interface DungeonAffix {
  id: string;
  name: string;
  description: string;
  type: DungeonAffixType;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  apply: (target: any) => any; // Generic apply function
}

export interface NPC {
  id: string;
  name: string;
  buildingId?: string;
  description: string;
}

export type QuestStatus = 'available' | 'in_progress' | 'completed';

export interface Quest {
  id: string;
  npcId: string;
  title: string;
  description: string;
  requirements: {
    type: 'resources';
    cost: Resources;
  };
  rewards: {
    resources?: Resources;
  };
  reputationReward?: { npcId: string; points: number; };
  requiredReputation?: { npcId: string; level: number; };
  status: QuestStatus;
  isStoryQuest?: boolean;
}

export interface MerchantItem {
  type: 'resource' | 'potion';
  id: keyof Omit<Resources, 'gold' | 'ancientShard'> | CraftablePotion['id'];
  amount: number;
  cost: Resources;
  stock: number;
}

export interface TownEvent {
  id: 'traveling_merchant';
  name: string;
  description: string;
  duration: number; // in exploration cycles
  items: MerchantItem[];
}

export enum GameState {
  TOWN,
  EXPLORING,
  IN_DUNGEON,
  GAME_OVER,
}

export enum PlayerAction {
  ATTACK,
  DEFEND,
}

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface AchievementReward {
  resources?: Partial<Resources>;
  stats?: Partial<ItemEffect>;
}

export interface GameStateSnapshot {
  player: Player;
  resources: Resources;
  buildings: Building[];
  quests: Quest[];
  defeatedMonsters: string[];
  furniture: Furniture[];
  lastCraftedItem: EquippedItem | 'fail' | null;
  highestFloorReached: number;
  worldBoss: { isActive: boolean; currentHp: number; timeRemaining: number; } | null;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  tier: AchievementTier;
  goal: (snapshot: GameStateSnapshot) => boolean;
  reward: AchievementReward;
}