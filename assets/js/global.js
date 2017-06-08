import GENERAL from "./pages/general";
import HOME from "./pages/home";

let init = null;

switch (global.vars.page) {
	case 'home_page':
		init = HOME.init.bind(HOME);
		break;
	default:
		init = () => {
			console.log('default init');
		};
}

$(document).ready(GENERAL.init(), init());