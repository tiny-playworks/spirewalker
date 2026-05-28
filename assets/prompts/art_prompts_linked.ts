import type { ArtPrompt } from './art_prompts';

/**
 * 100 art prompts with subjectId aligned to real game IDs.
 * Categories: cards (40), relics (20), enemies (20), bosses (10), misc (10)
 */
export const ART_PROMPTS_LINKED: ArtPrompt[] = [
  // ══════════════════════════════════════════════════════════════
  //  CARDS — 40 prompts linked to real card IDs
  // ══════════════════════════════════════════════════════════════

  // Starter cards
  { id: 'linked_strike', category: 'card', subcategory: 'attack', prompt: 'Dark warrior striking with a heavy iron blade, sparks flying from impact, cracked stone floor, dramatic side lighting, dark fantasy illustration', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_defend', category: 'card', subcategory: 'skill', prompt: 'Cloaked figure raising a spectral shield, ethereal blue barrier materializing, ancient ruins backdrop, moody atmospheric lighting, concept art', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_bash', category: 'card', subcategory: 'attack', prompt: 'Warrior delivering a devastating overhead smash, enemy reeling from impact, dust and debris flying, high contrast dark fantasy', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_flex', category: 'card', subcategory: 'skill', prompt: 'Agile fighter stretching before combat, muscles glowing with inner power, torchlit dungeon corridor, warm dramatic lighting', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_cleave', category: 'card', subcategory: 'attack', prompt: 'Sweeping blade arc cutting through multiple shadow enemies, motion blur effect, ruined temple interior, dark fantasy action scene', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_surge', category: 'card', subcategory: 'skill', prompt: 'Character channeling raw energy, glowing aura expanding outward, mystical runes floating, dark fantasy power-up moment', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_skim', category: 'card', subcategory: 'skill', prompt: 'Wizard rapidly flipping through magical pages, knowledge energy streaming into mind, ancient library setting, mystical glow', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_momentum', category: 'card', subcategory: 'skill', prompt: 'Warrior building kinetic energy, swirling momentum aura around body, ready to strike, dynamic pose, dark fantasy', style: 'dark_fantasy', aspect_ratio: '2:3' },

  // Guard archetype cards
  { id: 'linked_gd_c_iron_wall', category: 'card', subcategory: 'skill', prompt: 'Massive iron wall materializing from dark energy, defensive barrier forming,Guardian stance, dark fantasy concept art', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_gd_c_stone_skin', category: 'card', subcategory: 'skill', prompt: 'Warrior transforming skin to stone, rocky armor forming across body, defensive transformation, dark fantasy illustration', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_gd_c_bastion', category: 'card', subcategory: 'skill', prompt: 'Fortified bastion rising from ground, stone walls and magical barriers, protective formation, dark fantasy architecture', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_gd_c_fortify', category: 'card', subcategory: 'skill', prompt: 'Warrior fortifying position, layered shields and magical wards, defensive stance, dark fantasy tactical scene', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_gd_c_impenetrable', category: 'card', subcategory: 'skill', prompt: 'Impenetrable force field surrounding warrior, multiple defensive layers, glowing barriers, dark fantasy defensive magic', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_gd_c_rampart', category: 'card', subcategory: 'skill', prompt: 'Stone rampart rising from earth, defensive wall with magical reinforcement, battlefield fortification, dark fantasy', style: 'dark_fantasy', aspect_ratio: '2:3' },

  // Burst archetype cards
  { id: 'linked_br_b_rupture_slash', category: 'card', subcategory: 'attack', prompt: 'Explosive slash creating a rupture in space, energy爆裂 from blade, destructive power unleashed, dark fantasy action', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_br_b_momentum_strike', category: 'card', subcategory: 'attack', prompt: 'Warrior channeling momentum into a devastating strike, kinetic energy waves, powerful melee attack, dark fantasy', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_br_b_heavy_strike', category: 'card', subcategory: 'attack', prompt: 'Massive overhead strike with two-handed weapon, ground cracking from impact, raw power display, dark fantasy', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_br_b_armor_break', category: 'card', subcategory: 'attack', prompt: 'Shattering armor with precise strike, fragments flying, weakened enemy exposed, dark fantasy combat scene', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_br_b_chain_slash', category: 'card', subcategory: 'attack', prompt: 'Rapid chain of slashes creating multiple cut trajectories, speed and precision, dark fantasy sword technique', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_br_b_burst_slash', category: 'card', subcategory: 'attack', prompt: 'Explosive burst attack creating shockwave, energy爆裂 from weapon, devastating area damage, dark fantasy', style: 'dark_fantasy', aspect_ratio: '2:3' },

  // Mixed archetype cards
  { id: 'linked_mx_a_gentle_slash', category: 'card', subcategory: 'attack', prompt: 'Elegant sword technique, fluid motion cutting through air, graceful yet deadly, balanced offense and defense, dark fantasy', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_mx_a_rising_blade', category: 'card', subcategory: 'attack', prompt: 'Upward sword slash with rising energy, blade glowing with momentum, ascending attack, dark fantasy', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_mx_a_balanced_cut', category: 'card', subcategory: 'attack', prompt: 'Balanced combat stance, equal offense and defense, harmonious fighting style, dark fantasy warrior', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_mx_a_steel_edge', category: 'card', subcategory: 'attack', prompt: 'Steel blade with sharp edge catching light, metallic gleam, precise cutting technique, dark fantasy', style: 'dark_fantasy', aspect_ratio: '2:3' },

  // Neutral archetype cards
  { id: 'linked_nt_d_slash', category: 'card', subcategory: 'attack', prompt: 'Simple but effective slash attack, clean technique, practical combat style, dark fantasy realism', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_nt_d_riposte', category: 'card', subcategory: 'attack', prompt: 'Counter-attack stance, deflecting and striking back, defensive反击, dark fantasy tactical combat', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_nt_d_cleave_strike', category: 'card', subcategory: 'attack', prompt: 'Wide sweeping cleave attack, multiple targets hit, battlefield控制, dark fantasy area attack', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_nt_d_double_tap', category: 'card', subcategory: 'attack', prompt: 'Quick double strike, rapid sequential attacks, speed and precision, dark fantasy combat technique', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_nt_d_fortify', category: 'card', subcategory: 'skill', prompt: 'Basic fortification stance, simple but effective defense, practical blocking technique, dark fantasy', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_nt_d_iron_wall', category: 'card', subcategory: 'skill', prompt: 'Iron wall defense formation, sturdy barrier, reliable protection, dark fantasy defensive wall', style: 'dark_fantasy', aspect_ratio: '2:3' },

  // Rare/Power cards
  { id: 'linked_patience_stance', category: 'card', subcategory: 'power', prompt: 'Warrior in patient meditation stance, calm determination, building inner strength over time, dark fantasy', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_fortify', category: 'card', subcategory: 'skill', prompt: 'Powerful fortification spell, multiple defensive layers stacking, ultimate protection, dark fantasy defensive magic', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_overload', category: 'card', subcategory: 'skill', prompt: 'Energy overload, character releasing stored power in devastating burst, risk and reward, dark fantasy', style: 'dark_fantasy', aspect_ratio: '2:3' },
  { id: 'linked_blood_rush', category: 'card', subcategory: 'attack', prompt: 'Blood-fueled berserker attack, crimson energy surrounding weapon, reckless devastating strike, dark fantasy', style: 'dark_fantasy', aspect_ratio: '2:3' },

  // ══════════════════════════════════════════════════════════════
  //  RELICS — 20 prompts linked to real relic IDs
  // ══════════════════════════════════════════════════════════════

  { id: 'linked_vajra', category: 'relic', subcategory: 'weapon', prompt: 'Ancient vajra thunderbolt weapon, ornate gold and jade, crackling with divine power, dark fantasy artifact', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_anchor', category: 'relic', subcategory: 'artifact', prompt: 'Massive iron anchor with mystical runes, symbol of stability and grounding, dark fantasy relic', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_wind_chime', category: 'relic', subcategory: 'artifact', prompt: 'Ethereal wind chime made of spirit bone, chiming with otherworldly sounds, dark fantasy magical item', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_tactical_gloves', category: 'relic', subcategory: 'armor', prompt: 'Battle-worn tactical gloves with enchanted grip, tactical advantage, dark fantasy combat gear', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_burst_emblem', category: 'relic', subcategory: 'artifact', prompt: 'Crimson burst emblem crackling with explosive energy, symbol of destructive power, dark fantasy', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_guard_knot', category: 'relic', subcategory: 'artifact', prompt: 'Intricate guard knot woven from magical threads, protective charm, dark fantasy defensive relic', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_still_core', category: 'relic', subcategory: 'artifact', prompt: 'Crystalline still core pulsing with steady energy, calm power, dark fantasy meditation relic', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_iron_heart', category: 'relic', subcategory: 'artifact', prompt: 'Iron heart artifact beating with mechanical rhythm, steampunk meets dark fantasy, protective relic', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_fractured_blade', category: 'relic', subcategory: 'weapon', prompt: 'Fractured dark blade with cracks glowing with inner fire, broken but powerful, dark fantasy weapon', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_blaze_core', category: 'relic', subcategory: 'artifact', prompt: 'Blazing core of contained fire, swirling flames in crystalline prison, dark fantasy fire relic', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_momentum_siphon', category: 'relic', subcategory: 'artifact', prompt: 'Crystal siphon draining kinetic energy, swirling momentum streams, dark fantasy energy relic', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_stone_bulwark', category: 'relic', subcategory: 'armor', prompt: 'Massive stone bulwark shield, ancient defensive artifact, immovable object, dark fantasy', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_echo_plating', category: 'relic', subcategory: 'armor', prompt: 'Echoing metal plating that resonates with impacts, adaptive armor, dark fantasy', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_void_charm', category: 'relic', subcategory: 'artifact', prompt: 'Void charm orbiting with dark energy, absorbing surrounding light, dark fantasy void relic', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_soul_echo', category: 'relic', subcategory: 'artifact', prompt: 'Soul echo crystal resonating with spiritual energy, ghostly whispers, dark fantasy soul relic', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_iron_veil', category: 'relic', subcategory: 'armor', prompt: 'Iron veil mask with protective enchantments, concealing and protecting, dark fantasy', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_living_wall', category: 'relic', subcategory: 'artifact', prompt: 'Living wall segment that grows and adapts, organic defensive relic, dark fantasy nature magic', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_meditation_stone', category: 'relic', subcategory: 'artifact', prompt: 'Smooth meditation stone with inner glow, calming presence, dark fantasy zen relic', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_cycle_engine', category: 'relic', subcategory: 'artifact', prompt: 'Clockwork cycle engine with interlocking gears, perpetual motion machine, dark fantasy steampunk', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_resonance_plating', category: 'relic', subcategory: 'armor', prompt: 'Resonance plating that vibrates with energy, adaptive defense system, dark fantasy', style: 'dark_fantasy', aspect_ratio: '1:1' },

  // ══════════════════════════════════════════════════════════════
  //  ENEMIES — 20 prompts linked to real enemy IDs
  // ══════════════════════════════════════════════════════════════

  { id: 'linked_gen_en_rusty_skeleton', category: 'enemy', subcategory: 'normal', prompt: 'Rusty skeleton warrior with corroded armor, shambling undead, green phosphorescent eyes, dark fantasy undead', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_gen_en_burrowing_worm', category: 'enemy', subcategory: 'normal', prompt: 'Giant burrowing worm erupting from ground, massive mandibles, underground creature, dark fantasy monster', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_gen_en_plague_rat', category: 'enemy', subcategory: 'normal', prompt: 'Diseased plague rat swarm, glowing sickly green, vermin infestation, dark fantasy pest creature', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_gen_en_ash_crawler', category: 'enemy', subcategory: 'normal', prompt: 'Ash crawler creature made of burnt remains, ember glow, crawling through ruins, dark fantasy elemental', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_gen_en_bone_thrower', category: 'enemy', subcategory: 'normal', prompt: 'Skeleton archer hurling bone projectiles, undead marksman, dark fantasy ranged undead', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_gen_en_fang_weaver', category: 'enemy', subcategory: 'normal', prompt: 'Spider-like creature weaving fang webs, multiple eyes glowing, dark fantasy arachnid', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_gen_en_thorn_vine', category: 'enemy', subcategory: 'normal', prompt: 'Animated thorn vine creature, grasping tendrils, corrupted plant, dark fantasy flora monster', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_gen_en_iron_goblet', category: 'enemy', subcategory: 'normal', prompt: 'Iron golem guardian, massive construct with glowing runes, dark fantasy construct', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_gen_en_cinder_imp', category: 'enemy', subcategory: 'normal', prompt: 'Small cinder imp with burning body, mischievous fire creature, dark fantasy demon', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_gen_en_moss_golem', category: 'enemy', subcategory: 'normal', prompt: 'Moss-covered golem, nature reclaims stone construct, ancient guardian, dark fantasy', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_gen_en_shadow_wraith', category: 'enemy', subcategory: 'normal', prompt: 'Shadow wraith dissolving into darkness, ethereal undead, dark fantasy spirit', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_gen_en_frost_skeleton', category: 'enemy', subcategory: 'normal', prompt: 'Frozen skeleton covered in ice crystals, cold undead, dark fantasy frost undead', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_gen_en_flame_slime', category: 'enemy', subcategory: 'normal', prompt: 'Burning flame slime, molten core visible, dangerous puddle of fire, dark fantasy elemental', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_gen_en_void_tendril', category: 'enemy', subcategory: 'normal', prompt: 'Void tendril reaching from dimensional rift, dark energy tentacle, dark fantasy eldritch', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_gen_en_rock_lurker', category: 'enemy', subcategory: 'normal', prompt: 'Rock lurker hiding in stone, ambush predator, camouflage creature, dark fantasy', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_gen_en_soul_harvester', category: 'enemy', subcategory: 'elite', prompt: 'Soul harvester with spectral scythe, draining life force, dark fantasy reaper', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_gen_en_iron_sentinel', category: 'enemy', subcategory: 'elite', prompt: 'Iron sentinel automaton, towering construct guardian, dark fantasy machine', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_gen_en_plague_doctor', category: 'enemy', subcategory: 'elite', prompt: 'Plague doctor with ominous mask, carrying toxins, dark fantasy villain', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_gen_en_shadow_knight', category: 'enemy', subcategory: 'elite', prompt: 'Shadow knight in dark armor, corrupted paladin, dark fantasy fallen warrior', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_gen_en_ember_dragon', category: 'enemy', subcategory: 'elite', prompt: 'Small ember dragon with molten scales, fire-breathing wyrm, dark fantasy dragon', style: 'dark_fantasy', aspect_ratio: '1:1' },

  // ══════════════════════════════════════════════════════════════
  //  BOSSES — 10 prompts linked to real boss IDs
  // ══════════════════════════════════════════════════════════════

  { id: 'linked_boss_lich_king', category: 'boss_splash', subcategory: 'chapter_1', prompt: 'Lich King on dark throne, crown of skulls, necrotic energy swirling, massive undead army behind, epic boss splash art, dark fantasy', style: 'dark_fantasy', aspect_ratio: '16:9' },
  { id: 'linked_boss_fire_lord', category: 'boss_splash', subcategory: 'chapter_1', prompt: 'Fire lord emerging from volcano, molten armor, wings of flame, devastating heat, epic boss splash art, dark fantasy', style: 'dark_fantasy', aspect_ratio: '16:9' },
  { id: 'linked_boss_void_emperor', category: 'boss_splash', subcategory: 'chapter_2', prompt: 'Void emperor floating in dimensional rift, reality warping around him, cosmic horror, epic boss splash art, dark fantasy', style: 'dark_fantasy', aspect_ratio: '16:9' },
  { id: 'linked_boss_iron_titan', category: 'boss_splash', subcategory: 'chapter_2', prompt: 'Massive iron titan construct, mechanical god, steam and gears, epic boss splash art, dark fantasy steampunk', style: 'dark_fantasy', aspect_ratio: '16:9' },
  { id: 'linked_boss_shadow_dragon', category: 'boss_splash', subcategory: 'chapter_2', prompt: 'Shadow dragon with void wings, reality distortion, cosmic terror, epic boss splash art, dark fantasy', style: 'dark_fantasy', aspect_ratio: '16:9' },
  { id: 'linked_boss_ancient_guardian', category: 'boss_splash', subcategory: 'chapter_3', prompt: 'Ancient stone guardian awakened, colossal construct, runes glowing, epic boss splash art, dark fantasy', style: 'dark_fantasy', aspect_ratio: '16:9' },
  { id: 'linked_boss_corrupted_god', category: 'boss_splash', subcategory: 'chapter_3', prompt: 'Corrupted deity with twisted form, divine power turned dark, cosmic horror, epic boss splash art, dark fantasy', style: 'dark_fantasy', aspect_ratio: '16:9' },
  { id: 'linked_boss_crystal_emperor', category: 'boss_splash', subcategory: 'chapter_3', prompt: 'Crystal emperor with crystalline body, prismatic light attacks, geometric patterns, epic boss splash art, dark fantasy', style: 'dark_fantasy', aspect_ratio: '16:9' },
  { id: 'linked_boss_void_lord', category: 'boss_splash', subcategory: 'chapter_3', prompt: 'Void lord floating in absolute darkness, reality consuming presence, cosmic horror, epic boss splash art, dark fantasy', style: 'dark_fantasy', aspect_ratio: '16:9' },
  { id: 'linked_boss_time_weaver', category: 'boss_splash', subcategory: 'chapter_3', prompt: 'Time weaver manipulating temporal threads, ageless entity, clockwork motifs, epic boss splash art, dark fantasy', style: 'dark_fantasy', aspect_ratio: '16:9' },

  // ══════════════════════════════════════════════════════════════
  //  MISC — 10 prompts for UI/map/world elements
  // ══════════════════════════════════════════════════════════════

  { id: 'linked_map_node_battle', category: 'map', subcategory: 'battle', prompt: 'Glowing battle node on dark map, crossed swords symbol, ominous red aura, dark fantasy map element', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_map_node_rest', category: 'map', subcategory: 'rest', prompt: 'Peaceful rest site campfire, warm glow in darkness, healing sanctuary, dark fantasy rest point', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_map_node_shop', category: 'map', subcategory: 'shop', prompt: 'Mysterious merchant stall, shadowy figure behind counter, magical items displayed, dark fantasy shop', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_map_node_event', category: 'map', subcategory: 'event', prompt: 'Mysterious event marker, swirling anomaly, unknown encounter, dark fantasy map event', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_ui_energy', category: 'ui', subcategory: 'icon', prompt: 'Glowing energy orb icon, blue crystalline sphere, power indicator, dark fantasy UI element', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_ui_health', category: 'ui', subcategory: 'icon', prompt: 'Health heart icon, crimson gemstone, life indicator, dark fantasy UI element', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_ui_block', category: 'ui', subcategory: 'icon', prompt: 'Block shield icon, silver barrier symbol, defense indicator, dark fantasy UI element', style: 'dark_fantasy', aspect_ratio: '1:1' },
  { id: 'linked_world_ruins', category: 'world', subcategory: 'ruins', prompt: 'Ancient ruins at twilight, crumbling architecture, overgrown with dark vegetation, atmospheric perspective, dark fantasy environment', style: 'dark_fantasy', aspect_ratio: '16:9' },
  { id: 'linked_world_void', category: 'world', subcategory: 'abstract', prompt: 'Void dimension with floating debris, impossible geometry, cosmic horror landscape, dark fantasy environment', style: 'dark_fantasy', aspect_ratio: '16:9' },
  { id: 'linked_world_citadel', category: 'world', subcategory: 'ruins', prompt: 'Dark citadel rising from mist, foreboding fortress, ancient power, dark fantasy architecture', style: 'dark_fantasy', aspect_ratio: '16:9' },
];
