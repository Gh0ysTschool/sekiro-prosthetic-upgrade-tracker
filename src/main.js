//import App from './App.svelte';
import SekiroSkillGrid/*App*/ from './SekiroSkillGrid.svelte';

import {selectedMaterial, selectedTool } from "./store.js";

const app = new SekiroSkillGrid({//App({
	target: document.body,
	props: {
		selectedMaterial:selectedMaterial, 
		selectedTool:selectedTool,
		tools: [
			{"type":"axe","tools":["loaded","spring_loaded","sparking","lazulite"]},
			{"type":"divine_abduction","tools":["loaded","double","golden_vortex"]},
			{"type":"finger_whistle","tools":["loaded","mountain_echo","malcontent"]},
			{"type":"firecracker","tools":["loaded","long_spark","purple_fume_spark","spring_loaded"]},
			{"type":"flame_vent","tools":["loaded","spring_loaded","okinagas","lazulite_sacred"]},
			{"type":"mist_raven_feather","tools":["loaded","aged","great"]},
			{"type":"sabimaru","tools":["loaded","improved","piercing","lazulite"]},
			{"type":"shuriken","tools":["loaded","spinning","gouging_top","sen_throw","phantom_kunai","lazulite",]},
			{"type":"spear","tools":["loaded","loaded_thrust","loaded_cleave","spiral","leaping_flame"]},
			{"type":"umbrella","tools":["loaded","loaded_magnetic","phoenixs_lilac","suzakus_lotus"]},
			{"type":"arm","tools":["shinobi-prosthetic",]},
		],
		materials: [
			"sen",
			"scrap_iron",
			"adamantite_scrap",
			"yellow_gunpowder",
			"black_gunpowder",
			"lapis_lazuli",
			"lump_of_grave_wax",
			"fulminated_mercury",
			"lump_of_fat_wax",
			"scrap_magnetite",

			"malcontent's_ring",
			"pine_resin_ember",
			"flame_barrel",
			"gyoubus_broken_horn",
			"iron_fortress",
			"large_fan",
			"mechanical_barrel",
			"mist_ravens_feathers",
			"phantom_kunai",
			"roberts_firecrackers",
			"sabimaru",
			"shinobi_axe_of_the_monkey",
			"shuriken_wheel",
			"slender_finger",
		],
	}
});

export default app;