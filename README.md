# Modrinth statistics

a Page to view some global statistics about [Modrinth](https://modrinth.com/)

### Planned Features

* data on specific projects - Same graphs as for mods but only showing a single project
* settings
    * only show specif versions

### .env

```dotenv
# example .env
MONGODB_DB=modrinth-statistics
MONGODB_CONNECTION=mongodb://<user>:<password>@<domain>:27017/<DB>
MONGODB_DEV_DB=modrinth-statistics-dev
MONGODB_DEV_CONNECTION=mongodb://<user>:<password>@<domain>:27017/<DB>
POSTHOG_API_KEY=<your_key>
POSTHOG_API_HOST=https://eu.posthog.com
``` 