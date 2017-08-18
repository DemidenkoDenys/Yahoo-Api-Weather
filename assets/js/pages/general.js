export default {
	init() {
		this.generalFunction();
	},
	generalFunction() {
        $('#popup-nocity').popup({
            opacity: 0.3,
            transition: 'all 0.3s'
        });

        $('#popup-exist').popup({
            opacity: 0.3,
            transition: 'all 0.3s'
        });
	}
};