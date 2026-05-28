import { RELIC_DEFINITIONS } from '../src/game/core/definitions/relics';
import { GENERATED_RELICS } from '../src/game/core/definitions/generated_relics';

const originalIds = Object.keys(RELIC_DEFINITIONS).filter(id => !GENERATED_RELICS[id]);
const generatedIds = Object.keys(GENERATED_RELICS);

console.log('Original relics:', originalIds.length);
console.log('Generated relics:', generatedIds.length);
console.log('Total:', Object.keys(RELIC_DEFINITIONS).length);

// Check for semantic overlap by comparing keywords in descriptions
const originalDescs = originalIds.map(id => ({
  id,
  name: RELIC_DEFINITIONS[id].name,
  desc: RELIC_DEFINITIONS[id].description,
}));

const generatedDescs = generatedIds.map(id => ({
  id,
  name: GENERATED_RELICS[id].name,
  desc: GENERATED_RELICS[id].description,
}));

console.log('\n=== Semantic Overlap Check ===');
for (const orig of originalDescs) {
  const keywords = orig.desc.match(/[一-鿿]+/g) || [];
  for (const gen of generatedDescs) {
    const genKeywords = gen.desc.match(/[一-鿿]+/g) || [];
    // Check if descriptions share significant keywords
    const shared = keywords.filter(k => genKeywords.some(gk => gk.includes(k) || k.includes(gk)));
    if (shared.length >= 3) {
      console.log(`  OVERLAP: ${orig.id} "${orig.name}" vs ${gen.id} "${gen.name}"`);
      console.log(`    Original: ${orig.desc.substring(0, 60)}`);
      console.log(`    Generated: ${gen.desc.substring(0, 60)}`);
      console.log(`    Shared keywords: ${shared.join(', ')}`);
    }
  }
}
