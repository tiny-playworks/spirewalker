import Phaser from 'phaser';

export function createProceduralTextures(scene: Phaser.Scene): void {
  if (!scene.textures.exists('enemy-chaser')) createChaser(scene);
  if (!scene.textures.exists('enemy-ranged')) createRanged(scene);
  if (!scene.textures.exists('enemy-charger')) createCharger(scene);
  if (!scene.textures.exists('enemy-overload')) createOverload(scene);
  if (!scene.textures.exists('enemy-boss')) createBoss(scene);
  if (!scene.textures.exists('projectile-arc')) createProjectile(scene, 'projectile-arc', 0x29d9cc, 0xeafffb, 18);
  if (!scene.textures.exists('projectile-blast')) createProjectile(scene, 'projectile-blast', 0xff9147, 0xfff2ca, 24);
  if (!scene.textures.exists('projectile-frost')) createProjectile(scene, 'projectile-frost', 0x8be8ff, 0xffffff, 18);
  if (!scene.textures.exists('projectile-enemy')) createProjectile(scene, 'projectile-enemy', 0xff5e72, 0xffd5c7, 20);
  if (!scene.textures.exists('weapon-arc')) createWeapon(scene, 'weapon-arc', 0x25c9c2, 0xffcf66, 76, 22);
  if (!scene.textures.exists('weapon-blast')) createWeapon(scene, 'weapon-blast', 0xff8b46, 0xffcf66, 88, 30);
  if (!scene.textures.exists('weapon-frost')) createWeapon(scene, 'weapon-frost', 0x83ddff, 0xf7ffff, 92, 20);
  if (!scene.textures.exists('entity-shadow')) createShadow(scene);
}

export function drawArena(scene: Phaser.Scene): void {
  const graphics = scene.add.graphics();
  graphics.setDepth(-20);
  graphics.fillStyle(0xf8edcf, 1);
  graphics.fillRect(0, 0, 1_280, 720);
  graphics.fillStyle(0xe9f7ec, 1);
  graphics.fillCircle(640, 360, 430);
  graphics.lineStyle(5, 0x2a8f8e, 0.55);
  graphics.strokeCircle(640, 360, 425);
  graphics.lineStyle(3, 0xd1a54b, 0.55);
  graphics.strokeCircle(640, 360, 344);
  graphics.strokeCircle(640, 360, 205);
  graphics.lineStyle(2, 0x7cc5b7, 0.28);
  for (let x = 80; x < 1_280; x += 80) graphics.lineBetween(x, 0, x, 720);
  for (let y = 40; y < 720; y += 80) graphics.lineBetween(0, y, 1_280, y);
  graphics.lineStyle(4, 0xffffff, 0.55);
  graphics.strokeRoundedRect(28, 28, 1_224, 664, 36);
  graphics.fillStyle(0x135b62, 0.95);
  graphics.fillRoundedRect(18, 18, 220, 42, 16);
  graphics.fillRoundedRect(1_042, 18, 220, 42, 16);
  graphics.fillStyle(0xffd66b, 0.85);
  for (let index = 0; index < 7; index += 1) {
    const angle = Math.PI * 2 * index / 7;
    const x = 640 + Math.cos(angle) * 344;
    const y = 360 + Math.sin(angle) * 344;
    graphics.fillCircle(x, y, 8);
  }
}

function createChaser(scene: Phaser.Scene): void {
  const graphics = scene.add.graphics();
  graphics.fillStyle(0x3e685f, 0.2);
  graphics.fillCircle(48, 53, 32);
  graphics.lineStyle(5, 0x5c3b26, 1);
  graphics.fillStyle(0xb8874b, 1);
  graphics.fillCircle(48, 45, 29);
  graphics.strokeCircle(48, 45, 29);
  graphics.fillStyle(0xe4b75f, 1);
  graphics.fillCircle(48, 45, 19);
  graphics.lineStyle(3, 0x69401f, 1);
  graphics.strokeCircle(48, 45, 19);
  graphics.fillStyle(0x28c7bd, 1);
  graphics.fillCircle(48, 45, 8);
  graphics.fillStyle(0xffffff, 0.9);
  graphics.fillCircle(45, 42, 3);
  for (let index = 0; index < 8; index += 1) {
    const angle = Math.PI * 2 * index / 8;
    graphics.fillStyle(0x8f6338, 1);
    graphics.fillRect(43 + Math.cos(angle) * 34, 40 + Math.sin(angle) * 34, 10, 10);
  }
  graphics.generateTexture('enemy-chaser', 96, 96);
  graphics.destroy();
}

function createRanged(scene: Phaser.Scene): void {
  const graphics = scene.add.graphics();
  graphics.fillStyle(0x7c287d, 0.25);
  graphics.fillCircle(44, 56, 27);
  graphics.lineStyle(4, 0x54215e, 1);
  graphics.fillStyle(0xc34ad6, 1);
  graphics.fillTriangle(44, 6, 75, 66, 13, 66);
  graphics.strokeTriangle(44, 6, 75, 66, 13, 66);
  graphics.fillStyle(0xf28ef1, 1);
  graphics.fillTriangle(44, 15, 61, 57, 27, 57);
  graphics.fillStyle(0x33213d, 1);
  graphics.fillRoundedRect(27, 50, 34, 21, 9);
  graphics.fillStyle(0xffd769, 1);
  graphics.fillCircle(38, 59, 4);
  graphics.fillCircle(51, 59, 4);
  graphics.generateTexture('enemy-ranged', 88, 88);
  graphics.destroy();
}

function createCharger(scene: Phaser.Scene): void {
  const graphics = scene.add.graphics();
  graphics.fillStyle(0x9b3029, 0.22);
  graphics.fillEllipse(55, 64, 82, 49);
  graphics.lineStyle(5, 0x69251f, 1);
  graphics.fillStyle(0xe9513e, 1);
  graphics.fillRoundedRect(15, 24, 82, 54, 25);
  graphics.strokeRoundedRect(15, 24, 82, 54, 25);
  graphics.fillStyle(0xff8d4a, 1);
  graphics.fillTriangle(24, 28, 34, 4, 45, 29);
  graphics.fillTriangle(54, 26, 68, 2, 76, 32);
  graphics.fillTriangle(76, 32, 96, 13, 92, 45);
  graphics.fillStyle(0xffd365, 1);
  graphics.fillCircle(33, 52, 7);
  graphics.fillStyle(0x4a2021, 1);
  graphics.fillCircle(35, 52, 3);
  graphics.fillStyle(0x8d3a2b, 1);
  graphics.fillCircle(30, 77, 12);
  graphics.fillCircle(78, 77, 12);
  graphics.generateTexture('enemy-charger', 112, 104);
  graphics.destroy();
}

function createOverload(scene: Phaser.Scene): void {
  const graphics = scene.add.graphics();
  graphics.fillStyle(0x8c5b2d, 0.2).fillEllipse(48, 73, 76, 28);
  graphics.lineStyle(5, 0x654022, 1).fillStyle(0xf0ad42, 1).fillRoundedRect(20, 28, 56, 48, 15)
    .strokeRoundedRect(20, 28, 56, 48, 15);
  graphics.fillStyle(0xffe577, 1).fillCircle(48, 50, 15);
  graphics.fillStyle(0xff7651, 1).fillCircle(48, 50, 7);
  graphics.lineStyle(4, 0x2a7776, 1).lineBetween(48, 28, 48, 10);
  graphics.fillStyle(0x43d1c4, 1).fillCircle(48, 9, 6);
  graphics.generateTexture('enemy-overload', 96, 92);
  graphics.destroy();
}

function createBoss(scene: Phaser.Scene): void {
  const graphics = scene.add.graphics();
  graphics.fillStyle(0x8c4430, 0.22);
  graphics.fillEllipse(110, 150, 180, 74);
  graphics.lineStyle(8, 0x613b2a, 1);
  graphics.fillStyle(0xd6c19b, 1);
  graphics.fillCircle(110, 102, 78);
  graphics.strokeCircle(110, 102, 78);
  graphics.fillStyle(0xb27839, 1);
  graphics.fillCircle(110, 102, 58);
  graphics.lineStyle(5, 0x6a4225, 1);
  graphics.strokeCircle(110, 102, 58);
  graphics.fillStyle(0x2c3636, 1);
  graphics.fillRoundedRect(56, 105, 108, 45, 17);
  for (let index = 0; index < 5; index += 1) {
    graphics.fillStyle(0xff7b38, 1);
    graphics.fillRoundedRect(68 + index * 20, 113, 11, 30, 4);
  }
  graphics.fillStyle(0xffca55, 1);
  graphics.fillCircle(82, 82, 12);
  graphics.fillCircle(138, 82, 12);
  graphics.fillStyle(0xff553c, 1);
  graphics.fillCircle(82, 82, 6);
  graphics.fillCircle(138, 82, 6);
  graphics.fillStyle(0x32c7bf, 1);
  graphics.fillCircle(110, 39, 16);
  graphics.lineStyle(4, 0xffffff, 0.75);
  graphics.strokeCircle(110, 39, 16);
  graphics.generateTexture('enemy-boss', 220, 196);
  graphics.destroy();
}

function createProjectile(scene: Phaser.Scene, key: string, color: number, highlight: number, size: number): void {
  const graphics = scene.add.graphics();
  graphics.fillStyle(color, 0.24);
  graphics.fillCircle(size / 2, size / 2, size / 2);
  graphics.fillStyle(color, 1);
  graphics.fillCircle(size / 2, size / 2, size * 0.31);
  graphics.fillStyle(highlight, 1);
  graphics.fillCircle(size * 0.42, size * 0.39, size * 0.12);
  graphics.generateTexture(key, size, size);
  graphics.destroy();
}

function createWeapon(scene: Phaser.Scene, key: string, body: number, trim: number, width: number, height: number): void {
  const graphics = scene.add.graphics();
  graphics.lineStyle(4, 0x553a25, 1);
  graphics.fillStyle(body, 1);
  graphics.fillRoundedRect(8, 4, width - 17, height - 8, height / 2);
  graphics.strokeRoundedRect(8, 4, width - 17, height - 8, height / 2);
  graphics.fillStyle(trim, 1);
  graphics.fillCircle(width * 0.42, height / 2, height * 0.28);
  graphics.fillRect(width - 15, height * 0.32, 14, height * 0.36);
  graphics.generateTexture(key, width, height);
  graphics.destroy();
}

function createShadow(scene: Phaser.Scene): void {
  const graphics = scene.add.graphics();
  graphics.fillStyle(0x174b4d, 0.2);
  graphics.fillEllipse(64, 20, 116, 32);
  graphics.generateTexture('entity-shadow', 128, 40);
  graphics.destroy();
}
