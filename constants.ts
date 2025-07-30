import type { MonsterData, Resources, Building, Player, CraftableItem, Training, CraftablePotion, Dungeon, NPC, Quest, ItemGrade, Furniture, Achievement, GameStateSnapshot, AchievementTier, DungeonAffix } from './types';
import { BoltIcon, ArrowTrendingUpIcon, GoldIcon, FireIcon, ShieldIcon, TagIcon, CubeTransparentIcon } from './components/Icons';

export const INITIAL_PLAYER: Player = { 
  hp: 100, 
  maxHp: 100, 
  defense: 0, 
  attack: 5,
  equipment: {
    weapon: null,
    armor: null,
  },
  trainingLevels: {
    attack: 0,
    defense: 0,
    maxHp: 0,
    inn: 0,
  },
  proficiency: {
    blacksmithing: { level: 1, exp: 0 },
    alchemy: { level: 1, exp: 0 },
  },
  buffs: null,
  potions: {
    health: 0,
    sharpening_stone: 0,
    shielding_oil: 0,
    giants_strength_potion: 0,
    stoneskin_elixir: 0,
    luck_potion: 0,
  },
  npcReputation: {},
};
export const INITIAL_RESOURCES: Resources = { gold: 10, wood: 20, stone: 20, iron: 0, ancientShard: 0 };

export const BUILDINGS: Building[] = [
  {
    id: 'wall',
    name: '성벽',
    description: '마을의 방어도를 높여 몬스터의 습격으로부터 건물을 보호합니다. 업그레이드 시 방어도가 상승합니다.',
    cost: { gold: 0, wood: 50, stone: 100, iron: 0, ancientShard: 0 },
    built: false,
    level: 1,
    baseUpgradeCost: { gold: 20, wood: 80, stone: 150, iron: 0, ancientShard: 0 },
    defense: 10,
    damaged: false,
    maxLevel: 10,
  },
  {
    id: 'guard_tower',
    name: '경비탑',
    description: '마을의 방어도를 크게 높입니다. 업그레이드 시 방어도가 대폭 상승합니다.',
    cost: { gold: 80, wood: 100, stone: 120, iron: 50, ancientShard: 0 },
    built: false,
    level: 1,
    baseUpgradeCost: { gold: 100, wood: 120, stone: 150, iron: 80, ancientShard: 0 },
    defense: 25,
    damaged: false,
    maxLevel: 10,
  },
  {
    id: 'blacksmith',
    name: '대장간',
    description: '무기와 방어구를 제작하고 강화합니다.',
    cost: { gold: 10, wood: 20, stone: 20, iron: 0, ancientShard: 0 },
    built: false,
    level: 1,
    baseUpgradeCost: { gold: 30, wood: 40, stone: 40, iron: 25, ancientShard: 0 },
    defense: 0,
    damaged: false,
    maxLevel: 7,
  },
  {
    id: 'training_ground',
    name: '훈련소',
    description: '자원을 소모하여 능력치를 영구적으로 상승시킵니다.',
    cost: { gold: 20, wood: 30, stone: 10, iron: 0, ancientShard: 0 },
    built: false,
    level: 1,
    baseUpgradeCost: { gold: 30, wood: 50, stone: 20, iron: 0, ancientShard: 0 },
    defense: 0,
    damaged: false,
    maxLevel: 5,
  },
  {
    id: 'inn',
    name: '여관',
    description: '휴식을 취하거나 객실을 증축하여 능력치를 강화합니다.',
    cost: { gold: 30, wood: 50, stone: 40, iron: 10, ancientShard: 0 },
    built: false,
    level: 1,
    baseUpgradeCost: { gold: 40, wood: 70, stone: 60, iron: 20, ancientShard: 0 },
    defense: 0,
    damaged: false,
    maxLevel: 5,
  },
  {
    id: 'house',
    name: '나의 집',
    description: '플레이어의 개인 공간입니다. 가구를 배치하여 꾸미고, 편의 기능을 이용할 수 있습니다.',
    cost: { gold: 150, wood: 200, stone: 150, iron: 50, ancientShard: 0 },
    built: false,
    level: 1,
    baseUpgradeCost: { gold: 0, wood: 0, stone: 0, iron: 0, ancientShard: 0 },
    defense: 0,
    damaged: false,
    maxLevel: 1,
  },
  {
    id: 'alchemy_lab',
    name: '연금술사의 집',
    description: '물약을 제작하여 던전 탐험을 돕습니다.',
    cost: { gold: 50, wood: 40, stone: 80, iron: 20, ancientShard: 0 },
    built: false,
    level: 1,
    baseUpgradeCost: { gold: 70, wood: 60, stone: 100, iron: 30, ancientShard: 0 },
    defense: 0,
    damaged: false,
    maxLevel: 5,
  },
  {
    id: 'market',
    name: '시장',
    description: '자원을 판매하거나 구매합니다. 업그레이드 시 구매 가능한 품목이 늘어납니다.',
    cost: { gold: 100, wood: 80, stone: 80, iron: 0, ancientShard: 0 },
    built: false,
    level: 1,
    baseUpgradeCost: { gold: 150, wood: 100, stone: 100, iron: 50, ancientShard: 0 },
    defense: 0,
    damaged: false,
    maxLevel: 3,
  },
];

export const CRAFTABLE_ITEMS: CraftableItem[] = [
  {
    id: 'sword1',
    name: '낡은 검',
    description: '공격력을 약간 올려줍니다.',
    cost: { gold: 0, wood: 5, stone: 0, iron: 10, ancientShard: 0 },
    baseStats: { attack: 5 },
    requiredBuildingLevel: 1,
    type: 'weapon',
  },
  {
    id: 'armor1',
    name: '가죽 갑옷',
    description: '방어력을 약간 올려줍니다.',
    cost: { gold: 0, wood: 10, stone: 0, iron: 5, ancientShard: 0 },
    baseStats: { defense: 5 },
    requiredBuildingLevel: 1,
    type: 'armor',
  },
  {
    id: 'sword1_5',
    name: '철제 검',
    description: '기본적인 형태의 철제 검입니다.',
    cost: { gold: 5, wood: 5, stone: 0, iron: 20, ancientShard: 0 },
    baseStats: { attack: 7 },
    requiredBuildingLevel: 1,
    type: 'weapon',
  },
  {
    id: 'armor1_5',
    name: '징 박힌 갑옷',
    description: '가죽 갑옷에 철제 징을 박아 방어력을 보강했습니다.',
    cost: { gold: 5, wood: 10, stone: 0, iron: 15, ancientShard: 0 },
    baseStats: { defense: 7 },
    requiredBuildingLevel: 1,
    type: 'armor',
  },
  {
    id: 'sword2',
    name: '강철 검',
    description: '공격력을 올려줍니다.',
    cost: { gold: 20, wood: 0, stone: 10, iron: 30, ancientShard: 0 },
    baseStats: { attack: 10 },
    requiredBuildingLevel: 2,
    type: 'weapon',
    requiredReputation: { npcId: 'blacksmith_npc', level: 1 },
  },
  {
    id: 'armor2',
    name: '사슬 갑옷',
    description: '방어력을 올려줍니다.',
    cost: { gold: 20, wood: 5, stone: 0, iron: 25, ancientShard: 0 },
    baseStats: { defense: 10 },
    requiredBuildingLevel: 2,
    type: 'armor',
    requiredReputation: { npcId: 'blacksmith_npc', level: 1 },
  },
  {
    id: 'sword3',
    name: '기사단의 검',
    description: '숙련된 기사들이 사용하는 잘 단련된 검입니다.',
    cost: { gold: 50, wood: 0, stone: 20, iron: 70, ancientShard: 0 },
    baseStats: { attack: 15 },
    requiredBuildingLevel: 3,
    type: 'weapon',
  },
  {
    id: 'armor3',
    name: '기사단의 갑옷',
    description: '두꺼운 강철판으로 만들어진 튼튼한 갑옷입니다.',
    cost: { gold: 50, wood: 10, stone: 0, iron: 60, ancientShard: 0 },
    baseStats: { defense: 15 },
    requiredBuildingLevel: 3,
    type: 'armor',
  },
  {
    id: 'sword4',
    name: '용기사의 검',
    description: '용의 힘이 깃든 검. 강력한 파괴력을 자랑합니다.',
    cost: { gold: 150, wood: 0, stone: 0, iron: 120, ancientShard: 1 },
    baseStats: { attack: 22 },
    requiredBuildingLevel: 4,
    type: 'weapon',
    requiredReputation: { npcId: 'blacksmith_npc', level: 2 },
  },
  {
    id: 'armor4',
    name: '용기사의 갑옷',
    description: '용의 비늘로 만들어져 매우 견고합니다.',
    cost: { gold: 150, wood: 0, stone: 0, iron: 110, ancientShard: 1 },
    baseStats: { defense: 22 },
    requiredBuildingLevel: 4,
    type: 'armor',
    requiredReputation: { npcId: 'blacksmith_npc', level: 2 },
  },
  {
    id: 'sword5',
    name: '신성의 불꽃 검',
    description: '신성한 불꽃으로 벼려낸 궁극의 검.',
    cost: { gold: 350, wood: 0, stone: 0, iron: 250, ancientShard: 3 },
    baseStats: { attack: 30 },
    requiredBuildingLevel: 5,
    type: 'weapon',
    requiredReputation: { npcId: 'blacksmith_npc', level: 3 },
  },
  {
    id: 'armor5',
    name: '태고의 수호 갑옷',
    description: '고대 신들의 가호가 깃든 전설의 갑옷.',
    cost: { gold: 350, wood: 0, stone: 0, iron: 220, ancientShard: 3 },
    baseStats: { defense: 30 },
    requiredBuildingLevel: 5,
    type: 'armor',
    requiredReputation: { npcId: 'blacksmith_npc', level: 3 },
  },
  {
    id: 'sword6',
    name: '공허의 검',
    description: '차원의 틈새에서 벼려낸, 현실을 베는 검.',
    cost: { gold: 700, wood: 0, stone: 0, iron: 400, ancientShard: 5 },
    baseStats: { attack: 40, maxHp: 20 },
    requiredBuildingLevel: 6,
    type: 'weapon',
    requiredReputation: { npcId: 'blacksmith_npc', level: 3 },
  },
  {
    id: 'armor6',
    name: '공허 방랑자의 갑옷',
    description: '별빛을 머금은 미지의 금속으로 만들어진 갑옷.',
    cost: { gold: 700, wood: 0, stone: 0, iron: 350, ancientShard: 5 },
    baseStats: { defense: 40, maxHp: 20 },
    requiredBuildingLevel: 6,
    type: 'armor',
    requiredReputation: { npcId: 'blacksmith_npc', level: 3 },
  },
  {
    id: 'sword7',
    name: '성좌의 파멸검',
    description: '우주의 질서를 담고 있는 궁극의 무기.',
    cost: { gold: 1500, wood: 0, stone: 0, iron: 700, ancientShard: 10 },
    baseStats: { attack: 55 },
    requiredBuildingLevel: 7,
    type: 'weapon',
    requiredReputation: { npcId: 'blacksmith_npc', level: 3 },
  },
  {
    id: 'armor7',
    name: '성운의 아이기스',
    description: '태초의 성운에서 태어난 절대 방어구.',
    cost: { gold: 1500, wood: 0, stone: 0, iron: 600, ancientShard: 10 },
    baseStats: { defense: 55 },
    requiredBuildingLevel: 7,
    type: 'armor',
    requiredReputation: { npcId: 'blacksmith_npc', level: 3 },
  },
];

export const CRAFTABLE_POTIONS: CraftablePotion[] = [
  {
    id: 'health_potion',
    name: '체력 물약',
    description: '던전에서 체력이 30% 이하가 되면 자동으로 사용하여 50 HP를 회복합니다.',
    cost: { gold: 15, wood: 0, stone: 10, iron: 0, ancientShard: 0 },
    maxQuantity: 5,
    requiredBuildingLevel: 1,
  },
  {
    id: 'sharpening_stone',
    name: '숫돌',
    description: '다음 던전 탐험 시 공격력이 10 증가합니다. (1회용)',
    cost: { gold: 25, wood: 0, stone: 15, iron: 10, ancientShard: 0 },
    maxQuantity: 3,
    requiredBuildingLevel: 1,
  },
  {
    id: 'shielding_oil',
    name: '보호 기름',
    description: '다음 던전 탐험 시 방어력이 10 증가합니다. (1회용)',
    cost: { gold: 25, wood: 10, stone: 15, iron: 0, ancientShard: 0 },
    maxQuantity: 3,
    requiredBuildingLevel: 1,
  },
  {
    id: 'giants_strength_potion',
    name: '거인의 힘 물약',
    description: '다음 던전 탐험 시 공격력이 25 증가합니다. (1회용)',
    cost: { gold: 80, wood: 0, stone: 20, iron: 30, ancientShard: 0 },
    maxQuantity: 3,
    requiredBuildingLevel: 3,
  },
  {
    id: 'stoneskin_elixir',
    name: '강철피부 비약',
    description: '다음 던전 탐험 시 방어력이 25 증가합니다. (1회용)',
    cost: { gold: 80, wood: 20, stone: 0, iron: 30, ancientShard: 0 },
    maxQuantity: 3,
    requiredBuildingLevel: 3,
  },
  {
    id: 'luck_potion',
    name: '행운의 비약',
    description: '다음 던전 탐험 시 희귀 재료 획득 확률이 약간 증가합니다. (효과 미구현)',
    cost: { gold: 200, wood: 50, stone: 50, iron: 50, ancientShard: 1 },
    maxQuantity: 1,
    requiredBuildingLevel: 5,
  },
];

export const FURNITURE_ITEMS: Furniture[] = [
  {
    id: 'comfortable_bed',
    name: '편안한 침대',
    description: '배치하면 최대 체력이 영구적으로 5 증가합니다.',
    cost: { gold: 50, wood: 80, stone: 20, iron: 10, ancientShard: 0 },
    isPlaced: false,
    effect: { maxHp: 5 },
  },
  {
    id: 'bookshelf',
    name: '지혜의 책장',
    description: '배치하면 숙련도 획득량이 영구적으로 10% 증가합니다.',
    cost: { gold: 100, wood: 150, stone: 50, iron: 20, ancientShard: 0 },
    isPlaced: false,
    effect: {},
    proficiencyBonus: 0.1,
  },
  {
    id: 'treasure_map',
    name: '보물 지도',
    description: '배치하면 던전에서 획득하는 골드량이 영구적으로 5% 증가합니다.',
    cost: { gold: 200, wood: 100, stone: 0, iron: 0, ancientShard: 0 },
    isPlaced: false,
    effect: {},
    goldBonus: 0.05,
  },
];

export const GRADE_CONFIG: Record<ItemGrade, { multiplier: number, color: string, name: string }> = {
  common: { multiplier: 1, color: 'text-slate-300', name: '일반' },
  rare: { multiplier: 1.25, color: 'text-sky-400', name: '고급' },
  epic: { multiplier: 1.6, color: 'text-violet-400', name: '희귀' },
};

export const REPUTATION_LEVELS = [
  { name: '중립', points: 0, color: 'text-slate-400' },
  { name: '우호', points: 100, color: 'text-green-400' },
  { name: '신뢰', points: 300, color: 'text-sky-400' },
  { name: '동맹', points: 600, color: 'text-violet-400' },
];

export const TRAINING_OPTIONS: Training[] = [
  {
    id: 'attack',
    name: '공격 훈련',
    description: '공격력을 1 올립니다.',
    baseCost: { gold: 10, wood: 0, stone: 0, iron: 10, ancientShard: 0 },
    effect: { attack: 1 },
  },
  {
    id: 'defense',
    name: '방어 훈련',
    description: '방어력을 1 올립니다.',
    baseCost: { gold: 10, wood: 10, stone: 0, iron: 5, ancientShard: 0 },
    effect: { defense: 1 },
  },
  {
    id: 'maxHp',
    name: '체력 단련',
    description: '최대 체력을 5 올립니다.',
    baseCost: { gold: 5, wood: 5, stone: 10, iron: 0, ancientShard: 0 },
    effect: { maxHp: 5 },
  },
];

export const PROFICIENCY_EXP_TO_LEVEL_UP = (level: number): number => {
    return Math.floor(50 * Math.pow(1.5, level - 1));
};

export const MONSTERS: Record<string, MonsterData> = {
  'goblin_scout': {
    id: 'goblin_scout', name: 'Goblin Scout', maxHp: 30, attack: 8,
    image: 'https://picsum.photos/seed/goblin/400/400',
    drops: { gold: 5, wood: 20, stone: 10, iron: 5, ancientShard: 0 },
  },
  'wolf': {
    id: 'wolf', name: 'Dire Wolf', maxHp: 40, attack: 10,
    image: 'https://picsum.photos/seed/wolf/400/400',
    drops: { gold: 8, wood: 25, stone: 5, iron: 3, ancientShard: 0 },
  },
   'goblin_shaman': {
      id: 'goblin_shaman', name: 'Goblin Shaman', maxHp: 35, attack: 9,
      image: 'https://picsum.photos/seed/goblinshaman/400/400',
      drops: { gold: 7, wood: 15, stone: 15, iron: 7, ancientShard: 0 },
    },
    'hobgoblin': {
      id: 'hobgoblin', name: 'Hobgoblin Captain', maxHp: 50, attack: 12,
      image: 'https://picsum.photos/seed/hobgoblin/400/400',
      drops: { gold: 12, wood: 10, stone: 15, iron: 10, ancientShard: 0 },
    },
  'orc_warrior': {
    id: 'orc_warrior', name: 'Orc Warrior', maxHp: 60, attack: 14,
    image: 'https://picsum.photos/seed/orc/400/400',
    drops: { gold: 15, wood: 5, stone: 20, iron: 15, ancientShard: 0 },
  },
  'troll': {
    id: 'troll', name: 'Cave Troll', maxHp: 90, attack: 12,
    image: 'https://picsum.photos/seed/troll/400/400',
    drops: { gold: 20, wood: 10, stone: 30, iron: 10, ancientShard: 0 },
  },
  'skeleton_warrior': {
      id: 'skeleton_warrior', name: 'Skeleton Warrior', maxHp: 70, attack: 15,
      image: 'https://picsum.photos/seed/skeleton/400/400',
      drops: { gold: 18, wood: 0, stone: 25, iron: 5, ancientShard: 0 },
  },
  'ghoul': {
      id: 'ghoul', name: 'Frenzied Ghoul', maxHp: 80, attack: 16,
      image: 'https://picsum.photos/seed/ghoul/400/400',
      drops: { gold: 22, wood: 5, stone: 20, iron: 8, ancientShard: 0 },
  },
  'lich_apprentice': {
      id: 'lich_apprentice', name: 'Lich Apprentice', maxHp: 100, attack: 18,
      image: 'https://picsum.photos/seed/lich/400/400',
      drops: { gold: 40, wood: 0, stone: 10, iron: 20, ancientShard: 0 },
  },
  'cultist_acolyte': {
    id: 'cultist_acolyte', name: '컬티스트 신도', maxHp: 90, attack: 17,
    image: 'https://picsum.photos/seed/cultist/400/400',
    drops: { gold: 25, wood: 0, stone: 15, iron: 15, ancientShard: 0 },
  },
  'shadow_stalker': {
    id: 'shadow_stalker', name: '그림자 추적자', maxHp: 110, attack: 19,
    image: 'https://picsum.photos/seed/shadowstalker/400/400',
    drops: { gold: 30, wood: 0, stone: 0, iron: 20, ancientShard: 0 },
  },
  'temple_guardian': {
    id: 'temple_guardian', name: '사원 수호자', maxHp: 150, attack: 22,
    image: 'https://picsum.photos/seed/guardian/400/400',
    drops: { gold: 80, wood: 0, stone: 0, iron: 40, ancientShard: 0 },
  },
  'dragon_whelp': {
    id: 'dragon_whelp', name: 'Dragon Whelp', maxHp: 120, attack: 20,
    image: 'https://picsum.photos/seed/dragon/400/400',
    drops: { gold: 50, wood: 0, stone: 15, iron: 30, ancientShard: 0 },
  },
  'shadow_dragon': {
    id: 'shadow_dragon', name: 'Shadow Dragon', maxHp: 300, attack: 40,
    image: 'https://picsum.photos/seed/shadowdragon/400/400',
    drops: { gold: 250, wood: 0, stone: 0, iron: 150, ancientShard: 0 },
  },
  'ancient_colossus': {
    id: 'ancient_colossus', name: '고대의 거상', maxHp: 2000, attack: 80,
    image: 'https://picsum.photos/seed/colossus/400/400',
    drops: { gold: 1000, wood: 0, stone: 500, iron: 500, ancientShard: 0 },
  },
};

export const DUNGEONS: Dungeon[] = [
  {
    id: 'forest',
    name: '초심자의 숲',
    description: '고블린들이 출몰하는 비교적 안전한 숲입니다. 목재를 구하기 좋습니다.',
    unlocksAfter: undefined,
    primaryDrops: ['wood', 'stone'],
    startEventId: 'start',
    events: {
      'start': {
        type: 'choice',
        text: '숲에 들어섰습니다. 길이 두 갈래로 나뉩니다. 어느 쪽으로 가시겠습니까?',
        options: [
          { text: '왼쪽 좁은 길로 간다', nextEventId: 'trap_path' },
          { text: '오른쪽 넓은 길로 간다', nextEventId: 'fight_goblin' },
        ],
      },
      'trap_path': {
        type: 'trap',
        text: '덩굴에 발이 걸려 넘어졌습니다! 약간의 체력을 잃었습니다.',
        damage: 5,
        nextEventId: 'treasure_chest',
      },
      'treasure_chest': {
        type: 'treasure',
        text: '길 옆에서 낡은 보물 상자를 발견했습니다! 꽤 많은 자원을 얻었습니다.',
        reward: { gold: 20, wood: 15 },
        nextEventId: 'final_fight',
      },
      'fight_goblin': {
        type: 'monster',
        monsterId: 'goblin_scout',
        nextEventId: 'final_fight',
      },
      'final_fight': {
        type: 'monster',
        monsterId: 'wolf',
        nextEventId: 'town', // Dungeon ends, return to town
      },
    },
  },
  {
      id: 'goblin_cave',
      name: '고블린 동굴',
      description: '숲보다 더 깊은 곳에 있는 고블린들의 소굴입니다. 더 많은 고블린들이 지키고 있습니다.',
      unlocksAfter: 'wolf',
      primaryDrops: ['wood', 'stone'],
      startEventId: 'start',
      events: {
        'start': { type: 'monster', monsterId: 'goblin_shaman', nextEventId: 'choice' },
        'choice': {
          type: 'choice',
          text: '동굴이 두 갈래로 나뉩니다. 시끄러운 소리가 들리는 곳과 조용한 곳이 있습니다.',
          options: [
            { text: '시끄러운 곳으로 간다', nextEventId: 'fight_more_goblins' },
            { text: '조용한 곳으로 간다', nextEventId: 'trap' },
          ],
        },
        'trap': { type: 'trap', text: '조용한 길을 택했지만, 숨겨진 함정을 밟았습니다!', damage: 10, nextEventId: 'final_fight' },
        'fight_more_goblins': { type: 'monster', monsterId: 'goblin_scout', nextEventId: 'final_fight' },
        'final_fight': { type: 'monster', monsterId: 'hobgoblin', nextEventId: 'town' },
      }
  },
  {
    id: 'mine',
    name: '오크의 폐광',
    description: '강력한 오크가 지키고 있는 폐광입니다. 석재와 철광석이 풍부합니다.',
    unlocksAfter: 'hobgoblin',
    primaryDrops: ['stone', 'iron'],
    startEventId: 'start',
    events: {
      'start': { type: 'monster', monsterId: 'orc_warrior', nextEventId: 'deep_in_mine' },
      'deep_in_mine': { type: 'treasure', text: '버려진 광산 수레에서 철광석 더미를 발견했습니다.', reward: { iron: 25, stone: 10 }, nextEventId: 'final_fight' },
      'final_fight': { type: 'monster', monsterId: 'troll', nextEventId: 'town' },
    }
  },
  {
      id: 'crypt',
      name: '잊혀진 납골당',
      description: '오래된 전사들이 잠들어 있는 곳입니다. 언데드들이 배회하고 있습니다.',
      unlocksAfter: 'troll',
      primaryDrops: ['gold', 'stone'],
      startEventId: 'start',
      events: {
        'start': { type: 'monster', monsterId: 'skeleton_warrior', nextEventId: 'treasure' },
        'treasure': { type: 'treasure', text: '오래된 석관을 열어보니 약간의 보물이 들어있습니다.', reward: { gold: 50, stone: 15 }, nextEventId: 'fight_ghoul' },
        'fight_ghoul': { type: 'monster', monsterId: 'ghoul', nextEventId: 'final_fight' },
        'final_fight': { type: 'monster', monsterId: 'lich_apprentice', nextEventId: 'town' },
      }
  },
  {
    id: 'temple',
    name: '저주받은 사원',
    description: '고대의 악이 봉인된 사원입니다. 부정한 기운이 감돌고 있습니다.',
    unlocksAfter: 'lich_apprentice',
    primaryDrops: ['gold', 'iron'],
    startEventId: 'start',
    events: {
        'start': { type: 'monster', monsterId: 'cultist_acolyte', nextEventId: 'choice' },
        'choice': {
          type: 'choice',
          text: '사원 내부로 들어섰습니다. 어두운 복도와 중앙 제단으로 가는 길이 보입니다.',
          options: [
            { text: '어두운 복도를 탐색한다', nextEventId: 'fight_stalker' },
            { text: '제단으로 향한다', nextEventId: 'treasure' },
          ],
        },
        'treasure': { type: 'treasure', text: '제단에서 쓸만한 물건들을 발견했습니다.', reward: { gold: 60, iron: 10 }, nextEventId: 'final_fight' },
        'fight_stalker': { type: 'monster', monsterId: 'shadow_stalker', nextEventId: 'final_fight' },
        'final_fight': { type: 'monster', monsterId: 'temple_guardian', nextEventId: 'town' },
    }
  },
  {
    id: 'nest',
    name: '고룡 새끼의 둥지',
    description: '어린 용이 잠들어 있는 위험한 장소입니다. 값진 보물을 얻을 수 있을지도 모릅니다.',
    unlocksAfter: 'temple_guardian',
    primaryDrops: ['gold', 'iron'],
    startEventId: 'start',
    events: {
        'start': { type: 'treasure', text: '둥지 입구에서 모험가의 유해를 발견했습니다...', reward: { gold: 100 }, nextEventId: 'final_fight' },
        'final_fight': { type: 'monster', monsterId: 'dragon_whelp', nextEventId: 'town' },
    }
  },
  {
    id: 'lair',
    name: '그림자 용의 둥지',
    description: '모든 악의 근원, 그림자 용이 도사리고 있습니다. 마을의 운명이 당신에게 달렸습니다.',
    unlocksAfter: 'dragon_whelp',
    primaryDrops: ['gold', 'iron'],
    startEventId: 'start',
    events: {
        'start': { type: 'monster', monsterId: 'shadow_dragon', nextEventId: 'town' },
    }
  },
  {
    id: 'infinite_rift',
    name: '무한의 균열',
    description: '힘의 한계를 시험하는 끝없는 차원의 균열입니다. 깊이 들어갈수록 적들은 강력해지고 보상도 커집니다.',
    unlocksAfter: 'shadow_dragon',
    primaryDrops: ['gold', 'iron'],
    startEventId: 'start',
    events: {
      'start': { type: 'monster', monsterId: 'random', nextEventId: 'floor_cleared' },
      'floor_cleared': {
        type: 'choice',
        text: '균열의 힘이 당신을 다음 층으로 이끕니다. 계속 진행하시겠습니까?',
        options: [
          { text: '계속 진행', nextEventId: 'start' },
          { text: '탐험 종료', nextEventId: 'town' },
        ]
      }
    }
  },
];

export const DUNGEON_AFFIXES: DungeonAffix[] = [
    {
        id: 'tough_monsters',
        name: '강인한 괴물',
        description: '몬스터의 최대 체력이 20% 증가합니다.',
        type: 'negative',
        icon: ShieldIcon,
        apply: (target) => ({...target, maxHp: Math.ceil(target.maxHp * 1.2), hp: Math.ceil(target.hp * 1.2)})
    },
    {
        id: 'aggressive_monsters',
        name: '공격적인 괴물',
        description: '몬스터의 공격력이 15% 증가합니다.',
        type: 'negative',
        icon: ArrowTrendingUpIcon,
        apply: (target) => ({...target, attack: Math.ceil(target.attack * 1.15)})
    },
    {
        id: 'fast_monsters',
        name: '날렵한 괴물',
        description: '몬스터의 공격 속도가 25% 빨라집니다.',
        type: 'negative',
        icon: BoltIcon,
        apply: (target) => target, // Logic is handled in combat loop
    },
    {
        id: 'resource_abundance',
        name: '자원 풍요',
        description: '획득하는 모든 자원(골드 제외)의 양이 25% 증가합니다.',
        type: 'positive',
        icon: TagIcon,
        apply: (target) => {
            const newTarget = {...target};
            if(newTarget.wood) newTarget.wood = Math.ceil(newTarget.wood * 1.25);
            if(newTarget.stone) newTarget.stone = Math.ceil(newTarget.stone * 1.25);
            if(newTarget.iron) newTarget.iron = Math.ceil(newTarget.iron * 1.25);
            return newTarget;
        }
    },
    {
        id: 'golden_touch',
        name: '황금의 손길',
        description: '획득하는 골드의 양이 30% 증가합니다.',
        type: 'positive',
        icon: GoldIcon,
        apply: (target) => ({...target, gold: Math.ceil(target.gold * 1.3)})
    },
    {
        id: 'deadly_traps',
        name: '치명적인 함정',
        description: '함정의 피해량이 50% 증가합니다.',
        type: 'negative',
        icon: FireIcon,
        apply: (target) => Math.ceil(target * 1.5)
    }
];

export const NPCS: NPC[] = [
  {
    id: 'elder_npc',
    name: '장로 이선',
    description: '마을을 이끄는 지혜로운 장로. 깊은 시름에 잠겨 있다.'
  },
  {
    id: 'blacksmith_npc',
    name: '바룩',
    buildingId: 'blacksmith',
    description: '마을의 대장장이. 무뚝뚝하지만 실력은 확실하다.'
  },
  {
    id: 'alchemist_npc',
    name: '엘라라',
    buildingId: 'alchemy_lab',
    description: '호기심 많은 연금술사. 항상 새로운 실험에 몰두해 있다.'
  }
];

export const QUESTS: Quest[] = [
  {
    id: 'sq1_hope',
    npcId: 'elder_npc',
    title: '희미한 희망',
    description: '마을을 재건하고 위협에 맞서기 위한 첫걸음을 내딛어야 합니다. 우선 마을의 기반을 다질 자원을 모아주십시오.',
    requirements: { type: 'resources', cost: { gold: 50, wood: 100, stone: 100, iron: 0, ancientShard: 0 } },
    rewards: { resources: { gold: 100, wood: 0, stone: 0, iron: 20, ancientShard: 0 } },
    status: 'available',
    isStoryQuest: true,
  },
  {
    id: 'sq2_preparation',
    npcId: 'elder_npc',
    title: '전투 준비',
    description: '점점 강해지는 몬스터들에게 맞서려면 더 좋은 장비가 필요합니다. 대장간을 지원하고 병사들을 무장시킬 자원을 가져와주십시오.',
    requirements: { type: 'resources', cost: { gold: 200, wood: 0, stone: 50, iron: 100, ancientShard: 0 } },
    rewards: { resources: { gold: 300, wood: 0, stone: 0, iron: 0, ancientShard: 0 } },
    status: 'available',
    isStoryQuest: true,
  },
  {
    id: 'sq3_final_stand',
    npcId: 'elder_npc',
    title: '최후의 결전',
    description: '모든 위협의 근원, 그림자 용을 처치할 때가 왔습니다. 최후의 결전을 위해 모든 자원을 모아주십시오. 마을의 운명이 당신의 어깨에 달려있습니다.',
    requirements: { type: 'resources', cost: { gold: 500, wood: 200, stone: 200, iron: 250, ancientShard: 0 } },
    rewards: { resources: { gold: 1000, wood: 0, stone: 0, iron: 0, ancientShard: 0 } },
    status: 'available',
    isStoryQuest: true,
  },
  {
    id: 'q1_iron_supply',
    npcId: 'blacksmith_npc',
    title: '대장간의 시작',
    description: '검을 만들려면 철광석이 더 필요하네. 좀 가져다주게.',
    requirements: {
      type: 'resources',
      cost: { gold: 0, wood: 0, stone: 0, iron: 20, ancientShard: 0 },
    },
    rewards: {
      resources: { gold: 50, wood: 0, stone: 0, iron: 0, ancientShard: 0 },
    },
    reputationReward: { npcId: 'blacksmith_npc', points: 25 },
    status: 'available',
  },
  {
    id: 'q2_wood_for_handle',
    npcId: 'blacksmith_npc',
    title: '단단한 손잡이',
    description: '무기 손잡이로 쓸 만한 목재가 부족해. 튼튼한 놈으로 구해오게.',
     requirements: {
      type: 'resources',
      cost: { gold: 0, wood: 30, stone: 0, iron: 0, ancientShard: 0 },
    },
    rewards: {
      resources: { gold: 0, wood: 0, stone: 50, iron: 0, ancientShard: 0 },
    },
    reputationReward: { npcId: 'blacksmith_npc', points: 25 },
    status: 'available',
  },
   {
    id: 'q3_alchemist_research',
    npcId: 'alchemist_npc',
    title: '기초 연구 재료',
    description: '새로운 물약 연구에 쓸 석재가 필요해요. 도와주실 수 있나요?',
     requirements: {
      type: 'resources',
      cost: { gold: 0, wood: 0, stone: 40, iron: 0, ancientShard: 0 },
    },
    rewards: {
      resources: { gold: 80, wood: 0, stone: 0, iron: 0, ancientShard: 0 },
    },
    reputationReward: { npcId: 'alchemist_npc', points: 25 },
    status: 'available',
  },
  {
    id: 'q4_blacksmith_trust',
    npcId: 'blacksmith_npc',
    title: '숙련공의 시험',
    description: '내 실력을 인정하는 모양이군. 더 까다로운 물건을 만들려면 희귀한 재료가 필요해. 구해올 수 있겠나?',
    requirements: {
      type: 'resources',
      cost: { gold: 100, wood: 0, stone: 0, iron: 50, ancientShard: 0 },
    },
    rewards: {
      resources: { gold: 300, wood: 0, stone: 0, iron: 0, ancientShard: 0 },
    },
    reputationReward: { npcId: 'blacksmith_npc', points: 50 },
    requiredReputation: { npcId: 'blacksmith_npc', level: 1 }, // 우호
    status: 'available',
  }
];

export const TIER_CONFIG: Record<AchievementTier, { color: string; name: string, borderColor: string }> = {
  bronze: { color: 'text-amber-600', name: '브론즈', borderColor: 'border-amber-600' },
  silver: { color: 'text-slate-400', name: '실버', borderColor: 'border-slate-400' },
  gold: { color: 'text-yellow-400', name: '골드', borderColor: 'border-yellow-400' },
  platinum: { color: 'text-violet-400', name: '플래티넘', borderColor: 'border-violet-400' },
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'build_blacksmith',
    name: '마을의 시작',
    description: '대장간을 건설하여 마을 재건의 첫 삽을 뜹니다.',
    tier: 'bronze',
    goal: (s: GameStateSnapshot) => s.buildings.some(b => b.id === 'blacksmith' && b.built),
    reward: { resources: { wood: 50, stone: 50 } },
  },
  {
    id: 'defeat_wolf',
    name: '첫 사냥',
    description: '초심자의 숲을 클리어하고 늑대를 처치합니다.',
    tier: 'bronze',
    goal: (s: GameStateSnapshot) => s.defeatedMonsters.includes('wolf'),
    reward: { resources: { gold: 100 } },
  },
  {
    id: 'craft_epic',
    name: '전설의 장인',
    description: '희귀(Epic) 등급 아이템을 제작합니다.',
    tier: 'silver',
    goal: (s: GameStateSnapshot) => s.lastCraftedItem !== null && s.lastCraftedItem !== 'fail' && s.lastCraftedItem.grade === 'epic',
    reward: { resources: { iron: 50, gold: 100 } },
  },
  {
    id: 'reach_50_attack',
    name: '일격 필살',
    description: '플레이어의 총 공격력을 50 이상으로 만듭니다.',
    tier: 'silver',
    goal: (s: GameStateSnapshot) => s.player.attack >= 50,
    reward: { stats: { attack: 2 } },
  },
  {
    id: 'reach_rift_10',
    name: '균열 탐사자',
    description: '무한의 균열 10층에 도달합니다.',
    tier: 'silver',
    goal: (s: GameStateSnapshot) => s.highestFloorReached >= 10,
    reward: { stats: { attack: 1, defense: 1 } },
  },
  {
    id: 'complete_story',
    name: '이야기의 끝',
    description: '모든 스토리 퀘스트를 완료합니다.',
    tier: 'gold',
    goal: (s: GameStateSnapshot) => QUESTS.filter(q => q.isStoryQuest).every(sq => s.quests.find(q => q.id === sq.id)?.status === 'completed'),
    reward: { resources: { gold: 1000 } },
  },
  {
    id: 'architect',
    name: '위대한 건축가',
    description: '모든 종류의 건물을 건설합니다.',
    tier: 'gold',
    goal: (s: GameStateSnapshot) => BUILDINGS.every(b => s.buildings.find(sb => sb.id === b.id)?.built),
    reward: { stats: { defense: 2, maxHp: 10 } },
  },
  {
    id: 'monster_hunter',
    name: '몬스터 도감',
    description: '최종 보스를 제외한 모든 종류의 몬스터를 한 번 이상 처치합니다.',
    tier: 'gold',
    goal: (s: GameStateSnapshot) => {
        const allMonsterIds = Object.keys(MONSTERS).filter(id => id !== 'shadow_dragon' && id !== 'ancient_colossus');
        return allMonsterIds.every(id => s.defeatedMonsters.includes(id));
    },
    reward: { resources: { gold: 500, iron: 100 } },
  },
  {
    id: 'reach_rift_50',
    name: '차원 여행자',
    description: '무한의 균열 50층에 도달합니다.',
    tier: 'gold',
    goal: (s: GameStateSnapshot) => s.highestFloorReached >= 50,
    reward: { stats: { attack: 3, defense: 3, maxHp: 10 } },
  },
  {
    id: 'final_victory',
    name: '마을의 구원자',
    description: '그림자 용을 처치하고 마을에 평화를 가져옵니다.',
    tier: 'platinum',
    goal: (s: GameStateSnapshot) => s.defeatedMonsters.includes('shadow_dragon'),
    reward: { stats: { attack: 5, defense: 5, maxHp: 20 } },
  },
  {
    id: 'colossus_slayer',
    name: '거상 파괴자',
    description: '월드 보스, 고대의 거상을 처치합니다.',
    tier: 'platinum',
    goal: (s: GameStateSnapshot) => s.defeatedMonsters.includes('ancient_colossus'),
    reward: { resources: { ancientShard: 1 } },
  },
];