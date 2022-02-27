import { Vex } from '../src/vex.js';
import { Flow } from '../src/flow.js';
import { loadCustom } from '../src/fonts/load_custom.js';
import { loadPetaluma } from '../src/fonts/load_petaluma.js';
import { loadTextFonts } from '../src/fonts/textfonts.js';
loadPetaluma();
loadCustom();
Flow.setMusicFont('Petaluma', 'Custom');
loadTextFonts();
export * from '../src/index.js';
export default Vex;