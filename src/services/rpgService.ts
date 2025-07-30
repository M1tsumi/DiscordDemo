import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, '../../data/rpgCharacters.json');

export interface RPGCharacter {
  id: string;
  username: string;
  avatar: string;
  // Basic Stats
  level: number;
  xp: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  stamina: number;
  maxStamina: number;
  
  // Core Stats
  strength: number;
  dexterity: number;
  intelligence: number;
  vitality: number;
  wisdom: number;
  charisma: number;
  
  // Combat Stats
  attack: number;
  defense: number;
  magicAttack: number;
  magicDefense: number;
  criticalChance: number;
  criticalDamage: number;
  
  // RPG Elements
  class: string;
  subclass: string;
  title: string;
  gold: number;
  experience: number;
  skillPoints: number;
  
  // Equipment
  weapon: Equipment | null;
  armor: Equipment | null;
  helmet: Equipment | null;
  gloves: Equipment | null;
  boots: Equipment | null;
  accessory1: Equipment | null;
  accessory2: Equipment | null;
  
  // Inventory & Skills
  inventory: Item[];
  skills: Skill[];
  activeQuests: Quest[];
  completedQuests: string[];
  
  // Progression
  dungeonProgress: Record<string, number>;
  achievements: string[];
  reputation: Record<string, number>;
  
  // Timestamps
  lastDaily: number;
  lastAdventure: number;
  lastTraining: number;
  lastRest: number;
  
  // Status
  status: 'idle' | 'adventuring' | 'training' | 'resting' | 'questing';
  statusEndTime: number;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'helmet' | 'gloves' | 'boots' | 'accessory';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  level: number;
  stats: {
    attack?: number;
    defense?: number;
    magicAttack?: number;
    magicDefense?: number;
    strength?: number;
    dexterity?: number;
    intelligence?: number;
    vitality?: number;
    wisdom?: number;
    charisma?: number;
    hp?: number;
    mana?: number;
    stamina?: number;
    criticalChance?: number;
    criticalDamage?: number;
  };
  effects: string[];
  description: string;
}

export interface Item {
  id: string;
  name: string;
  type: 'consumable' | 'material' | 'quest' | 'currency';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  quantity: number;
  description: string;
  effects?: {
    hp?: number;
    mana?: number;
    stamina?: number;
    xp?: number;
    gold?: number;
  };
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  type: 'active' | 'passive';
  level: number;
  maxLevel: number;
  cooldown: number;
  lastUsed: number;
  requirements: {
    level: number;
    class?: string;
    stats?: Record<string, number>;
  };
  effects: {
    damage?: number;
    healing?: number;
    buffs?: Record<string, number>;
    debuffs?: Record<string, number>;
  };
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: 'kill' | 'collect' | 'explore' | 'craft' | 'social';
  requirements: {
    level: number;
    items?: Record<string, number>;
    kills?: Record<string, number>;
  };
  rewards: {
    xp: number;
    gold: number;
    items?: Item[];
    reputation?: Record<string, number>;
  };
  progress: Record<string, number>;
  completed: boolean;
}

export interface Dungeon {
  id: string;
  name: string;
  description: string;
  level: number;
  difficulty: 'easy' | 'normal' | 'hard' | 'nightmare' | 'hell';
  enemies: Enemy[];
  rewards: {
    xp: number;
    gold: number;
    items: Item[];
  };
  requirements: {
    level: number;
    items?: Record<string, number>;
  };
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  magicAttack: number;
  magicDefense: number;
  abilities: string[];
  drops: Item[];
  xpReward: number;
  goldReward: number;
}

export class RPGService {
  private characters: Record<string, RPGCharacter> = {};
  private classes: Record<string, any> = {};
  private skills: Record<string, Skill> = {};
  private dungeons: Record<string, Dungeon> = {};
  private quests: Record<string, Quest> = {};

  constructor() {
    this.loadCharacters();
    this.initializeGameData();
  }

  private loadCharacters() {
    if (fs.existsSync(DATA_PATH)) {
      this.characters = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
    }
  }

  private saveCharacters() {
    fs.writeFileSync(DATA_PATH, JSON.stringify(this.characters, null, 2));
  }

  private initializeGameData() {
    // Initialize classes
    this.classes = {
      'Warrior': {
        name: 'Warrior',
        description: 'A mighty fighter specializing in close combat and heavy armor.',
        baseStats: {
          hp: 120,
          mana: 50,
          stamina: 100,
          strength: 15,
          dexterity: 8,
          intelligence: 5,
          vitality: 12,
          wisdom: 6,
          charisma: 8
        },
        statGrowth: {
          hp: 15,
          mana: 3,
          stamina: 8,
          strength: 2.5,
          dexterity: 1.2,
          intelligence: 0.8,
          vitality: 1.8,
          wisdom: 0.6,
          charisma: 1.0
        },
        skills: ['slash', 'shield_bash', 'battle_cry', 'berserker_rage'],
        subclasses: ['Knight', 'Berserker', 'Paladin']
      },
      'Mage': {
        name: 'Mage',
        description: 'A powerful spellcaster wielding arcane magic and elemental forces.',
        baseStats: {
          hp: 80,
          mana: 150,
          stamina: 60,
          strength: 5,
          dexterity: 8,
          intelligence: 18,
          vitality: 8,
          wisdom: 15,
          charisma: 10
        },
        statGrowth: {
          hp: 8,
          mana: 20,
          stamina: 5,
          strength: 0.8,
          dexterity: 1.0,
          intelligence: 3.0,
          vitality: 1.0,
          wisdom: 2.5,
          charisma: 1.2
        },
        skills: ['fireball', 'ice_shield', 'lightning_bolt', 'arcane_explosion'],
        subclasses: ['Pyromancer', 'Cryomancer', 'Electromancer']
      },
      'Archer': {
        name: 'Archer',
        description: 'A skilled ranger specializing in ranged combat and agility.',
        baseStats: {
          hp: 90,
          mana: 70,
          stamina: 120,
          strength: 8,
          dexterity: 18,
          intelligence: 8,
          vitality: 10,
          wisdom: 10,
          charisma: 12
        },
        statGrowth: {
          hp: 10,
          mana: 8,
          stamina: 15,
          strength: 1.2,
          dexterity: 3.0,
          intelligence: 1.0,
          vitality: 1.5,
          wisdom: 1.2,
          charisma: 1.5
        },
        skills: ['precise_shot', 'multi_shot', 'stealth', 'eagle_eye'],
        subclasses: ['Ranger', 'Assassin', 'Hunter']
      },
      'Priest': {
        name: 'Priest',
        description: 'A divine healer and support specialist with holy magic.',
        baseStats: {
          hp: 100,
          mana: 130,
          stamina: 80,
          strength: 6,
          dexterity: 8,
          intelligence: 12,
          vitality: 12,
          wisdom: 18,
          charisma: 15
        },
        statGrowth: {
          hp: 12,
          mana: 18,
          stamina: 8,
          strength: 0.8,
          dexterity: 1.0,
          intelligence: 2.0,
          vitality: 1.8,
          wisdom: 3.0,
          charisma: 2.0
        },
        skills: ['heal', 'bless', 'smite', 'divine_protection'],
        subclasses: ['Cleric', 'Inquisitor', 'Monk']
      }
    };

    // Initialize skills
    this.skills = {
      // Warrior skills
      'slash': {
        id: 'slash',
        name: 'Slash',
        description: 'A powerful melee attack that deals extra damage.',
        type: 'active',
        level: 1,
        maxLevel: 10,
        cooldown: 30000, // 30 seconds
        lastUsed: 0,
        requirements: { level: 1, class: 'Warrior' },
        effects: { damage: 150 }
      },
      'shield_bash': {
        id: 'shield_bash',
        name: 'Shield Bash',
        description: 'Bash your shield into the enemy, stunning them.',
        type: 'active',
        level: 1,
        maxLevel: 5,
        cooldown: 45000, // 45 seconds
        lastUsed: 0,
        requirements: { level: 5, class: 'Warrior' },
        effects: { damage: 100 }
      },
      'battle_cry': {
        id: 'battle_cry',
        name: 'Battle Cry',
        description: 'Let out a mighty cry that boosts your attack power.',
        type: 'active',
        level: 1,
        maxLevel: 5,
        cooldown: 60000, // 1 minute
        lastUsed: 0,
        requirements: { level: 10, class: 'Warrior' },
        effects: { buffs: { attack: 50 } }
      },
      'berserker_rage': {
        id: 'berserker_rage',
        name: 'Berserker Rage',
        description: 'Enter a state of rage, increasing damage but reducing defense.',
        type: 'active',
        level: 1,
        maxLevel: 3,
        cooldown: 120000, // 2 minutes
        lastUsed: 0,
        requirements: { level: 20, class: 'Warrior' },
        effects: { buffs: { attack: 100 }, debuffs: { defense: -30 } }
      },

      // Mage skills
      'fireball': {
        id: 'fireball',
        name: 'Fireball',
        description: 'Launch a ball of fire at your enemies.',
        type: 'active',
        level: 1,
        maxLevel: 10,
        cooldown: 20000, // 20 seconds
        lastUsed: 0,
        requirements: { level: 1, class: 'Mage' },
        effects: { damage: 200 }
      },
      'ice_shield': {
        id: 'ice_shield',
        name: 'Ice Shield',
        description: 'Create a protective barrier of ice.',
        type: 'active',
        level: 1,
        maxLevel: 5,
        cooldown: 45000, // 45 seconds
        lastUsed: 0,
        requirements: { level: 5, class: 'Mage' },
        effects: { buffs: { defense: 80 } }
      },
      'lightning_bolt': {
        id: 'lightning_bolt',
        name: 'Lightning Bolt',
        description: 'Cast a powerful lightning bolt that can chain to multiple enemies.',
        type: 'active',
        level: 1,
        maxLevel: 8,
        cooldown: 35000, // 35 seconds
        lastUsed: 0,
        requirements: { level: 10, class: 'Mage' },
        effects: { damage: 250 }
      },
      'arcane_explosion': {
        id: 'arcane_explosion',
        name: 'Arcane Explosion',
        description: 'Release a burst of arcane energy that damages all nearby enemies.',
        type: 'active',
        level: 1,
        maxLevel: 5,
        cooldown: 90000, // 1.5 minutes
        lastUsed: 0,
        requirements: { level: 20, class: 'Mage' },
        effects: { damage: 300 }
      },

      // Archer skills
      'precise_shot': {
        id: 'precise_shot',
        name: 'Precise Shot',
        description: 'A carefully aimed shot with increased critical chance.',
        type: 'active',
        level: 1,
        maxLevel: 10,
        cooldown: 25000, // 25 seconds
        lastUsed: 0,
        requirements: { level: 1, class: 'Archer' },
        effects: { damage: 180, buffs: { criticalChance: 25 } }
      },
      'multi_shot': {
        id: 'multi_shot',
        name: 'Multi Shot',
        description: 'Fire multiple arrows at once.',
        type: 'active',
        level: 1,
        maxLevel: 8,
        cooldown: 40000, // 40 seconds
        lastUsed: 0,
        requirements: { level: 8, class: 'Archer' },
        effects: { damage: 120 }
      },
      'stealth': {
        id: 'stealth',
        name: 'Stealth',
        description: 'Become invisible and increase critical damage.',
        type: 'active',
        level: 1,
        maxLevel: 5,
        cooldown: 60000, // 1 minute
        lastUsed: 0,
        requirements: { level: 15, class: 'Archer' },
        effects: { buffs: { criticalDamage: 100 } }
      },
      'eagle_eye': {
        id: 'eagle_eye',
        name: 'Eagle Eye',
        description: 'Sharpen your vision to increase accuracy and critical chance.',
        type: 'active',
        level: 1,
        maxLevel: 5,
        cooldown: 45000, // 45 seconds
        lastUsed: 0,
        requirements: { level: 25, class: 'Archer' },
        effects: { buffs: { criticalChance: 30, attack: 40 } }
      },

      // Priest skills
      'heal': {
        id: 'heal',
        name: 'Heal',
        description: 'Restore health to yourself or an ally.',
        type: 'active',
        level: 1,
        maxLevel: 10,
        cooldown: 30000, // 30 seconds
        lastUsed: 0,
        requirements: { level: 1, class: 'Priest' },
        effects: { healing: 150 }
      },
      'bless': {
        id: 'bless',
        name: 'Bless',
        description: 'Bestow divine protection on yourself or an ally.',
        type: 'active',
        level: 1,
        maxLevel: 8,
        cooldown: 40000, // 40 seconds
        lastUsed: 0,
        requirements: { level: 5, class: 'Priest' },
        effects: { buffs: { defense: 60, magicDefense: 60 } }
      },
      'smite': {
        id: 'smite',
        name: 'Smite',
        description: 'Call down divine wrath upon your enemies.',
        type: 'active',
        level: 1,
        maxLevel: 8,
        cooldown: 35000, // 35 seconds
        lastUsed: 0,
        requirements: { level: 10, class: 'Priest' },
        effects: { damage: 220 }
      },
      'divine_protection': {
        id: 'divine_protection',
        name: 'Divine Protection',
        description: 'Create a powerful barrier that blocks incoming damage.',
        type: 'active',
        level: 1,
        maxLevel: 5,
        cooldown: 120000, // 2 minutes
        lastUsed: 0,
        requirements: { level: 20, class: 'Priest' },
        effects: { buffs: { defense: 150, magicDefense: 150 } }
      }
    };

    // Initialize dungeons
    this.dungeons = {
      'goblin_cave': {
        id: 'goblin_cave',
        name: 'Goblin Cave',
        description: 'A dark cave inhabited by mischievous goblins.',
        level: 1,
        difficulty: 'easy',
        enemies: [
          {
            id: 'goblin_warrior',
            name: 'Goblin Warrior',
            level: 1,
            hp: 50,
            maxHp: 50,
            attack: 15,
            defense: 8,
            magicAttack: 5,
            magicDefense: 5,
            abilities: ['slash'],
            drops: [
              { id: 'goblin_ear', name: 'Goblin Ear', type: 'material', rarity: 'common', quantity: 1, description: 'A trophy from a defeated goblin.' },
              { id: 'copper_coin', name: 'Copper Coin', type: 'currency', rarity: 'common', quantity: 5, description: 'A small copper coin.' }
            ],
            xpReward: 25,
            goldReward: 10
          }
        ],
        rewards: {
          xp: 100,
          gold: 50,
          items: [
            { id: 'leather_armor', name: 'Leather Armor', type: 'material', rarity: 'common', quantity: 1, description: 'Basic leather armor.' }
          ]
        },
        requirements: { level: 1 }
      },
      'spider_den': {
        id: 'spider_den',
        name: 'Spider Den',
        description: 'A web-filled cavern crawling with giant spiders.',
        level: 5,
        difficulty: 'normal',
        enemies: [
          {
            id: 'giant_spider',
            name: 'Giant Spider',
            level: 5,
            hp: 80,
            maxHp: 80,
            attack: 25,
            defense: 12,
            magicAttack: 8,
            magicDefense: 8,
            abilities: ['poison_bite'],
            drops: [
              { id: 'spider_silk', name: 'Spider Silk', type: 'material', rarity: 'uncommon', quantity: 1, description: 'Strong silk from a giant spider.' },
              { id: 'spider_venom', name: 'Spider Venom', type: 'material', rarity: 'rare', quantity: 1, description: 'Toxic venom from a spider.' }
            ],
            xpReward: 45,
            goldReward: 25
          }
        ],
        rewards: {
          xp: 200,
          gold: 100,
          items: [
            { id: 'spider_armor', name: 'Spider Armor', type: 'material', rarity: 'uncommon', quantity: 1, description: 'Armor made from spider silk.' }
          ]
        },
        requirements: { level: 5 }
      }
    };

    // Initialize quests
    this.quests = {
      'goblin_hunter': {
        id: 'goblin_hunter',
        name: 'Goblin Hunter',
        description: 'Defeat 10 goblins to prove your worth as a warrior.',
        type: 'kill',
        requirements: {
          level: 1,
          kills: { 'goblin_warrior': 10 }
        },
        rewards: {
          xp: 500,
          gold: 200,
          items: [
            { id: 'warrior_medal', name: 'Warrior Medal', type: 'quest', rarity: 'uncommon', quantity: 1, description: 'A medal earned for defeating goblins.' }
          ]
        },
        progress: { 'goblin_warrior': 0 },
        completed: false
      },
      'spider_silk_collector': {
        id: 'spider_silk_collector',
        name: 'Spider Silk Collector',
        description: 'Collect 20 spider silk for the local weaver.',
        type: 'collect',
        requirements: {
          level: 5,
          items: { 'spider_silk': 20 }
        },
        rewards: {
          xp: 800,
          gold: 400,
          items: [
            { id: 'silk_robe', name: 'Silk Robe', type: 'material', rarity: 'uncommon', quantity: 1, description: 'A beautiful robe made from spider silk.' }
          ]
        },
        progress: { 'spider_silk': 0 },
        completed: false
      }
    };
  }

  createCharacter(user: { id: string; username: string; avatar: string }, className: string): RPGCharacter {
    if (this.characters[user.id]) {
      throw new Error('Character already exists!');
    }

    const classData = this.classes[className];
    if (!classData) {
      throw new Error('Invalid class!');
    }

    const character: RPGCharacter = {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      level: 1,
      xp: 0,
      hp: classData.baseStats.hp,
      maxHp: classData.baseStats.hp,
      mana: classData.baseStats.mana,
      maxMana: classData.baseStats.mana,
      stamina: classData.baseStats.stamina,
      maxStamina: classData.baseStats.stamina,
      strength: classData.baseStats.strength,
      dexterity: classData.baseStats.dexterity,
      intelligence: classData.baseStats.intelligence,
      vitality: classData.baseStats.vitality,
      wisdom: classData.baseStats.wisdom,
      charisma: classData.baseStats.charisma,
      attack: classData.baseStats.strength * 2,
      defense: classData.baseStats.vitality * 1.5,
      magicAttack: classData.baseStats.intelligence * 2,
      magicDefense: classData.baseStats.wisdom * 1.5,
      criticalChance: 5,
      criticalDamage: 150,
      class: className,
      subclass: '',
      title: 'Novice',
      gold: 100,
      experience: 0,
      skillPoints: 0,
      weapon: null,
      armor: null,
      helmet: null,
      gloves: null,
      boots: null,
      accessory1: null,
      accessory2: null,
      inventory: [
        { id: 'health_potion', name: 'Health Potion', type: 'consumable', rarity: 'common', quantity: 5, description: 'Restores 50 HP.', effects: { hp: 50 } },
        { id: 'mana_potion', name: 'Mana Potion', type: 'consumable', rarity: 'common', quantity: 5, description: 'Restores 50 Mana.', effects: { mana: 50 } }
      ],
      skills: [],
      activeQuests: [],
      completedQuests: [],
      dungeonProgress: {},
      achievements: [],
      reputation: {},
      lastDaily: 0,
      lastAdventure: 0,
      lastTraining: 0,
      lastRest: 0,
      status: 'idle',
      statusEndTime: 0
    };

    // Add starting skills for the class
    classData.skills.forEach((skillId: string) => {
      const skill = this.skills[skillId];
      if (skill) {
        character.skills.push({ ...skill });
      }
    });

    this.characters[user.id] = character;
    this.saveCharacters();
    return character;
  }

  getCharacter(userId: string): RPGCharacter | null {
    return this.characters[userId] || null;
  }

  getClasses(): Record<string, any> {
    return this.classes;
  }

  getSkills(): Record<string, Skill> {
    return this.skills;
  }

  getDungeons(): Record<string, Dungeon> {
    return this.dungeons;
  }

  getQuests(): Record<string, Quest> {
    return this.quests;
  }

  addXP(userId: string, amount: number): RPGCharacter {
    const character = this.getCharacter(userId);
    if (!character) {
      throw new Error('Character not found!');
    }

    character.xp += amount;
    character.experience += amount;

    // Level up calculation
    const newLevel = this.calculateLevel(character.xp);
    if (newLevel > character.level) {
      const levelDiff = newLevel - character.level;
      character.level = newLevel;
      character.skillPoints += levelDiff * 2;
      
      // Update stats based on class growth
      const classData = this.classes[character.class];
      if (classData) {
        character.maxHp += classData.statGrowth.hp * levelDiff;
        character.maxMana += classData.statGrowth.mana * levelDiff;
        character.maxStamina += classData.statGrowth.stamina * levelDiff;
        character.strength += classData.statGrowth.strength * levelDiff;
        character.dexterity += classData.statGrowth.dexterity * levelDiff;
        character.intelligence += classData.statGrowth.intelligence * levelDiff;
        character.vitality += classData.statGrowth.vitality * levelDiff;
        character.wisdom += classData.statGrowth.wisdom * levelDiff;
        character.charisma += classData.statGrowth.charisma * levelDiff;
        
        // Recalculate combat stats
        character.attack = character.strength * 2;
        character.defense = character.vitality * 1.5;
        character.magicAttack = character.intelligence * 2;
        character.magicDefense = character.wisdom * 1.5;
      }
      
      // Restore HP/Mana/Stamina on level up
      character.hp = character.maxHp;
      character.mana = character.maxMana;
      character.stamina = character.maxStamina;
    }

    this.saveCharacters();
    return character;
  }

  private calculateLevel(xp: number): number {
    return Math.floor(0.1 * Math.sqrt(xp)) + 1;
  }

  // Adventure system
  startAdventure(userId: string, dungeonId: string): { success: boolean; message: string; rewards?: any } {
    const character = this.getCharacter(userId);
    if (!character) {
      return { success: false, message: 'Character not found!' };
    }

    const dungeon = this.dungeons[dungeonId];
    if (!dungeon) {
      return { success: false, message: 'Dungeon not found!' };
    }

    if (character.level < dungeon.requirements.level) {
      return { success: false, message: `You need to be level ${dungeon.requirements.level} to enter this dungeon!` };
    }

    if (character.status !== 'idle') {
      return { success: false, message: 'You are currently busy with another activity!' };
    }

    // Start adventure
    character.status = 'adventuring';
    character.statusEndTime = Date.now() + 300000; // 5 minutes

    this.saveCharacters();
    return { success: true, message: `You have entered ${dungeon.name}! The adventure will complete in 5 minutes.` };
  }

  completeAdventure(userId: string): { success: boolean; message: string; rewards?: any } {
    const character = this.getCharacter(userId);
    if (!character) {
      return { success: false, message: 'Character not found!' };
    }

    if (character.status !== 'adventuring') {
      return { success: false, message: 'You are not currently adventuring!' };
    }

    if (Date.now() < character.statusEndTime) {
      return { success: false, message: 'Your adventure is not yet complete!' };
    }

    // Calculate rewards based on character level and dungeon difficulty
    const baseXP = 100;
    const baseGold = 50;
    const levelMultiplier = character.level * 0.5;
    
    const rewards = {
      xp: Math.floor(baseXP * (1 + levelMultiplier)),
      gold: Math.floor(baseGold * (1 + levelMultiplier)),
      items: []
    };

    // Add XP and gold
    this.addXP(userId, rewards.xp);
    character.gold += rewards.gold;

    // Reset status
    character.status = 'idle';
    character.statusEndTime = 0;
    character.lastAdventure = Date.now();

    this.saveCharacters();
    return { 
      success: true, 
      message: `Adventure completed! You gained ${rewards.xp} XP and ${rewards.gold} gold.`,
      rewards 
    };
  }

  // Training system
  startTraining(userId: string, stat: string): { success: boolean; message: string } {
    const character = this.getCharacter(userId);
    if (!character) {
      return { success: false, message: 'Character not found!' };
    }

    if (character.status !== 'idle') {
      return { success: false, message: 'You are currently busy with another activity!' };
    }

    if (character.stamina < 20) {
      return { success: false, message: 'You need at least 20 stamina to train!' };
    }

    character.status = 'training';
    character.statusEndTime = Date.now() + 180000; // 3 minutes
    character.stamina -= 20;

    this.saveCharacters();
    return { success: true, message: `You have started training your ${stat}! Training will complete in 3 minutes.` };
  }

  completeTraining(userId: string, stat: string): { success: boolean; message: string } {
    const character = this.getCharacter(userId);
    if (!character) {
      return { success: false, message: 'Character not found!' };
    }

    if (character.status !== 'training') {
      return { success: false, message: 'You are not currently training!' };
    }

    if (Date.now() < character.statusEndTime) {
      return { success: false, message: 'Your training is not yet complete!' };
    }

    // Increase the trained stat
    const statIncrease = 1;
    (character as any)[stat] += statIncrease;

    // Recalculate combat stats if necessary
    if (['strength', 'dexterity', 'intelligence', 'vitality', 'wisdom', 'charisma'].includes(stat)) {
      character.attack = character.strength * 2;
      character.defense = character.vitality * 1.5;
      character.magicAttack = character.intelligence * 2;
      character.magicDefense = character.wisdom * 1.5;
    }

    character.status = 'idle';
    character.statusEndTime = 0;
    character.lastTraining = Date.now();

    this.saveCharacters();
    return { success: true, message: `Training completed! Your ${stat} increased by ${statIncrease}.` };
  }

  // Rest system
  rest(userId: string): { success: boolean; message: string } {
    const character = this.getCharacter(userId);
    if (!character) {
      return { success: false, message: 'Character not found!' };
    }

    if (character.status !== 'idle') {
      return { success: false, message: 'You are currently busy with another activity!' };
    }

    const now = Date.now();
    if (now - character.lastRest < 3600000) { // 1 hour cooldown
      return { success: false, message: 'You can only rest once per hour!' };
    }

    character.status = 'resting';
    character.statusEndTime = now + 120000; // 2 minutes
    character.lastRest = now;

    this.saveCharacters();
    return { success: true, message: 'You have started resting! Rest will complete in 2 minutes.' };
  }

  completeRest(userId: string): { success: boolean; message: string } {
    const character = this.getCharacter(userId);
    if (!character) {
      return { success: false, message: 'Character not found!' };
    }

    if (character.status !== 'resting') {
      return { success: false, message: 'You are not currently resting!' };
    }

    if (Date.now() < character.statusEndTime) {
      return { success: false, message: 'Your rest is not yet complete!' };
    }

    // Restore HP, Mana, and Stamina
    character.hp = character.maxHp;
    character.mana = character.maxMana;
    character.stamina = character.maxStamina;

    character.status = 'idle';
    character.statusEndTime = 0;

    this.saveCharacters();
    return { success: true, message: 'Rest completed! Your HP, Mana, and Stamina have been fully restored.' };
  }

  // Daily rewards
  claimDaily(userId: string): { success: boolean; message: string; rewards?: any } {
    const character = this.getCharacter(userId);
    if (!character) {
      return { success: false, message: 'Character not found!' };
    }

    const now = Date.now();
    const lastDaily = new Date(character.lastDaily);
    const today = new Date();
    
    if (lastDaily.getDate() === today.getDate() && 
        lastDaily.getMonth() === today.getMonth() && 
        lastDaily.getFullYear() === today.getFullYear()) {
      return { success: false, message: 'You have already claimed your daily reward today!' };
    }

    const rewards: {
      xp: number;
      gold: number;
      items: Item[];
    } = {
      xp: 500 + (character.level * 50),
      gold: 200 + (character.level * 20),
      items: [
        { id: 'health_potion', name: 'Health Potion', type: 'consumable' as const, rarity: 'common' as const, quantity: 3, description: 'Restores 50 HP.', effects: { hp: 50 } },
        { id: 'mana_potion', name: 'Mana Potion', type: 'consumable' as const, rarity: 'common' as const, quantity: 3, description: 'Restores 50 Mana.', effects: { mana: 50 } }
      ]
    };

    this.addXP(userId, rewards.xp);
    character.gold += rewards.gold;
    character.lastDaily = now;

    // Add items to inventory
    rewards.items.forEach(item => {
      const existingItem = character.inventory.find(i => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        character.inventory.push(item);
      }
    });

    this.saveCharacters();
    return { 
      success: true, 
      message: `Daily reward claimed! You received ${rewards.xp} XP, ${rewards.gold} gold, and some potions.`,
      rewards 
    };
  }

  // Get top characters
  getTopCharacters(limit: number = 10): RPGCharacter[] {
    return Object.values(this.characters)
      .sort((a, b) => b.level === a.level ? b.xp - a.xp : b.level - a.level)
      .slice(0, limit);
  }
} 
