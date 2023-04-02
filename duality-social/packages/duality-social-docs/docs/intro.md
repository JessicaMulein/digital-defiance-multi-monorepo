# Duality Social

![Duality Social](/img/logo.svg)

## Developing

- Clone the repository with ```https://github.com/Mulein-Studios/duality-social.git```
- Running ```./full-ci.sh``` will clear the node_modules and reinstall everything
  - Run with ```--help``` to see the options
  - ```--skip=node_modules_clean``` will skip the node_modules wipe
- If not running full-ci:
  - In the root of the repository, run ```./yarn-all.sh```
  - In the root of the repository, run ```./build-all.sh```
- Open the repository with VS Code
- In most of the repositories, edit/create src/environments/environment.ts and src/environments/environment.prod.ts to match your settings.
- To start testing the project, in the root of the repository, run ```MONGO_URL='mongodb+srv://duality:xxxxxx@digitaldefiance.xxxxx.mongodb.net/?retryWrites=true&w=majority' OPENAI_API_KEY="xxxxx" OPENAI_ORGANIZATION="xxxx" TENANT_ID="xxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxxxxx" CLIENT_ID="xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" SSL_ENABLED=true NODE_ENV=production COOKIE_ENABLED=true MSAL_CLIENT_SECRET="xxxxxxxxxxxxxxx"  nx serve duality-social-node```

### Shared library

- Stored in packages/duality-social-lib
- Build the library with ```nx build duality-social-lib``` from the toplevel directory

### Node app

- Stored in packages/duality-social-node
- Ensure the library is built first
- Build with ```nx build duality-social-node``` from the toplevel directory

### Front-End

- Stored in packages/duality-social-angular
- Ensure the library is built first
- Build with ```nx build duality-social-angular``` from the toplevel directory
- Need to get the NPM key for FontAwesome from https://fontawesome.com/docs/web/setup/packages
  - The NPM password is given under the "1. Configure Access" section.

### Database

- MongoDB.com Atlas
- Mongoose connector for both Node and JS/Angular

### Keys

- In Azure Portal go to Key Vaults > duality-social > Secrets

## Documentation

- Docusaurus: [https://docusaurus.io/docs/installation](https://docusaurus.io/docs/installation)
- Stored in packages/duality-social-docs
- Build the documentation with ```nx build duality-social-docs``` from the toplevel directory
- Serve the documentation with ```nx start duality-social-docs``` from the toplevel directory