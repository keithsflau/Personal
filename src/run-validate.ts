import { assertContent, contentStats } from './lib/validate';

assertContent();
const stats = contentStats();
console.log(`content ok: ${stats.activities} activities, ${stats.steps} steps, ${stats.daily} daily questions`);
