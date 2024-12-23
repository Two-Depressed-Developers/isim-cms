export default ({ env }) => ({
	connection: {
		client: 'mysql',
		connection: {
		host: env('DATABASE_HOST', 'localhost'),
			port: env.int('DATABASE_PORT', 3306),
			database: env('DATABASE_NAME', 'strapi_db'),
			user: env('DATABASE_USERNAME', 'isim'),
			password: env('DATABASE_PASSWORD', 'isim'),
			ssl: env.bool('DATABASE_SSL', false)
		}
	}
});
