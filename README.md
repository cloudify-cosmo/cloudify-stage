# Cloudify new UI

### Prerequisites
- Have node and npm intalled on your machine
- Have postgreSQL installed and running on your machine
    - Make a database named 'stage' 
    - Make a user named 'cloudify' with 'cloudify' as password 

### Configurations
- log4jsconf.json - change log paths to point in the project, for example: ‘./logs/logfilename’
- app.json - ssl.ca - change to “” (empty string)
- manager.json - ip - change to a manager ip

### Build
- `npm run beforebuild`
- `cd backend && npm run db-migrate`
- To run the server: `export NODE_TLS_REJECT_UNAUTHORIZED=0 && npm start`
- To run the client: `node devServer.js`
- To load widgets: `grunt widgets`