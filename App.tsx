import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { Player, Monster, Resources, Building, CraftableItem, Training, CraftablePotion, Quest, Dungeon, DungeonEvent, ItemEffect, ItemGrade, EquippedItem, TownEvent, Furniture, GameStateSnapshot, Achievement, AchievementTier, DungeonAffix, MonsterData } from './types';
import { GameState } from './types';
import { INITIAL_PLAYER, DUNGEONS, INITIAL_RESOURCES, BUILDINGS, CRAFTABLE_ITEMS, TRAINING_OPTIONS, CRAFTABLE_POTIONS, NPCS, QUESTS, MONSTERS, GRADE_CONFIG, REPUTATION_LEVELS, FURNITURE_ITEMS, ACHIEVEMENTS, TIER_CONFIG, DUNGEON_AFFIXES, PROFICIENCY_EXP_TO_LEVEL_UP } from './constants';
import GameScreen from './components/GameScreen';
import TownScreen from './components/TownScreen';
import ExplorationScreen from './components/ExplorationScreen';
import Navigation from './components/Navigation';
import { SkullIcon, LockIcon, GoldIcon, WoodIcon, StoneIcon, IronIcon, SparklesIcon, SwordIcon, ShieldIcon, HeartIcon, ExclamationTriangleIcon, TrophyIcon, CheckIcon, TagIcon, CubeTransparentIcon } from './components/Icons';

interface CraftingResultModalProps {
    result: EquippedItem | 'fail';
    onClose: () => void;
}

const CraftingResultModal: React.FC<CraftingResultModalProps> = ({ result, onClose }) => {
    
    const renderSuccess = (item: EquippedItem) => {
        const gradeInfo = GRADE_CONFIG[item.grade];
        const stats = item.stats;

        return (
            <>
                <div className="flex justify-center items-center gap-2 mb-4">
                    <SparklesIcon className="w-8 h-8 text-yellow-300" />
                    <h2 className="text-2xl font-bold text-center text-yellow-200">제작 성공!</h2>
                </div>
                <div className={`p-4 rounded-lg bg-slate-900 border ${gradeInfo.color.replace('text-', 'border-')}`}>
                    <p className={`text-lg font-bold text-center ${gradeInfo.color}`}>{`[${gradeInfo.name}] ${item.name}`}</p>
                    <div className="mt-4 space-y-2 text-slate-300">
                         {stats.attack > 0 && <p className="flex items-center gap-2"><SwordIcon className="w-5 h-5 text-red-400" /> 공격력: +{stats.attack}</p>}
                         {stats.defense > 0 && <p className="flex items-center gap-2"><ShieldIcon className="w-5 h-5 text-sky-400" /> 방어력: +{stats.defense}</p>}
                         {stats.maxHp > 0 && <p className="flex items-center gap-2"><HeartIcon className="w-5 h-5 text-green-400" /> 최대 체력: +{stats.maxHp}</p>}
                    </div>
                </div>
            </>
        )
    }
    
    const renderFail = () => {
        return (
            <>
                <div className="flex justify-center items-center gap-2 mb-4">
                    <ExclamationTriangleIcon className="w-8 h-8 text-slate-400" />
                    <h2 className="text-2xl font-bold text-center text-slate-300">제작 완료</h2>
                </div>
                 <p className="text-center text-slate-400">아이템을 제작했지만, 현재 장비보다 성능이 좋지 않습니다.</p>
            </>
        )
    }

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={onClose}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="craft-result-title"
        >
            <div
                id="craft-result-title"
                className="bg-slate-800 rounded-xl shadow-2xl max-w-sm w-full border border-slate-700 p-6 animate-zoom-in"
                onClick={e => e.stopPropagation()}
            >
                {result === 'fail' ? renderFail() : renderSuccess(result as EquippedItem)}
            </div>
             <style>{`
              .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              .animate-zoom-in { animation: zoomIn 0.3s ease-out forwards; }
              @keyframes zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
};

interface EnchantResultModalProps {
    result: {item: EquippedItem, success: boolean, levelDown?: boolean};
    onClose: () => void;
}

const EnchantResultModal: React.FC<EnchantResultModalProps> = ({ result, onClose }) => {
    const { item, success, levelDown } = result;
    const gradeInfo = GRADE_CONFIG[item.grade];

    const renderSuccess = () => (
        <>
            <div className="flex justify-center items-center gap-2 mb-4">
                <SparklesIcon className="w-8 h-8 text-yellow-300" />
                <h2 id="enchant-modal-title" className="text-2xl font-bold text-center text-yellow-200">강화 성공!</h2>
            </div>
            <div className={`p-4 rounded-lg bg-slate-900 border ${gradeInfo.color.replace('text-', 'border-')}`}>
                <p className={`text-lg font-bold text-center ${gradeInfo.color}`}>
                    {`[${gradeInfo.name}] ${item.name}`} <span className="text-amber-300">{item.enchantLevel > 0 ? `+${item.enchantLevel}` : ''}</span>
                </p>
            </div>
            <p className="text-center text-slate-300 mt-4">장비가 더욱 강력해졌습니다!</p>
        </>
    );

    const renderFail = () => (
        <>
            <div className="flex justify-center items-center gap-2 mb-4">
                <ExclamationTriangleIcon className="w-8 h-8 text-slate-400" />
                <h2 id="enchant-modal-title" className="text-2xl font-bold text-center text-slate-300">강화 실패</h2>
            </div>
            {levelDown ? (
                <p className="text-center text-red-400">강화 단계가 하락했습니다. <br/> (+{item.enchantLevel + 1} → +{item.enchantLevel})</p>
            ) : (
                <p className="text-center text-slate-400">아쉽지만 아이템은 파괴되지 않았습니다. 다음 기회에 다시 시도해보세요.</p>
            )}
        </>
    );

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={onClose}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="enchant-modal-title"
        >
            <div
                className="bg-slate-800 rounded-xl shadow-2xl max-w-sm w-full border border-slate-700 p-6 animate-zoom-in"
                onClick={e => e.stopPropagation()}
            >
                {success ? renderSuccess() : renderFail()}
            </div>
        </div>
    );
};

interface ResetConfirmationModalProps {
    onConfirm: () => void;
    onCancel: () => void;
}

const ResetConfirmationModal: React.FC<ResetConfirmationModalProps> = ({ onConfirm, onCancel }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    
    useEffect(() => {
        triggerRef.current = document.activeElement as HTMLElement;
        const modalNode = modalRef.current;
        if (modalNode) {
            const focusableElements = modalNode.querySelectorAll<HTMLElement>('button');
            focusableElements[0]?.focus(); // Focus the "Cancel" button first
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onCancel();
            } else if (e.key === 'Tab') {
                const focusableElements = modalNode?.querySelectorAll<HTMLElement>('button');
                if (!focusableElements || focusableElements.length === 0) return;
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) { // Shift+Tab
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            triggerRef.current?.focus();
        };
    }, [onCancel]);

    return (
        <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={onCancel}
        >
            <div
                ref={modalRef}
                className="bg-slate-800 rounded-xl shadow-2xl max-w-sm w-full border border-slate-700 p-6 animate-zoom-in text-center"
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="reset-modal-title"
            >
                <div className="flex justify-center mb-4">
                    <ExclamationTriangleIcon className="w-16 h-16 text-red-500" />
                </div>
                <h2 id="reset-modal-title" className="text-2xl font-bold text-slate-100 mb-2">게임 초기화</h2>
                <p className="text-slate-400 mb-6">
                    정말로 게임을 초기화하시겠습니까? <br />
                    모든 진행 상황이 삭제되며, 복구할 수 없습니다.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-lg transition-colors duration-200 shadow-lg"
                    >
                        취소
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg transition-colors duration-200 shadow-lg"
                    >
                        초기화
                    </button>
                </div>
                 <style>{`
                  .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
                  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                  .animate-zoom-in { animation: zoomIn 0.3s ease-out forwards; }
                  @keyframes zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
                `}</style>
            </div>
        </div>
    );
};

const RaidReportDisplay: React.FC<{report: {attackers: number, defense: number, damagedBuildingNames: string[]}, onClose: () => void}> = ({ report, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        triggerRef.current = document.activeElement as HTMLElement;
        const modalNode = modalRef.current;
        if (modalNode) {
            const button = modalNode.querySelector('button');
            button?.focus();
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            triggerRef.current?.focus();
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div ref={modalRef} className="bg-slate-800 rounded-lg shadow-xl max-w-lg w-full border border-slate-700 p-6 text-center" role="alertdialog" aria-modal="true" aria-labelledby="raid-report-title" onClick={e => e.stopPropagation()}>
                <h2 id="raid-report-title" className="text-3xl font-bold text-red-500 mb-4">마을 습격!</h2>
                <div className='space-y-2 text-slate-300'>
                    <p>몬스터 군단 (공격력: <span className='font-bold text-red-400'>{report.attackers}</span>)이 마을을 습격했습니다.</p>
                    <p>마을 방어 (방어력: <span className='font-bold text-sky-400'>{report.defense}</span>)로 맞서 싸웠습니다.</p>
                    {report.damagedBuildingNames.length > 0 ? (
                        <div className="text-red-400 mt-4">
                          <p className='font-bold'>피해 결과: {report.damagedBuildingNames.length}개의 건물이 파손되었습니다!</p>
                          <p className='text-sm'>({report.damagedBuildingNames.join(', ')})</p>
                        </div>
                    ) : (
                        <p className="text-green-400 mt-4 font-bold">마을을 성공적으로 방어했습니다!</p>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-lg transition-colors duration-200 shadow-lg">
                    확인
                </button>
            </div>
        </div>
    );
};

const AchievementToast: React.FC<{ achievement: Achievement | null }> = ({ achievement }) => {
    if (!achievement) return null;

    const tierInfo = TIER_CONFIG[achievement.tier];

    return (
        <div className={`fixed top-5 right-5 bg-slate-800 border-l-4 ${tierInfo.borderColor} rounded-r-lg shadow-2xl p-4 max-w-sm w-full z-[60] animate-slide-in-out`}>
            <div className="flex items-center gap-3">
                <TrophyIcon className={`w-10 h-10 flex-shrink-0 ${tierInfo.color}`} />
                <div>
                    <p className="font-bold text-slate-100">도전 과제 달성!</p>
                    <p className="text-sm text-slate-300">{achievement.name}</p>
                </div>
            </div>
            <style>{`
                .animate-slide-in-out { animation: slideInAndOut 4s ease-in-out forwards; }
                @keyframes slideInAndOut {
                    0% { transform: translateX(120%); opacity: 0; }
                    15% { transform: translateX(0); opacity: 1; }
                    85% { transform: translateX(0); opacity: 1; }
                    100% { transform: translateX(120%); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

const AchievementModal: React.FC<{
    onClose: () => void;
    unlockedAchievements: string[];
}> = ({ onClose, unlockedAchievements }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    
    useEffect(() => {
        triggerRef.current = document.activeElement as HTMLElement;
        const modalNode = modalRef.current;
        if (modalNode) {
            modalNode.focus();
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            triggerRef.current?.focus();
        };
    }, [onClose]);
    
    const unlockedCount = unlockedAchievements.length;
    const totalCount = ACHIEVEMENTS.length;
    
    const renderReward = (reward: Achievement['reward']) => {
        const parts = [];
        if (reward.resources) {
            if (reward.resources.gold) parts.push(<span className="flex items-center gap-1"><GoldIcon className="w-3 h-3 text-yellow-400" /> +{reward.resources.gold}</span>);
            if (reward.resources.wood) parts.push(<span className="flex items-center gap-1"><WoodIcon className="w-3 h-3 text-amber-600" /> +{reward.resources.wood}</span>);
            if (reward.resources.stone) parts.push(<span className="flex items-center gap-1"><StoneIcon className="w-3 h-3 text-slate-500" /> +{reward.resources.stone}</span>);
            if (reward.resources.iron) parts.push(<span className="flex items-center gap-1"><IronIcon className="w-3 h-3 text-gray-400" /> +{reward.resources.iron}</span>);
            if (reward.resources.ancientShard) parts.push(<span className="flex items-center gap-1"><CubeTransparentIcon className="w-3 h-3 text-fuchsia-400" /> +{reward.resources.ancientShard}</span>);
        }
        if (reward.stats) {
            if (reward.stats.attack) parts.push(<span className="flex items-center gap-1"><SwordIcon className="w-3 h-3 text-red-400" /> 공격력 +{reward.stats.attack}</span>);
            if (reward.stats.defense) parts.push(<span className="flex items-center gap-1"><ShieldIcon className="w-3 h-3 text-sky-400" /> 방어력 +{reward.stats.defense}</span>);
            if (reward.stats.maxHp) parts.push(<span className="flex items-center gap-1"><HeartIcon className="w-3 h-3 text-green-400" /> 최대체력 +{reward.stats.maxHp}</span>);
        }

        return (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-semibold text-slate-400">보상:</span>
                {parts.map((part, i) => <React.Fragment key={i}>{part}</React.Fragment>)}
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
          <div 
            ref={modalRef} 
            className="bg-slate-800 rounded-lg shadow-xl max-w-3xl w-full border border-slate-700 max-h-[80vh] flex flex-col overflow-hidden" 
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="achievement-modal-title"
            tabIndex={-1}
          >
            <div className="flex-shrink-0 flex justify-between items-center p-6 border-b border-slate-700 bg-slate-800">
                <div>
                    <h2 id="achievement-modal-title" className="text-2xl font-bold text-violet-300">도전 과제</h2>
                    <p className="text-slate-400 text-sm">{unlockedCount} / {totalCount} 달성</p>
                </div>
              <button onClick={onClose} aria-label="닫기" className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
            </div>
            <div className="overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ACHIEVEMENTS.map(ach => {
                    const isUnlocked = unlockedAchievements.includes(ach.id);
                    const tierInfo = TIER_CONFIG[ach.tier];
                    return (
                        <div key={ach.id} className={`p-4 rounded-lg border transition-all ${isUnlocked ? `bg-slate-900/50 ${tierInfo.borderColor}/50` : 'bg-slate-900/20 border-slate-700'}`}>
                            <div className="flex items-start gap-4">
                                <TrophyIcon className={`w-10 h-10 flex-shrink-0 transition-colors ${isUnlocked ? tierInfo.color : 'text-slate-600'}`} />
                                <div className="flex-grow">
                                    <h3 className={`font-bold transition-colors ${isUnlocked ? 'text-slate-100' : 'text-slate-500'}`}>{ach.name}</h3>
                                    <p className={`text-sm mt-1 transition-colors ${isUnlocked ? 'text-slate-400' : 'text-slate-600'}`}>{ach.description}</p>
                                    
                                    <div className={`text-xs mt-2 pt-2 border-t transition-colors ${isUnlocked ? 'border-slate-700' : 'border-slate-800'}`}>
                                        {renderReward(ach.reward)}
                                    </div>
                                </div>
                                {isUnlocked && <CheckIcon className="w-6 h-6 text-green-400 flex-shrink-0" />}
                            </div>
                        </div>
                    );
                })}
              </div>
            </div>
          </div>
        </div>
    );
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.TOWN);
  const [player, setPlayer] = useState<Player>(INITIAL_PLAYER);
  const [resources, setResources] = useState<Resources>(INITIAL_RESOURCES);
  const [buildings, setBuildings] = useState<Building[]>(BUILDINGS);
  const [quests, setQuests] = useState<Quest[]>(QUESTS);
  const [furniture, setFurniture] = useState<Furniture[]>(FURNITURE_ITEMS);
  
  const [currentMonster, setCurrentMonster] = useState<Monster | null>(null);
  const [defeatedMonsters, setDefeatedMonsters] = useState<string[]>([]);
  
  const [activeDungeonRun, setActiveDungeonRun] = useState<{ dungeon: Dungeon; affixes: DungeonAffix[]; currentEventId: string; currentFloor?: number; } | null>(null);
  
  const [raidCountdown, setRaidCountdown] = useState(5);
  const [lastRaidReport, setLastRaidReport] = useState<{attackers: number, defense: number, damagedBuildingNames: string[]}|null>(null);

  const [gameLog, setGameLog] = useState<string[]>([]);
  const [combatTurn, setCombatTurn] = useState<'PLAYER' | 'MONSTER' | 'PAUSED'>('PAUSED');
  const [isDungeonModalOpen, setIsDungeonModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [craftingResult, setCraftingResult] = useState<EquippedItem | 'fail' | null>(null);
  const [lastCraftedItem, setLastCraftedItem] = useState<EquippedItem | 'fail' | null>(null);
  const [enchantResult, setEnchantResult] = useState<{item: EquippedItem, success: boolean, levelDown?: boolean} | null>(null);
  const [lastBuildingEvent, setLastBuildingEvent] = useState<{ id: string; type: 'build' | 'upgrade' } | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [townEvent, setTownEvent] = useState<TownEvent | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [achievementToast, setAchievementToast] = useState<Achievement | null>(null);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [highestFloorReached, setHighestFloorReached] = useState<number>(0);
  
  // World Boss State
  const [worldBoss, setWorldBoss] = useState<{ isActive: boolean; currentHp: number; timeRemaining: number; } | null>(null);
  const [worldBossSpawnCounter, setWorldBossSpawnCounter] = useState(10);

  const combatTimeoutRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  
  const appContentRef = useRef<HTMLDivElement>(null);

  const addToLog = useCallback((message: string) => {
    setGameLog(prevLog => [message, ...prevLog.slice(0, 9)]);
  }, []);

  // Load game from localStorage on initial mount
  useEffect(() => {
      const savedJSON = localStorage.getItem('dungeonAndStorySave');
      if (savedJSON) {
          try {
              const savedState = JSON.parse(savedJSON);

              // Player
              const savedPlayer = savedState.player || {};
              setPlayer({
                  ...INITIAL_PLAYER,
                  ...savedPlayer,
                  equipment: { ...INITIAL_PLAYER.equipment, ...(savedPlayer.equipment || {}) },
                  trainingLevels: { ...INITIAL_PLAYER.trainingLevels, ...(savedPlayer.trainingLevels || {}) },
                  potions: { ...INITIAL_PLAYER.potions, ...(savedPlayer.potions || {}) },
                  npcReputation: savedPlayer.npcReputation || {},
                  proficiency: { ...INITIAL_PLAYER.proficiency, ...(savedPlayer.proficiency || {}) },
              });
              
              // Resources
              setResources({ ...INITIAL_RESOURCES, ...(savedState.resources || {}) });

              // Buildings
              const savedBuildings = savedState.buildings || [];
              const mergedBuildings = BUILDINGS.map(defaultBuilding => {
                  const savedData = savedBuildings.find(b => b.id === defaultBuilding.id);
                  return savedData ? { ...defaultBuilding, ...savedData } : defaultBuilding;
              });
              setBuildings(mergedBuildings);

              // Furniture
              const savedFurniture = savedState.furniture || [];
              const mergedFurniture = FURNITURE_ITEMS.map(defaultFurniture => {
                  const savedData = savedFurniture.find(f => f.id === defaultFurniture.id);
                  return savedData ? { ...defaultFurniture, isPlaced: savedData.isPlaced } : defaultFurniture;
              });
              setFurniture(mergedFurniture);

              // Quests
              const savedQuests = savedState.quests || [];
              const mergedQuests = QUESTS.map(defaultQuest => {
                  const savedData = savedQuests.find(q => q.id === defaultQuest.id);
                  if (savedData) {
                      return { ...defaultQuest, status: savedData.status };
                  }
                  return defaultQuest;
              });
              setQuests(mergedQuests);

              setDefeatedMonsters(savedState.defeatedMonsters || []);
              setRaidCountdown(savedState.raidCountdown ?? 5);
              setTownEvent(savedState.townEvent || null);
              setUnlockedAchievements(savedState.unlockedAchievements || []);
              setHighestFloorReached(savedState.highestFloorReached || 0);
              setWorldBoss(savedState.worldBoss || null);
              setWorldBossSpawnCounter(savedState.worldBossSpawnCounter ?? 10);
              
              addToLog('저장된 게임을 불러왔습니다.');
          } catch (e) {
              console.error("저장된 게임을 불러오는데 실패했습니다:", e);
              localStorage.removeItem('dungeonAndStorySave');
              addToLog('저장 데이터가 손상되어 새로 시작합니다.');
          }
      }
      setIsLoaded(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  // Save game to localStorage on state changes
  useEffect(() => {
      if (!isLoaded) return; // Only save after initial load is complete

      const gameStateToSave = {
          player,
          resources,
          buildings,
          quests: quests.map(q => ({id: q.id, status: q.status})), // Only save what's important
          furniture: furniture.map(f => ({id: f.id, isPlaced: f.isPlaced})),
          defeatedMonsters,
          raidCountdown,
          townEvent,
          unlockedAchievements,
          highestFloorReached,
          worldBoss,
          worldBossSpawnCounter,
      };
      localStorage.setItem('dungeonAndStorySave', JSON.stringify(gameStateToSave));
  }, [isLoaded, player, resources, buildings, quests, furniture, defeatedMonsters, raidCountdown, townEvent, unlockedAchievements, highestFloorReached, worldBoss, worldBossSpawnCounter]);

  // Modal accessibility
  useEffect(() => {
    const isModalOpen = isDungeonModalOpen || isResetModalOpen || craftingResult !== null || enchantResult !== null || lastRaidReport !== null || isAchievementModalOpen;
    const contentElement = appContentRef.current;
    if (contentElement) {
        if (isModalOpen) {
            contentElement.setAttribute('aria-hidden', 'true');
            contentElement.inert = true;
        } else {
            contentElement.removeAttribute('aria-hidden');
            contentElement.inert = false;
        }
    }
  }, [isDungeonModalOpen, isResetModalOpen, craftingResult, enchantResult, lastRaidReport, isAchievementModalOpen]);

  // Achievement Logic
  const unlockAchievement = useCallback((achievement: Achievement) => {
      if (achievement.reward.resources) {
          const reward = achievement.reward.resources;
          setResources(prev => ({
              gold: prev.gold + (reward.gold || 0),
              wood: prev.wood + (reward.wood || 0),
              stone: prev.stone + (reward.stone || 0),
              iron: prev.iron + (reward.iron || 0),
              ancientShard: prev.ancientShard + (reward.ancientShard || 0),
          }));
      }
      if (achievement.reward.stats) {
          const stats = achievement.reward.stats;
          setPlayer(prev => {
              const maxHpIncrease = stats.maxHp || 0;
              return {
                  ...prev,
                  attack: prev.attack + (stats.attack || 0),
                  defense: prev.defense + (stats.defense || 0),
                  maxHp: prev.maxHp + maxHpIncrease,
                  hp: prev.hp + maxHpIncrease,
              };
          });
      }

      setAchievementToast(achievement);
      const timer = setTimeout(() => setAchievementToast(null), 4000);
      addToLog(`🏆 도전 과제 달성: ${achievement.name}!`);
      setUnlockedAchievements(prev => [...prev, achievement.id]);
      return () => clearTimeout(timer);
  }, [addToLog]);

  const checkAchievements = useCallback(() => {
      if (!isLoaded) return;
      const snapshot: GameStateSnapshot = { player, resources, buildings, quests, defeatedMonsters, furniture, lastCraftedItem, highestFloorReached, worldBoss };
      for (const achievement of ACHIEVEMENTS) {
          if (!unlockedAchievements.includes(achievement.id)) {
              if (achievement.goal(snapshot)) {
                  unlockAchievement(achievement);
              }
          }
      }
      if (lastCraftedItem) {
        setLastCraftedItem(null);
      }
  }, [isLoaded, player, resources, buildings, quests, defeatedMonsters, furniture, lastCraftedItem, highestFloorReached, worldBoss, unlockedAchievements, unlockAchievement]);

  useEffect(() => {
    checkAchievements();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, player, resources, buildings, quests, defeatedMonsters, furniture, lastCraftedItem, highestFloorReached, worldBoss]);


  useEffect(() => {
    return () => {
      if (combatTimeoutRef.current) clearTimeout(combatTimeoutRef.current);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  const stopCombat = useCallback(() => {
    if (combatTimeoutRef.current) {
      clearTimeout(combatTimeoutRef.current);
      combatTimeoutRef.current = null;
    }
  }, []);

  const handleTownRaid = useCallback(() => {
    const townDefense = buildings.reduce((acc, b) => {
        if (!b.built || b.damaged) return acc;
        const buildingDefense = b.defense || 0;
        const levelBonus = (b.level - 1) * (buildingDefense * 0.5);
        return acc + buildingDefense + levelBonus;
    }, 0);

    const completedStoryQuests = quests.filter(q => q.isStoryQuest && q.status === 'completed').length;
    const attackerStrength = 10 + defeatedMonsters.length * 5 + completedStoryQuests * 20;
    
    const damageDealt = Math.max(0, attackerStrength - townDefense);

    // Determine which buildings will be damaged
    const eligibleForDamage = buildings.filter(b => b.built && !b.damaged && !b.defense);
    const numBuildingsToDamage = Math.min(Math.floor(damageDealt / 30), eligibleForDamage.length);

    const shuffledEligible = eligibleForDamage.sort(() => 0.5 - Math.random());
    const buildingsToDamage = shuffledEligible.slice(0, numBuildingsToDamage);
    const damagedBuildingIds = buildingsToDamage.map(b => b.id);

    // Create the final versions of the states that will change.
    const newBuildingsState = buildings.map(b => 
        damagedBuildingIds.includes(b.id) ? { ...b, damaged: true } : b
    );
    
    const newRaidReport = {
        attackers: attackerStrength,
        defense: townDefense,
        damagedBuildingNames: buildingsToDamage.map(b => b.name),
    };

    // Set all states based on the calculated results.
    setBuildings(newBuildingsState);
    setLastRaidReport(newRaidReport);
    setRaidCountdown(5);
}, [buildings, defeatedMonsters, quests]);

  const endExplorationCycle = useCallback(() => {
    let currentTownEvent = townEvent;

    // Handle event duration/expiry
    if (currentTownEvent) {
        const newDuration = currentTownEvent.duration - 1;
        if (newDuration <= 0) {
            addToLog(`[이벤트] ${currentTownEvent.name}이(가) 마을을 떠났습니다.`);
            currentTownEvent = null;
        } else {
            currentTownEvent = { ...currentTownEvent, duration: newDuration };
        }
    }

    // Handle new event trigger
    if (!currentTownEvent) {
        // Trigger only if at least one building is constructed.
        if (buildings.some(b => b.built) && Math.random() < 0.25) {
            currentTownEvent = {
                id: 'traveling_merchant',
                name: '떠돌이 상인',
                description: '희귀한 물품을 싣고 온 상인이 마을에 잠시 머무릅니다. 이 기회를 놓치지 마세요!',
                duration: 3,
                items: [
                    { type: 'resource', id: 'iron', amount: 20, cost: { gold: 50, wood: 0, stone: 0, iron: 0, ancientShard: 0 }, stock: 3 },
                    { type: 'potion', id: 'health_potion', amount: 1, cost: { gold: 10, wood: 0, stone: 0, iron: 0, ancientShard: 0 }, stock: 5 },
                ]
            };
            addToLog(`[이벤트] ${currentTownEvent.name}이(가) 마을에 도착했습니다!`);
        }
    }
    
    setTownEvent(currentTownEvent);
    
    // Handle raid countdown
    const newCountdown = raidCountdown - 1;
    if (newCountdown <= 0) {
      handleTownRaid();
    } else {
      setRaidCountdown(newCountdown);
      addToLog(`다음 몬스터 습격까지 ${newCountdown}번의 탐험이 남았습니다.`);
    }

    // --- World Boss Logic ---
    const isFinalQuestDone = quests.find(q => q.id === 'sq3_final_stand')?.status === 'completed';
    
    if (worldBoss?.isActive) {
        const newTimeRemaining = worldBoss.timeRemaining - 1;
        if (newTimeRemaining <= 0) {
            setWorldBoss(null);
            addToLog('[월드 보스] 고대의 거상이 활동을 멈추고 땅 속으로 사라졌습니다.');
        } else {
            setWorldBoss(wb => wb ? { ...wb, timeRemaining: newTimeRemaining } : null);
            addToLog(`[월드 보스] 고대의 거상이 사라지기까지 앞으로 ${newTimeRemaining}번의 탐험.`);
        }
    } else if (isFinalQuestDone) {
        const newSpawnCounter = worldBossSpawnCounter - 1;
        if (newSpawnCounter <= 0) {
            const colossusData = MONSTERS['ancient_colossus'];
            setWorldBoss({
                isActive: true,
                currentHp: colossusData.maxHp,
                timeRemaining: 3
            });
            setWorldBossSpawnCounter(10); // Reset for next time
            addToLog('땅이 울리며 거대한 존재가 깨어납니다! [월드 보스] 고대의 거상이 나타났습니다!');
        } else {
            setWorldBossSpawnCounter(newSpawnCounter);
        }
    }

  }, [raidCountdown, townEvent, handleTownRaid, addToLog, buildings, quests, worldBoss, worldBossSpawnCounter]);


  const returnToTown = useCallback(() => {
    stopCombat();
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    
    const cameFromDungeon = gameState === GameState.EXPLORING || gameState === GameState.IN_DUNGEON;
    
    setGameState(GameState.TOWN);
    setCurrentMonster(null);
    setActiveDungeonRun(null);
    setGameLog(prev => ['마을로 돌아왔습니다.', ...prev.slice(0, 9)]);
    setCombatTurn('PAUSED');
    
    // Don't clear buffs if it's a world boss fight retreat
    if (currentMonster?.id !== 'ancient_colossus') {
      setPlayer(p => ({ ...p, buffs: null })); // Clear buffs
    }

    if (cameFromDungeon) {
      endExplorationCycle();
    }
  }, [stopCombat, gameState, endExplorationCycle, currentMonster]);

  const resetGame = () => {
    stopCombat();
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    
    localStorage.removeItem('dungeonAndStorySave');

    setGameState(GameState.TOWN);
    setPlayer(INITIAL_PLAYER);
    setResources(INITIAL_RESOURCES);
    setBuildings(BUILDINGS.map(b => ({...b, built: false, level: 1, damaged: false })));
    setQuests(QUESTS.map(q => ({...q, status: 'available' })));
    setFurniture(FURNITURE_ITEMS.map(f => ({ ...f, isPlaced: false })));
    setCurrentMonster(null);
    setDefeatedMonsters([]);
    setGameLog(['게임을 초기화했습니다.']);
    setCombatTurn('PAUSED');
    setActiveDungeonRun(null);
    setRaidCountdown(5);
    setLastRaidReport(null);
    setTownEvent(null);
    setUnlockedAchievements([]);
    setHighestFloorReached(0);
    setWorldBoss(null);
    setWorldBossSpawnCounter(10);
  };
  
  const handleNavigateToTown = useCallback(() => {
    if (gameState !== GameState.TOWN) {
        returnToTown();
    }
  }, [gameState, returnToTown]);

  const handleNavigateToDungeon = useCallback(() => {
      if (gameState === GameState.TOWN) {
          setIsDungeonModalOpen(true);
      }
  }, [gameState]);
  
  const applyAffixModifiersToResources = useCallback((baseResources: Partial<Resources>, affixes: DungeonAffix[]): Partial<Resources> => {
      let modifiedResources = {...baseResources};
      affixes.forEach(affix => {
          if (affix.id === 'resource_abundance' || affix.id === 'golden_touch') {
              modifiedResources = affix.apply(modifiedResources);
          }
      });
      return modifiedResources;
  }, []);

  const handleExplorationEvent = useCallback((eventId: string) => {
    if (!activeDungeonRun) return;
    
    setGameState(GameState.EXPLORING);

    let runToProcess = { ...activeDungeonRun };

    // Handle floor increment for infinite rift
    if (runToProcess.dungeon.id === 'infinite_rift' && eventId === 'start' && runToProcess.currentEventId === 'floor_cleared') {
        const newFloor = (runToProcess.currentFloor || 0) + 1;
        runToProcess = { ...runToProcess, currentFloor: newFloor };
        setActiveDungeonRun(runToProcess);
    }
    
    if (eventId === 'town') {
      addToLog('던전을 클리어하고 마을로 돌아갑니다.');
      transitionTimeoutRef.current = window.setTimeout(() => {
        returnToTown();
      }, 1500);
      return;
    }
    
    const event = runToProcess.dungeon.events[eventId];
    if (!event) {
        returnToTown();
        return;
    };

    setActiveDungeonRun(prev => prev ? {...prev, currentEventId: eventId} : null);

    switch (event.type) {
      case 'monster':
        let monsterData: MonsterData | null = null;
        if (runToProcess.dungeon.id === 'infinite_rift' && event.monsterId === 'random') {
            const floor = runToProcess.currentFloor || 1;
            const monsterIds = Object.keys(MONSTERS).filter(id => id !== 'shadow_dragon' && id !== 'ancient_colossus');
            const randomId = monsterIds[Math.floor(Math.random() * monsterIds.length)];
            const baseMonster = MONSTERS[randomId];

            monsterData = {
                ...baseMonster,
                maxHp: Math.ceil(baseMonster.maxHp * (1 + (floor - 1) * 0.15)),
                attack: Math.ceil(baseMonster.attack * (1 + (floor - 1) * 0.1)),
            };
            addToLog(`균열 ${floor}층에서 ${monsterData.name}을(를) 만났습니다!`);
        } else {
            monsterData = { ...MONSTERS[event.monsterId] };
            runToProcess.affixes.forEach(affix => {
                if (affix.id === 'tough_monsters' || affix.id === 'aggressive_monsters') {
                    monsterData = affix.apply(monsterData);
                }
            });
        }
        
        if (monsterData) {
          setCurrentMonster({ ...monsterData, hp: monsterData.maxHp });
          setGameState(GameState.IN_DUNGEON);
          addToLog(`${monsterData.name}이(가) 나타났습니다!`);
          setCombatTurn('PLAYER');
        }
        break;
      case 'treasure':
        let reward = event.reward;
        reward = applyAffixModifiersToResources(reward, runToProcess.affixes);

        const totalGoldBonusFromFurniture = furniture
            .filter(f => f.isPlaced && f.goldBonus)
            .reduce((acc, f) => acc + (f.goldBonus || 0), 0);

        if (totalGoldBonusFromFurniture > 0 && reward.gold) {
            const bonusGold = Math.ceil(reward.gold * totalGoldBonusFromFurniture);
            reward.gold += bonusGold;
            addToLog(`가구 효과로 골드 획득량이 증가했습니다! (+${bonusGold} G)`);
        }

        addToLog(event.text);
        if (reward) {
          setResources(prev => {
            let logMsg = '보상 획득:';
            const newRes = {...prev};
            if(reward.gold) { newRes.gold += reward.gold; logMsg += ` G+${reward.gold}` }
            if(reward.wood) { newRes.wood += reward.wood; logMsg += ` W+${reward.wood}` }
            if(reward.stone) { newRes.stone += reward.stone; logMsg += ` S+${reward.stone}` }
            if(reward.iron) { newRes.iron += reward.iron; logMsg += ` I+${reward.iron}` }
            addToLog(logMsg);
            return newRes;
          });
        }
        transitionTimeoutRef.current = window.setTimeout(() => handleExplorationEvent(event.nextEventId), 1000);
        break;
      case 'trap':
        let damage = event.damage;
        const deadlyTrapAffix = runToProcess.affixes.find(a => a.id === 'deadly_traps');
        if (deadlyTrapAffix) {
            damage = deadlyTrapAffix.apply(damage);
        }
        addToLog(event.text);
        setPlayer(p => ({...p, hp: Math.max(0, p.hp - damage)}));
        transitionTimeoutRef.current = window.setTimeout(() => handleExplorationEvent(event.nextEventId), 1000);
        break;
      case 'choice':
        addToLog(event.text);
        break;
    }

  }, [activeDungeonRun, addToLog, returnToTown, applyAffixModifiersToResources, furniture]);


  const handleEnterDungeon = useCallback((dungeonId: string) => {
    setIsDungeonModalOpen(false);
    stopCombat();

    if (dungeonId === 'world_boss' && worldBoss) {
      const bossData = MONSTERS['ancient_colossus'];
      setCurrentMonster({ ...bossData, hp: worldBoss.currentHp });
      setGameState(GameState.IN_DUNGEON);
      addToLog(`[월드 보스] ${bossData.name}와(과) 전투를 시작합니다!`);
      setCombatTurn('PLAYER');
      return;
    }

    const dungeon = DUNGEONS.find(d => d.id === dungeonId);
    if (!dungeon) return;
    
    // Generate affixes for this run
    const availableAffixes = [...DUNGEON_AFFIXES];
    const chosenAffixes: DungeonAffix[] = [];
    if (dungeon.id !== 'infinite_rift') {
        const dungeonIndex = DUNGEONS.findIndex(d => d.id === dungeonId);
        const numAffixes = dungeonIndex > 1 ? (Math.random() < 0.3 ? 2 : 1) : 1;

        for (let i = 0; i < numAffixes; i++) {
            if (availableAffixes.length === 0) break;
            const randomIndex = Math.floor(Math.random() * availableAffixes.length);
            chosenAffixes.push(availableAffixes[randomIndex]);
            availableAffixes.splice(randomIndex, 1);
        }
    }

    const consumableLogs: string[] = [];
    const consumableAttackBuffs = [
      { id: 'sharpening_stone', value: 10, name: '숫돌'},
      { id: 'giants_strength_potion', value: 25, name: '거인의 힘 물약'}
    ];
    const consumableDefenseBuffs = [
      { id: 'shielding_oil', value: 10, name: '보호 기름'},
      { id: 'stoneskin_elixir', value: 25, name: '강철피부 비약'}
    ];

    let totalAttackBuff = 0;
    let totalDefenseBuff = 0;
    const newPotions = { ...player.potions };
    
    consumableAttackBuffs.forEach(b => {
      if (newPotions[b.id as keyof typeof newPotions] > 0) {
        totalAttackBuff += b.value;
        newPotions[b.id as keyof typeof newPotions]--;
        consumableLogs.push(`${b.name}을(를) 사용하여 이번 탐험의 공격력이 ${b.value} 증가합니다.`);
      }
    });

    consumableDefenseBuffs.forEach(b => {
      if (newPotions[b.id as keyof typeof newPotions] > 0) {
        totalDefenseBuff += b.value;
        newPotions[b.id as keyof typeof newPotions]--;
        consumableLogs.push(`${b.name}을(를) 사용하여 이번 탐험의 방어력이 ${b.value} 증가합니다.`);
      }
    });

    setPlayer(p => {
        const currentBuffs = p.buffs || { attack: 0, defense: 0 };
        const newBuffs = {
            attack: currentBuffs.attack + totalAttackBuff,
            defense: currentBuffs.defense + totalDefenseBuff,
        };
        
        return {
            ...p,
            hp: p.buffs ? p.hp : p.maxHp, // Heal to full if no existing buffs (from inn)
            buffs: (newBuffs.attack > 0 || newBuffs.defense > 0) ? newBuffs : null,
            potions: newPotions,
        };
    });
    
    const newActiveRun = {
      dungeon,
      affixes: chosenAffixes,
      currentEventId: dungeon.startEventId,
      ...(dungeon.id === 'infinite_rift' && { currentFloor: 0 })
    };
    setActiveDungeonRun(newActiveRun);
    addToLog(`[${dungeon.name}]에 입장했습니다.`);
    consumableLogs.forEach(log => addToLog(log));
    
  }, [stopCombat, player.potions, addToLog, worldBoss]);


  const handleBuild = useCallback((buildingId: string) => {
    const buildingToBuild = buildings.find(b => b.id === buildingId);
    if (!buildingToBuild || buildingToBuild.built) return;

    const cost = buildingToBuild.cost;
    if (resources.gold >= cost.gold && resources.wood >= cost.wood && resources.stone >= cost.stone && resources.iron >= cost.iron) {
      setResources(prev => ({
        ...prev,
        gold: prev.gold - cost.gold,
        wood: prev.wood - cost.wood,
        stone: prev.stone - cost.stone,
        iron: prev.iron - cost.iron,
      }));
      setBuildings(prev => prev.map(b => b.id === buildingId ? { ...b, built: true } : b));
      addToLog(`${buildingToBuild.name}을(를) 건설했습니다!`);
      setLastBuildingEvent({ id: buildingId, type: 'build' });
      setTimeout(() => setLastBuildingEvent(null), 2000);
    } else {
      addToLog('자원이 부족합니다.');
    }
  }, [buildings, resources, addToLog]);

  const handlePlaceFurniture = useCallback((furnitureId: string) => {
    const itemToPlace = furniture.find(f => f.id === furnitureId);
    if (!itemToPlace || itemToPlace.isPlaced) return;

    const cost = itemToPlace.cost;
    if (resources.gold >= cost.gold && resources.wood >= cost.wood && resources.stone >= cost.stone && resources.iron >= cost.iron) {
      setResources(prev => ({
        ...prev,
        gold: prev.gold - cost.gold,
        wood: prev.wood - cost.wood,
        stone: prev.stone - cost.stone,
        iron: prev.iron - cost.iron,
      }));

      setFurniture(prev => prev.map(f => f.id === furnitureId ? { ...f, isPlaced: true } : f));

      setPlayer(p => {
          const newPlayerState = { ...p };
          const effect = itemToPlace.effect;
          newPlayerState.attack += effect.attack || 0;
          newPlayerState.defense += effect.defense || 0;
          const maxHpIncrease = effect.maxHp || 0;
          newPlayerState.maxHp += maxHpIncrease;
          if (maxHpIncrease > 0) {
            newPlayerState.hp += maxHpIncrease;
          }
          return newPlayerState;
      });

      addToLog(`[나의 집] ${itemToPlace.name}을(를) 배치했습니다! (${itemToPlace.description})`);
    } else {
      addToLog('자원이 부족하여 가구를 배치할 수 없습니다.');
    }
  }, [furniture, resources, addToLog]);

  const getTotalEnchantBonus = useCallback((item: EquippedItem | null): { attack: number, defense: number } => {
    if (!item || item.enchantLevel === 0) return { attack: 0, defense: 0 };
    
    let bonusPerLevel = 1;
    if (item.grade === 'rare') bonusPerLevel = 2;
    else if (item.grade === 'epic') bonusPerLevel = 3;

    if (item.type === 'weapon') {
        return { attack: bonusPerLevel * item.enchantLevel, defense: 0 };
    }
    return { attack: 0, defense: bonusPerLevel * item.enchantLevel };
  }, []);

  const handleProficiencyExp = useCallback((type: 'blacksmithing' | 'alchemy', amount: number) => {
    const totalProficiencyBonus = furniture
        .filter(f => f.isPlaced && f.proficiencyBonus)
        .reduce((acc, f) => acc + (f.proficiencyBonus || 0), 0);

    const finalAmount = Math.ceil(amount * (1 + totalProficiencyBonus));

    if (totalProficiencyBonus > 0 && finalAmount > amount) {
        addToLog(`가구 효과로 숙련도 획득량이 증가했습니다! (+${finalAmount - amount} XP)`);
    }

    setPlayer(p => {
        const newProficiency = { ...p.proficiency };
        const current = newProficiency[type];
        let newExp = current.exp + finalAmount;
        let newLevel = current.level;
        
        let expToLevelUp = PROFICIENCY_EXP_TO_LEVEL_UP(newLevel);
        
        while (newExp >= expToLevelUp) {
            newLevel++;
            newExp -= expToLevelUp;
            const proficiencyName = type === 'blacksmithing' ? '대장 기술' : '연금술';
            addToLog(`✨ ${proficiencyName} 숙련도가 Lv.${newLevel}로 상승했습니다!`);
            expToLevelUp = PROFICIENCY_EXP_TO_LEVEL_UP(newLevel);
        }
        
        newProficiency[type] = { level: newLevel, exp: newExp };
        
        return { ...p, proficiency: newProficiency };
    });
  }, [addToLog, furniture]);

  const handleCraft = useCallback((itemId: string) => {
    const recipe = CRAFTABLE_ITEMS.find(i => i.id === itemId);
    const blacksmith = buildings.find(b => b.id === 'blacksmith');
    if (!recipe || !blacksmith || !blacksmith.built || blacksmith.damaged) return;

    const cost = recipe.cost;
    if (resources.gold >= cost.gold && resources.wood >= cost.wood && resources.stone >= cost.stone && resources.iron >= cost.iron) {
      setResources(prev => ({
        ...prev,
        gold: prev.gold - cost.gold,
        wood: prev.wood - cost.wood,
        stone: prev.stone - cost.stone,
        iron: prev.iron - cost.iron,
      }));
      
      handleProficiencyExp('blacksmithing', 10);
      
      const rand = Math.random();
      let grade: ItemGrade;
      const blacksmithBuildingLevel = blacksmith.level > 3 ? 3 : blacksmith.level as 1 | 2 | 3;
      
      const profLevel = player.proficiency.blacksmithing.level;
      const proficiencyBonus = (profLevel - 1) * 0.005; // 0.5% per level

      const gradeProbs = {
          1: { epic: 0.0 + proficiencyBonus, rare: 0.2 + proficiencyBonus * 2 },
          2: { epic: 0.05 + proficiencyBonus, rare: 0.35 + proficiencyBonus * 2 },
          3: { epic: 0.15 + proficiencyBonus, rare: 0.45 + proficiencyBonus * 2 },
      };
      
      const prob = gradeProbs[blacksmithBuildingLevel];
      if (rand < prob.epic) grade = 'epic';
      else if (rand < prob.epic + prob.rare) grade = 'rare';
      else grade = 'common';

      const gradeInfo = GRADE_CONFIG[grade];
      const newStats: Required<ItemEffect> = {
          attack: Math.ceil((recipe.baseStats.attack || 0) * gradeInfo.multiplier),
          defense: Math.ceil((recipe.baseStats.defense || 0) * gradeInfo.multiplier),
          maxHp: Math.ceil((recipe.baseStats.maxHp || 0) * gradeInfo.multiplier),
      };
      
      const newItem: EquippedItem = {
          recipeId: recipe.id,
          name: recipe.name,
          type: recipe.type,
          grade: grade,
          stats: newStats,
          enchantLevel: 0,
      };

      const currentItem = player.equipment[newItem.type];
      const getScore = (stats: ItemEffect) => (stats.attack || 0) + (stats.defense || 0) + (stats.maxHp || 0) / 4;
      
      if (getScore(newItem.stats) > getScore(currentItem?.stats || { attack: 0, defense: 0, maxHp: 0 })) {
        setPlayer(p => {
            const newPlayerState = { ...p };
            const oldItem = p.equipment[newItem.type];
            
            const oldStats = oldItem?.stats || { attack: 0, defense: 0, maxHp: 0 };
            const oldEnchantBonus = getTotalEnchantBonus(oldItem);
            
            const hpDiff = newItem.stats.maxHp - oldStats.maxHp;

            newPlayerState.attack = p.attack - (oldStats.attack + oldEnchantBonus.attack) + newItem.stats.attack;
            newPlayerState.defense = p.defense - (oldStats.defense + oldEnchantBonus.defense) + newItem.stats.defense;
            newPlayerState.maxHp = p.maxHp + hpDiff;
            newPlayerState.hp = p.hp + hpDiff;
            newPlayerState.equipment[newItem.type] = newItem;
            return newPlayerState;
        });
        addToLog(`새로운 [${gradeInfo.name}] ${newItem.name}을(를) 제작하여 장착했습니다!`);
        setCraftingResult(newItem);
        setLastCraftedItem(newItem);
      } else {
        addToLog(`[${gradeInfo.name}] ${newItem.name}을(를) 제작했지만, 현재 장비보다 좋지 않아 장착하지 않았습니다.`);
        setCraftingResult('fail');
        setLastCraftedItem(newItem);
      }
      setTimeout(() => setCraftingResult(null), 3000);
    } else {
      addToLog('자원이 부족합니다.');
    }
  }, [buildings, resources, player, addToLog, getTotalEnchantBonus, handleProficiencyExp]);

  const handleCraftPotion = useCallback((potionId: CraftablePotion['id']) => {
    const potionToCraft = CRAFTABLE_POTIONS.find(p => p.id === potionId);
    const alchemyLab = buildings.find(b => b.id === 'alchemy_lab');
    if (!potionToCraft || !alchemyLab || !alchemyLab.built || alchemyLab.damaged) return;
    
    const currentAmount = player.potions[potionId];
    if (currentAmount >= potionToCraft.maxQuantity) {
        addToLog(`${potionToCraft.name}을(를) 더 이상 소지할 수 없습니다.`);
        return;
    }

    const cost = potionToCraft.cost;
    if (resources.gold >= cost.gold && resources.wood >= cost.wood && resources.stone >= cost.stone && resources.iron >= cost.iron && resources.ancientShard >= (cost.ancientShard || 0)) {
        setResources(prev => ({
            ...prev,
            gold: prev.gold - cost.gold,
            wood: prev.wood - cost.wood,
            stone: prev.stone - cost.stone,
            iron: prev.iron - cost.iron,
            ancientShard: prev.ancientShard - (cost.ancientShard || 0),
        }));

        handleProficiencyExp('alchemy', 5);

        const profLevel = player.proficiency.alchemy.level;
        const extraCraftChance = (profLevel - 1) * 0.01;
        const gotExtra = Math.random() < extraCraftChance;
        const amountToCraft = 1 + (gotExtra ? 1 : 0);
        
        const newAmount = Math.min(potionToCraft.maxQuantity, currentAmount + amountToCraft);
        const actualAmountCrafted = newAmount - currentAmount;
        
        if (actualAmountCrafted <= 0) return;

        setPlayer(prev => ({
            ...prev,
            potions: { ...prev.potions, [potionId]: newAmount }
        }));
        
        if (gotExtra && actualAmountCrafted > 1) {
             addToLog(`연금술 숙련도 효과로 ${potionToCraft.name}을(를) 추가로 1개 더 제작했습니다!`);
        }
        addToLog(`${potionToCraft.name}을(를) ${actualAmountCrafted}개 제작했습니다.`);

    } else {
        addToLog('자원이 부족하여 물약을 제작할 수 없습니다.');
    }
}, [player, resources, addToLog, buildings, handleProficiencyExp]);

  const getEnchantInfo = useCallback((item: EquippedItem) => {
      const level = item.enchantLevel;
      const cost: Resources = {
          gold: Math.floor(20 * Math.pow(1.8, level)),
          iron: Math.floor(10 * Math.pow(2, level)),
          wood: 0, stone: 0, ancientShard: 0
      };
      const successRate = Math.max(0.1, 1 - (level * 0.1));
      
      let bonusPerLevel = 1;
      if (item.grade === 'rare') bonusPerLevel = 2;
      else if (item.grade === 'epic') bonusPerLevel = 3;

      const bonus = item.type === 'weapon' 
          ? { attack: bonusPerLevel, defense: 0 }
          : { attack: 0, defense: bonusPerLevel };

      return { cost, successRate, bonus };
  }, []);

  const handleEnchant = useCallback((type: 'weapon' | 'armor') => {
    const item = player.equipment[type];
    if (!item) return;

    const { cost, successRate, bonus } = getEnchantInfo(item);

    if (resources.gold < cost.gold || resources.iron < cost.iron) {
        addToLog('장비 강화에 필요한 자원이 부족합니다.');
        return;
    }
    
    setResources(prev => ({
        ...prev,
        gold: prev.gold - cost.gold,
        iron: prev.iron - cost.iron,
    }));
    
    const isSuccess = Math.random() < successRate;

    if (isSuccess) {
        const newItem = { ...item, enchantLevel: item.enchantLevel + 1 };
        
        setPlayer(p => ({
            ...p,
            attack: p.attack + bonus.attack,
            defense: p.defense + bonus.defense,
            equipment: {
                ...p.equipment,
                [type]: newItem
            }
        }));
        addToLog(`${item.name} 강화에 성공했습니다! (+${newItem.enchantLevel})`);
        setEnchantResult({ item: newItem, success: true });
    } else {
        const levelDown = item.enchantLevel > 0;
        const newItem = levelDown ? { ...item, enchantLevel: item.enchantLevel - 1 } : item;

        if (levelDown) {
            setPlayer(p => ({
                ...p,
                attack: p.attack - bonus.attack,
                defense: p.defense - bonus.defense,
                equipment: {
                    ...p.equipment,
                    [type]: newItem
                }
            }));
            addToLog(`${item.name} 강화에 실패하여 강화 단계가 하락했습니다... (+${item.enchantLevel} → +${newItem.enchantLevel})`);
        } else {
            addToLog(`${item.name} 강화에 실패했습니다...`);
        }
        setEnchantResult({ item: newItem, success: false, levelDown });
    }
    
    setTimeout(() => setEnchantResult(null), 3000);
  }, [player, resources, addToLog, getEnchantInfo]);

  const calculateTrainingCost = useCallback((training: Training, level: number): Resources => {
    const trainingGround = buildings.find(b => b.id === 'training_ground');
    const costReductionFactor = trainingGround && trainingGround.built ? 1 - (trainingGround.level - 1) * 0.05 : 1;
    const costMultiplier = Math.pow(1.2, level);
    return {
      gold: Math.floor(training.baseCost.gold * costMultiplier * costReductionFactor),
      wood: Math.floor(training.baseCost.wood * costMultiplier * costReductionFactor),
      stone: Math.floor(training.baseCost.stone * costMultiplier * costReductionFactor),
      iron: Math.floor(training.baseCost.iron * costMultiplier * costReductionFactor),
      ancientShard: 0,
    };
  }, [buildings]);

  const handleTrain = useCallback((trainingId: 'attack' | 'defense' | 'maxHp') => {
    const trainingOption = TRAINING_OPTIONS.find(t => t.id === trainingId);
    const trainingGround = buildings.find(b => b.id === 'training_ground');
    if (!trainingOption || !trainingGround || !trainingGround.built || trainingGround.damaged) return;
    
    const currentLevel = player.trainingLevels[trainingId];
    const cost = calculateTrainingCost(trainingOption, currentLevel);

    if (resources.gold >= cost.gold && resources.wood >= cost.wood && resources.stone >= cost.stone && resources.iron >= cost.iron) {
      setResources(prev => ({
        ...prev,
        gold: prev.gold - cost.gold,
        wood: prev.wood - cost.wood,
        stone: prev.stone - cost.stone,
        iron: prev.iron - cost.iron,
      }));
      
      setPlayer(prev => {
        const newPlayerState = { ...prev };
        newPlayerState.attack += trainingOption.effect.attack || 0;
        newPlayerState.defense += trainingOption.effect.defense || 0;
        const maxHpIncrease = trainingOption.effect.maxHp || 0;
        newPlayerState.maxHp += maxHpIncrease;
        if (maxHpIncrease > 0) {
          newPlayerState.hp += maxHpIncrease;
        }
        newPlayerState.trainingLevels[trainingId] += 1;
        return newPlayerState;
      });

      addToLog(`${trainingOption.name} 완료! 능력치가 상승했습니다. (Lv.${currentLevel + 1})`);
    } else {
      addToLog('자원이 부족하여 훈련할 수 없습니다.');
    }
  }, [player, resources, addToLog, calculateTrainingCost, buildings]);
  
  const calculateInnExpansionCost = useCallback((level: number): Resources => {
    const costMultiplier = Math.pow(1.5, level); // Increase cost by 50% each level
    return {
      gold: Math.floor(30 * costMultiplier),
      wood: Math.floor(50 * costMultiplier),
      stone: Math.floor(40 * costMultiplier),
      iron: Math.floor(10 * costMultiplier),
      ancientShard: 0,
    };
  }, []);

  const handleRest = useCallback(() => {
    const inn = buildings.find(b => b.id === 'inn');
    if (!inn || !inn.built || inn.damaged) return;
    const cost = { gold: 15, wood: 0, stone: 0, iron: 0, ancientShard: 0 };
    if (resources.gold >= cost.gold) {
      const buffAmount = 5 + (inn.level - 1) * 2;
      setResources(prev => ({ ...prev, gold: prev.gold - cost.gold }));
      setPlayer(prev => ({ ...prev, buffs: { attack: buffAmount, defense: buffAmount } }));
      addToLog(`여관에서 편안하게 휴식했습니다. 다음 전투에서 능력치가 상승합니다. (공격력 +${buffAmount}, 방어력 +${buffAmount})`);
    } else {
      addToLog('골드가 부족하여 휴식할 수 없습니다.');
    }
  }, [resources, addToLog, buildings]);

  const handleExpandInn = useCallback(() => {
    const inn = buildings.find(b => b.id === 'inn');
    if (!inn || !inn.built || inn.damaged) return;
    const currentLevel = player.trainingLevels.inn;
    const cost = calculateInnExpansionCost(currentLevel);

    if (resources.gold >= cost.gold && resources.wood >= cost.wood && resources.stone >= cost.stone && resources.iron >= cost.iron) {
      setResources(prev => ({
        ...prev,
        gold: prev.gold - cost.gold,
        wood: prev.wood - cost.wood,
        stone: prev.stone - cost.stone,
        iron: prev.iron - cost.iron,
      }));

      setPlayer(prev => {
        const newPlayerState = { ...prev };
        const maxHpIncrease = 10;
        newPlayerState.maxHp += maxHpIncrease;
        newPlayerState.hp += maxHpIncrease;
        newPlayerState.trainingLevels.inn += 1;
        return newPlayerState;
      });

      addToLog(`여관 객실을 증축했습니다! 최대 체력이 10 상승했습니다. (Lv.${currentLevel + 1})`);
    } else {
      addToLog('자원이 부족하여 증축할 수 없습니다.');
    }
  }, [player, resources, addToLog, calculateInnExpansionCost, buildings]);

  const calculateBuildingUpgradeCost = useCallback((building: Building): Resources => {
    const costMultiplier = Math.pow(1.8, building.level); // Increase cost by 80% for each new level
    return {
      gold: Math.floor(building.baseUpgradeCost.gold * costMultiplier),
      wood: Math.floor(building.baseUpgradeCost.wood * costMultiplier),
      stone: Math.floor(building.baseUpgradeCost.stone * costMultiplier),
      iron: Math.floor(building.baseUpgradeCost.iron * costMultiplier),
      ancientShard: 0,
    };
  }, []);

  const handleUpgradeBuilding = useCallback((buildingId: string) => {
    const buildingToUpgrade = buildings.find(b => b.id === buildingId);
    if (!buildingToUpgrade || !buildingToUpgrade.built || buildingToUpgrade.damaged) return;

    if (buildingToUpgrade.maxLevel && buildingToUpgrade.level >= buildingToUpgrade.maxLevel) {
        addToLog(`${buildingToUpgrade.name}은(는) 이미 최고 레벨입니다.`);
        return;
    }

    const cost = calculateBuildingUpgradeCost(buildingToUpgrade);
    if (resources.gold >= cost.gold && resources.wood >= cost.wood && resources.stone >= cost.stone && resources.iron >= cost.iron) {
      setResources(prev => ({
        ...prev,
        gold: prev.gold - cost.gold,
        wood: prev.wood - cost.wood,
        stone: prev.stone - cost.stone,
        iron: prev.iron - cost.iron,
      }));
      setBuildings(prev => prev.map(b => b.id === buildingId ? { ...b, level: b.level + 1 } : b));
      addToLog(`${buildingToUpgrade.name}을(를) 업그레이드했습니다! (Lv.${buildingToUpgrade.level + 1})`);
      setLastBuildingEvent({ id: buildingId, type: 'upgrade' });
      setTimeout(() => setLastBuildingEvent(null), 2000);
    } else {
      addToLog('자원이 부족하여 업그레이드할 수 없습니다.');
    }
  }, [buildings, resources, addToLog, calculateBuildingUpgradeCost]);

  const calculateRepairCost = useCallback((building: Building): Resources => {
    return {
      gold: Math.floor(building.cost.gold * 0.25),
      wood: Math.floor(building.cost.wood * 0.25),
      stone: Math.floor(building.cost.stone * 0.25),
      iron: Math.floor(building.cost.iron * 0.25),
      ancientShard: 0,
    };
  }, []);

  const handleRepairBuilding = useCallback((buildingId: string) => {
    const buildingToRepair = buildings.find(b => b.id === buildingId);
    if (!buildingToRepair || !buildingToRepair.damaged) return;

    const cost = calculateRepairCost(buildingToRepair);
    if (resources.gold >= cost.gold && resources.wood >= cost.wood && resources.stone >= cost.stone && resources.iron >= cost.iron) {
      setResources(prev => ({
        ...prev,
        gold: prev.gold - cost.gold,
        wood: prev.wood - cost.wood,
        stone: prev.stone - cost.stone,
        iron: prev.iron - cost.iron,
      }));
      setBuildings(prev => prev.map(b => b.id === buildingId ? { ...b, damaged: false } : b));
      addToLog(`${buildingToRepair.name}을(를) 수리했습니다.`);
    } else {
      addToLog('자원이 부족하여 수리할 수 없습니다.');
    }
  }, [buildings, resources, addToLog, calculateRepairCost]);


  const handleSellResource = useCallback((resource: 'wood' | 'stone' | 'iron', amount: number) => {
    const market = buildings.find(b => b.id === 'market');
    if (!market || !market.built || market.damaged) return;
    const sellPrices = { wood: 1, stone: 1, iron: 3 };
    if (resources[resource] >= amount) {
        const goldEarned = sellPrices[resource] * amount;
        setResources(prev => ({
            ...prev,
            [resource]: prev[resource] - amount,
            gold: prev.gold + goldEarned,
        }));
        const resourceName = { wood: '목재', stone: '석재', iron: '철광석' }[resource];
        addToLog(`${resourceName} ${amount}개를 팔아 ${goldEarned} 골드를 얻었습니다.`);
    } else {
        addToLog('판매할 자원이 부족합니다.');
    }
}, [resources, addToLog, buildings]);

const handleBuyResource = useCallback((resource: 'wood' | 'stone' | 'iron', amount: number) => {
    const market = buildings.find(b => b.id === 'market');
    if (!market || !market.built || market.damaged) return;

    const buyPrices: Record<'wood' | 'stone' | 'iron', number> = { wood: 2, stone: 2, iron: 5 };
    if (resource === 'iron' && market.level < 2) {
        addToLog('시장을 2레벨로 업그레이드해야 철광석을 구매할 수 있습니다.');
        return;
    }

    const cost = buyPrices[resource] * amount;
    if (resources.gold >= cost) {
        setResources(prev => ({
            ...prev,
            gold: prev.gold - cost,
            [resource]: prev[resource] + amount,
        }));
        const resourceName = { wood: '목재', stone: '석재', iron: '철광석' }[resource];
        addToLog(`${cost} 골드로 ${resourceName} ${amount}개를 구매했습니다.`);
    } else {
        addToLog('골드가 부족합니다.');
    }
}, [resources, addToLog, buildings]);

  const handleBuyFromMerchant = useCallback((itemIndex: number) => {
    if (!townEvent) return;
    
    const item = townEvent.items[itemIndex];
    if (!item || item.stock <= 0) return;

    const cost = item.cost;
    if (resources.gold >= cost.gold && resources.wood >= cost.wood && resources.stone >= cost.stone && resources.iron >= cost.iron) {
        setResources(prev => ({
            ...prev,
            gold: prev.gold - (cost.gold || 0),
            wood: prev.wood - (cost.wood || 0),
            stone: prev.stone - (cost.stone || 0),
            iron: prev.iron - (cost.iron || 0),
        }));

        if (item.type === 'resource') {
            setResources(prev => ({ ...prev, [item.id]: prev[item.id as keyof Omit<Resources, 'gold' | 'ancientShard'>] + item.amount }));
        } else if (item.type === 'potion') {
            setPlayer(prev => ({
                ...prev,
                potions: { ...prev.potions, [item.id]: prev.potions[item.id as keyof Player['potions']] + item.amount }
            }));
        }

        const newItems = [...townEvent.items];
        newItems[itemIndex] = { ...newItems[itemIndex], stock: newItems[itemIndex].stock - 1 };
        setTownEvent({ ...townEvent, items: newItems });
        
        const resourceNameMap: Record<string, string> = { wood: '목재', stone: '석재', iron: '철광석' };
        const potionNameMap: Record<string, string> = { health_potion: '체력 물약', sharpening_stone: '숫돌', shielding_oil: '보호 기름' };
        
        const boughtItemName = item.type === 'resource' 
            ? `${resourceNameMap[item.id]} ${item.amount}개` 
            : potionNameMap[item.id as keyof typeof potionNameMap];
        addToLog(`[이벤트] 상인에게서 ${boughtItemName}을(를) 구매했습니다.`);
    } else {
        addToLog('자원이 부족하여 구매할 수 없습니다.');
    }
  }, [townEvent, resources, addToLog]);




  const handleAcceptQuest = useCallback((questId: string) => {
    setQuests(prev => prev.map(q => q.id === questId && q.status === 'available' ? { ...q, status: 'in_progress' } : q));
    const quest = quests.find(q => q.id === questId);
    addToLog(`퀘스트 수락: ${quest?.title}`);
  }, [quests, addToLog]);

  const getReputationLevelInfo = useCallback((points: number) => {
      let currentLevel = REPUTATION_LEVELS[0];
      let levelIndex = 0;
      for (let i = REPUTATION_LEVELS.length - 1; i >= 0; i--) {
        if (points >= REPUTATION_LEVELS[i].points) {
          currentLevel = REPUTATION_LEVELS[i];
          levelIndex = i;
          break;
        }
      }
      return { ...currentLevel, level: levelIndex };
  }, []);

  const handleCompleteQuest = useCallback((questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.status !== 'in_progress') return;

    const cost = quest.requirements.cost;
    if (resources.gold >= cost.gold && resources.wood >= cost.wood && resources.stone >= cost.stone && resources.iron >= cost.iron) {
      setResources(prev => ({
        ...prev,
        gold: prev.gold - cost.gold,
        wood: prev.wood - cost.wood,
        stone: prev.stone - cost.stone,
        iron: prev.iron - cost.iron,
      }));
      
      if (quest.rewards.resources) {
        const reward = quest.rewards.resources;
        setResources(prev => ({
            ...prev,
            gold: prev.gold + (reward.gold || 0),
            wood: prev.wood + (reward.wood || 0),
            stone: prev.stone + (reward.stone || 0),
            iron: prev.iron + (reward.iron || 0),
            ancientShard: prev.ancientShard + (reward.ancientShard || 0),
        }));
      }

      setQuests(prev => prev.map(q => q.id === questId ? { ...q, status: 'completed' } : q));
      addToLog(`퀘스트 완료: ${quest.title}! 보상을 획득했습니다.`);

      if (quest.reputationReward) {
          const { npcId, points } = quest.reputationReward;
          const npc = NPCS.find(n => n.id === npcId);
          if (npc) {
            setPlayer(p => {
              const oldRepPoints = p.npcReputation[npcId] || 0;
              const newRepPoints = oldRepPoints + points;
              
              const oldLevelInfo = getReputationLevelInfo(oldRepPoints);
              const newLevelInfo = getReputationLevelInfo(newRepPoints);

              if (newLevelInfo.level > oldLevelInfo.level) {
                  addToLog(`${npc.name}와(과)의 평판이 [${newLevelInfo.name}] (으)로 상승했습니다!`);
              }

              return {
                ...p,
                npcReputation: {
                  ...p.npcReputation,
                  [npcId]: newRepPoints,
                }
              };
            });
          }
      }

    } else {
      addToLog('퀘스트 완료에 필요한 자원이 부족합니다.');
    }
  }, [quests, resources, addToLog, getReputationLevelInfo]);


  useEffect(() => {
    if (gameState !== GameState.IN_DUNGEON || combatTurn === 'PAUSED' || !currentMonster) {
      return stopCombat();
    }

    if (player.hp <= 0) {
      addToLog('당신은 패배했습니다...');
      setGameState(GameState.GAME_OVER);
      setCombatTurn('PAUSED');
      return stopCombat();
    }

    if (currentMonster.hp <= 0) {
      setCombatTurn('PAUSED');
      addToLog(`${currentMonster.name}을(를) 처치했습니다!`);
      
      const isWorldBoss = currentMonster.id === 'ancient_colossus';

      const totalGoldBonusFromFurniture = furniture
          .filter(f => f.isPlaced && f.goldBonus)
          .reduce((acc, f) => acc + (f.goldBonus || 0), 0);
      
      if (isWorldBoss) {
        let monsterDrops = { ...MONSTERS['ancient_colossus'].drops };
        if (totalGoldBonusFromFurniture > 0 && monsterDrops.gold) {
            const bonusGold = Math.ceil(monsterDrops.gold * totalGoldBonusFromFurniture);
            monsterDrops.gold += bonusGold;
            addToLog(`가구 효과로 골드 획득량이 증가했습니다! (+${bonusGold} G)`);
        }
        const dropMessage = `자원 획득: G+${monsterDrops.gold}, S+${monsterDrops.stone}, I+${monsterDrops.iron}`;
        addToLog(dropMessage);
        setResources(prevRes => ({
            ...prevRes,
            gold: prevRes.gold + monsterDrops.gold,
            stone: prevRes.stone + monsterDrops.stone,
            iron: prevRes.iron + monsterDrops.iron,
        }));
        setWorldBoss(null); // World boss defeated
      } else if (activeDungeonRun) {
          let monsterDrops;
          if (activeDungeonRun.dungeon.id === 'infinite_rift') {
              const floor = activeDungeonRun.currentFloor || 1;
              const baseMonster = MONSTERS[currentMonster.id];
              monsterDrops = {
                  gold: Math.ceil(baseMonster.drops.gold * (1 + (floor - 1) * 0.2)),
                  wood: Math.ceil(baseMonster.drops.wood * (1 + (floor - 1) * 0.2)),
                  stone: Math.ceil(baseMonster.drops.stone * (1 + (floor - 1) * 0.2)),
                  iron: Math.ceil(baseMonster.drops.iron * (1 + (floor - 1) * 0.2)),
                  ancientShard: 0,
              };
              setHighestFloorReached(prev => Math.max(prev, activeDungeonRun.currentFloor || 0));
          } else {
              monsterDrops = applyAffixModifiersToResources(currentMonster.drops, activeDungeonRun.affixes);
          }
          
          if (totalGoldBonusFromFurniture > 0 && monsterDrops.gold) {
              const bonusGold = Math.ceil(monsterDrops.gold * totalGoldBonusFromFurniture);
              monsterDrops.gold += bonusGold;
              addToLog(`가구 효과로 골드 획득량이 증가했습니다! (+${bonusGold} G)`);
          }
    
          const dropMessage = `자원 획득: G+${monsterDrops.gold}, W+${monsterDrops.wood}, S+${monsterDrops.stone}` + (monsterDrops.iron > 0 ? `, I+${monsterDrops.iron}` : '');
          addToLog(dropMessage);
          setResources(prevRes => ({
              ...prevRes,
              gold: prevRes.gold + (monsterDrops.gold || 0),
              wood: prevRes.wood + (monsterDrops.wood || 0),
              stone: prevRes.stone + (monsterDrops.stone || 0),
              iron: prevRes.iron + (monsterDrops.iron || 0),
          }));
      }
      
      const defeatedMonsterId = currentMonster.id;
      setDefeatedMonsters(prev => [...new Set([...prev, defeatedMonsterId])]);

      const newlyUnlockedDungeon = DUNGEONS.find(d => d.unlocksAfter === defeatedMonsterId);
      if (newlyUnlockedDungeon) {
        addToLog(`새로운 던전(${newlyUnlockedDungeon.name})이 열렸습니다!`);
      }
      
      const isFinalBoss = defeatedMonsterId === 'shadow_dragon';

      transitionTimeoutRef.current = window.setTimeout(() => {
        if (isFinalBoss) {
            addToLog('축하합니다! 마침내 그림자 용을 물리치고 마을에 평화를 가져왔습니다!');
            returnToTown();
        } else if (isWorldBoss) {
            returnToTown();
        } else if (activeDungeonRun) {
            const event = activeDungeonRun.dungeon.events[activeDungeonRun.currentEventId];
            if (event?.type === 'monster') {
                setGameState(GameState.EXPLORING);
                handleExplorationEvent(event.nextEventId);
            } else {
                returnToTown();
            }
        }
      }, 1500);
      return stopCombat();
    }
    
    if (combatTurn === 'PLAYER') {
      combatTimeoutRef.current = window.setTimeout(() => {
        const playerAttack = player.attack + (player.buffs?.attack || 0);
        const damageDealt = playerAttack + Math.floor(Math.random() * 5);
        addToLog(`플레이어가 ${currentMonster.name}에게 ${damageDealt}의 피해를 입혔습니다!`);
        setCurrentMonster(m => {
          if (!m) return null;
          const newHp = Math.max(0, m.hp - damageDealt);
          if (m.id === 'ancient_colossus') {
            setWorldBoss(wb => wb ? { ...wb, currentHp: newHp } : null);
          }
          return { ...m, hp: newHp };
        });
        setCombatTurn('MONSTER');
      }, 1000);
    } else if (combatTurn === 'MONSTER') {
      const fastAffix = activeDungeonRun && activeDungeonRun.affixes.find(a => a.id === 'fast_monsters');
      const monsterTurnDelay = fastAffix ? 750 : 1000;
      combatTimeoutRef.current = window.setTimeout(() => {
        if (!currentMonster) return;
        const monsterAttack = currentMonster.attack;
        const playerDefense = player.defense + (player.buffs?.defense || 0);
        const damageTaken = Math.max(0, monsterAttack - playerDefense);
        addToLog(`${currentMonster.name}이(가) ${damageTaken}의 피해를 입혔습니다!`);
        
        const hpAfterDamage = player.hp - damageTaken;
        const shouldUsePotion = player.potions.health > 0 && hpAfterDamage > 0 && (hpAfterDamage / player.maxHp <= 0.3);

        if (shouldUsePotion) {
          addToLog('체력이 낮아 체력 물약을 사용합니다. (+50 HP)');
          setPlayer(p => ({
            ...p,
            hp: Math.min(p.maxHp, p.hp - damageTaken + 50),
            potions: { ...p.potions, health: p.potions.health - 1 }
          }));
        } else {
          setPlayer(p => ({ ...p, hp: Math.max(0, p.hp - damageTaken) }));
        }

        setCombatTurn('PLAYER');
      }, monsterTurnDelay);
    }
    
    return stopCombat;
  }, [gameState, combatTurn, currentMonster, player, activeDungeonRun, stopCombat, addToLog, returnToTown, handleExplorationEvent, applyAffixModifiersToResources, furniture]);

  useEffect(() => {
    if (activeDungeonRun && gameState === GameState.TOWN) {
      handleExplorationEvent(activeDungeonRun.dungeon.startEventId);
    }
  }, [activeDungeonRun, gameState, handleExplorationEvent]);

  const renderContent = () => {
    switch(gameState) {
      case GameState.EXPLORING:
        if (!activeDungeonRun) {
          returnToTown();
          return null;
        }
        const currentEvent = activeDungeonRun.dungeon.events[activeDungeonRun.currentEventId];
        if (!currentEvent) {
            returnToTown();
            return null;
        }

        return (
          <ExplorationScreen
            player={player}
            resources={resources}
            log={gameLog}
            dungeonRun={activeDungeonRun}
            event={currentEvent}
            onChoice={(nextEventId) => handleExplorationEvent(nextEventId)}
            onReturnToTown={returnToTown}
          />
        );
      case GameState.IN_DUNGEON:
        return currentMonster && (
          <GameScreen 
            player={player} 
            monster={currentMonster} 
            log={gameLog}
          />
        );
      case GameState.GAME_OVER:
        return (
          <div className="text-center p-8 bg-slate-800/50 rounded-lg shadow-xl flex flex-col items-center animate-fade-in">
            <SkullIcon className="w-24 h-24 text-red-500 mb-4" />
            <h2 className="text-4xl font-bold text-red-400 mb-2">게임 오버</h2>
            <p className="text-slate-400 mb-6">던전 탐험에 실패했습니다.</p>
            <button 
              onClick={returnToTown}
              className="px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-lg transition-colors duration-200 shadow-lg">
              마을로 돌아가기
            </button>
          </div>
        );
      case GameState.TOWN:
      default:
        const blacksmith = buildings.find(b => b.id === 'blacksmith');
        const trainingGround = buildings.find(b => b.id === 'training_ground');
        const alchemyLab = buildings.find(b => b.id === 'alchemy_lab');
        const market = buildings.find(b => b.id === 'market');
        const inn = buildings.find(b => b.id === 'inn');
        
        const availableCraftableItems = (blacksmith?.built && !blacksmith.damaged) ? CRAFTABLE_ITEMS.filter(item => item.requiredBuildingLevel <= blacksmith.level) : [];
        const availablePotions = (alchemyLab?.built && !alchemyLab.damaged) ? CRAFTABLE_POTIONS.filter(p => p.requiredBuildingLevel <= alchemyLab.level) : [];

        return (
          <TownScreen 
            player={player}
            resources={resources}
            buildings={buildings}
            onBuild={handleBuild}
            onEnterDungeon={handleNavigateToDungeon}
            craftableItems={availableCraftableItems}
            onCraft={handleCraft}
            onEnchant={handleEnchant}
            getEnchantInfo={getEnchantInfo}
            craftablePotions={availablePotions}
            onCraftPotion={handleCraftPotion}
            trainingOptions={(trainingGround?.built && !trainingGround.damaged) ? TRAINING_OPTIONS : []}
            onTrain={handleTrain}
            calculateTrainingCost={calculateTrainingCost}
            onRest={handleRest}
            onExpandInn={handleExpandInn}
            calculateInnExpansionCost={calculateInnExpansionCost}
            onUpgradeBuilding={handleUpgradeBuilding}
            calculateBuildingUpgradeCost={calculateBuildingUpgradeCost}
            onSellResource={handleSellResource}
            onBuyResource={handleBuyResource}
            npcs={NPCS}
            quests={quests}
            onAcceptQuest={handleAcceptQuest}
            onCompleteQuest={handleCompleteQuest}
            raidCountdown={raidCountdown}
            onRepairBuilding={handleRepairBuilding}
            calculateRepairCost={calculateRepairCost}
            innBuilt={inn?.built && !inn.damaged}
            marketBuilt={market?.built && !market.damaged}
            lastBuildingEvent={lastBuildingEvent}
            townEvent={townEvent}
            onBuyFromMerchant={handleBuyFromMerchant}
            furniture={furniture}
            onPlaceFurniture={handlePlaceFurniture}
            highestFloorReached={highestFloorReached}
            proficiencyExpToLevelUp={PROFICIENCY_EXP_TO_LEVEL_UP}
            worldBoss={worldBoss}
          />
        );
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 font-sans pb-24">
      <div ref={appContentRef} className="w-full flex flex-col items-center flex-grow">
        <header className="w-full max-w-4xl mx-auto mb-4 flex-shrink-0 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-violet-300">Dungeon & Story</h1>
            <div className="flex gap-2 items-center">
                <button
                  onClick={() => setIsAchievementModalOpen(true)}
                  className="p-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg transition-colors duration-200 shadow-lg flex items-center justify-center"
                  aria-label="도전 과제 보기"
                >
                  <TrophyIcon className="w-5 h-5"/>
                </button>

                <button 
                    onClick={() => setIsResetModalOpen(true)}
                    className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors duration-200 shadow-lg">
                    게임 리셋
                </button>
            </div>
        </header>

        <main className="w-full max-w-4xl mx-auto flex-grow flex items-center justify-center">
            {renderContent()}
        </main>
        
        <footer className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700 p-2 z-40">
            <Navigation 
                gameState={gameState}
                onNavigateToTown={handleNavigateToTown}
                onNavigateToDungeon={handleNavigateToDungeon}
            />
        </footer>
      </div>

      <AchievementToast achievement={achievementToast} />

      {craftingResult && (
        <CraftingResultModal result={craftingResult} onClose={() => setCraftingResult(null)} />
      )}

      {enchantResult && (
        <EnchantResultModal result={enchantResult} onClose={() => setEnchantResult(null)} />
      )}
      
      {lastRaidReport && (
        <RaidReportDisplay
            report={lastRaidReport}
            onClose={() => setLastRaidReport(null)}
        />
      )}

      {isDungeonModalOpen && (
        <DungeonModal 
            onClose={() => setIsDungeonModalOpen(false)}
            defeatedMonsters={defeatedMonsters}
            onEnterDungeon={handleEnterDungeon}
            highestFloorReached={highestFloorReached}
            worldBoss={worldBoss}
        />
      )}
      
      {isAchievementModalOpen && (
        <AchievementModal 
            onClose={() => setIsAchievementModalOpen(false)}
            unlockedAchievements={unlockedAchievements}
        />
      )}

      {isResetModalOpen && (
        <ResetConfirmationModal
            onConfirm={() => {
                resetGame();
                setIsResetModalOpen(false);
            }}
            onCancel={() => setIsResetModalOpen(false)}
        />
     )}
    </div>
  );
};

const AffixTag: React.FC<{ affix: DungeonAffix }> = ({ affix }) => {
    const isNegative = affix.type === 'negative';
    const colorClasses = isNegative
        ? 'border-orange-500/50 bg-orange-900/20 text-orange-300'
        : 'border-sky-500/50 bg-sky-900/20 text-sky-300';
    const Icon = affix.icon;
    return (
        <div title={affix.description} className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${colorClasses} border`}>
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-semibold">{affix.name}</span>
        </div>
    );
};

interface DungeonModalProps {
    onClose: () => void;
    defeatedMonsters: string[];
    onEnterDungeon: (id: string) => void;
    highestFloorReached: number;
    worldBoss: { isActive: boolean; currentHp: number; timeRemaining: number } | null;
}

const DungeonModal: React.FC<DungeonModalProps> = ({ onClose, defeatedMonsters, onEnterDungeon, highestFloorReached, worldBoss }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        triggerRef.current = document.activeElement as HTMLElement;
        const modalNode = modalRef.current;
        if (modalNode) {
            modalNode.focus();
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'Tab') {
                const focusableElements = modalNode?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (!focusableElements || focusableElements.length === 0) return;
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) { // Shift+Tab
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            triggerRef.current?.focus();
        };
    }, [onClose]);
    
    const worldBossData = MONSTERS['ancient_colossus'];

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
          <div 
            ref={modalRef} 
            className="bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full border border-slate-700 max-h-[80vh] flex flex-col overflow-hidden" 
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dungeon-modal-title"
            tabIndex={-1}
          >
            <div className="flex-shrink-0 flex justify-between items-center p-6 border-b border-slate-700 bg-slate-800">
              <h2 id="dungeon-modal-title" className="text-2xl font-bold text-violet-300">던전 선택</h2>
              <button onClick={onClose} aria-label="닫기" className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
            </div>
            <div className="overflow-y-auto p-6">
              <div className="flex flex-col gap-6">
                {worldBoss?.isActive && (
                    <div className="p-4 rounded-lg transition-all duration-200 bg-red-900/50 border-2 border-red-500 shadow-2xl animate-pulse">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold flex items-center gap-2 text-red-300">
                                    <ExclamationTriangleIcon className="w-6 h-6" />
                                    {worldBossData.name}
                                </h3>
                                <p className="text-sm mt-1 text-red-200">고대의 위협이 땅을 뒤흔듭니다.</p>
                                <p className="text-sm mt-2 text-red-200 font-semibold">
                                    남은 체력: {worldBoss.currentHp} / {worldBossData.maxHp}
                                </p>
                                <p className="text-sm mt-1 text-amber-300 font-semibold">
                                    남은 시간: {worldBoss.timeRemaining}회 탐험
                                </p>
                            </div>
                            <button
                                onClick={() => onEnterDungeon('world_boss')}
                                className="px-6 py-3 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg bg-red-700 hover:bg-red-600 flex-shrink-0 w-full sm:w-auto"
                            >
                                도전
                            </button>
                        </div>
                    </div>
                )}
                {DUNGEONS.map((dungeon) => {
                  const isDungeonUnlocked = !dungeon.unlocksAfter || defeatedMonsters.includes(dungeon.unlocksAfter);

                  const PrimaryDropIcon = ({type}: {type: string}) => {
                      switch(type) {
                          case 'gold': return <GoldIcon className="w-4 h-4 inline mr-1 text-yellow-400" />;
                          case 'wood': return <WoodIcon className="w-4 h-4 inline mr-1 text-amber-600" />;
                          case 'stone': return <StoneIcon className="w-4 h-4 inline mr-1 text-slate-500" />;
                          case 'iron': return <IronIcon className="w-4 h-4 inline mr-1 text-gray-400" />;
                          default: return null;
                      }
                  }
                  
                  const isInfiniteRift = dungeon.id === 'infinite_rift';
                  const dungeonBg = isDungeonUnlocked 
                      ? isInfiniteRift ? 'bg-indigo-900/30 border border-indigo-700' : 'bg-slate-900/50 border border-slate-700' 
                      : 'bg-slate-800/50 border border-slate-700/50';


                  return (
                    <div key={dungeon.id} className={`p-4 rounded-lg transition-all duration-200 ${dungeonBg}`}>
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div className="flex-grow">
                            <h3 className={`text-xl font-bold flex items-center gap-2 ${isDungeonUnlocked ? (isInfiniteRift ? 'text-indigo-300' : 'text-violet-300') : 'text-slate-600'}`}>
                              {!isDungeonUnlocked && <LockIcon className="w-5 h-5" />}
                              {dungeon.name}
                            </h3>
                            <p className={`text-sm mt-1 ${isDungeonUnlocked ? 'text-slate-400' : 'text-slate-500'}`}>{dungeon.description}</p>
                            {isInfiniteRift && isDungeonUnlocked && (
                                <p className="text-sm mt-1 text-amber-300 font-semibold">최고 기록: {highestFloorReached}층</p>
                            )}
                            <div className="text-xs text-slate-400 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                              <span className="font-semibold text-slate-300">주요 드랍:</span>
                              {dungeon.primaryDrops.map(d => <PrimaryDropIcon key={d} type={d}/>)}
                            </div>
                          </div>
                          <button
                            disabled={!isDungeonUnlocked}
                            onClick={() => onEnterDungeon(dungeon.id)}
                            className={`px-6 py-3 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 flex-shrink-0 w-full sm:w-auto ${isInfiniteRift ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-red-700 hover:bg-red-600'}`}
                          >
                            입장
                          </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
    );
};


export default App;