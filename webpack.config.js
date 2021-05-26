const DotEnvWebpack = require("dotenv-webpack");

module.exports = (config, { isProd, isDev, isTest }) => {
	/**

     * Customize the webpack by modifying the config object.

     * Consult https://webpack.js.org/configuration for more information

     */

	// We dynamically change the path to the .env that contains the file corresponding to our profile

	let envPath;

	switch (process.env.FLEX_TWILIO_PROFILE) {
		case "FlexDev":
			envPath = ".env.development";

			break;

		case "Flex":
			envPath = ".env.production";

			break;
	}

	// If path was set, use the dotenv-webpack to inject the variables

	if (envPath) {
		config.plugins.push(
			new DotEnvWebpack({
				path: envPath,
			})
		);
	}

	return config;
};
