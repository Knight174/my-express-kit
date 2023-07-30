# my-express-kit

The kit can remind me how to create an express application.

- express.js
- typescript
- postgresql
- redis
- prisma
- docker

## roadmap

- [x] register (email)
- [x] login
- [x] file upload (single file)
- [x] file upload (base64)
- [x] file upload (multi files)
- [ ] file upload (multipart)
- [x] file download
- [x] file sending
- [ ] real-time logs

## express api

- express.xxx
- app.xxx
- req.xxx
- res.xxx
- router.xxx

## middleware

- bodyParser: limit body size
- cors: handle cors
- morgan: handle request logs
- winston: handle error or the other logs
- express-jwt: validating JWTs

## install

```bash
$ npm i
```

## start

```bash
$ npm run dev
```

## init db server in docker

> If you have created the database server, skip it.

```bash
touch sketch-data # used to persistently store pg data
chmod +x ./bin/create_databases.sh
bin/create_databases.sh
```

## create databses

> If you alse have created these databases, skip it.

```bash
# enter your psql container
docker exec -it <container_name_or_id> bash

# login psql
# psql -U <username> -d <database_name>
psql -U sketch

# CREATE DATABASE <database_name>;
CREATE DATABASE sketch_dev; # for dev
CREATE DATABASE sketch_test; # for test
CREATE DATABASE sketch_prod; # for production

# connect to db sketch_dev
\c sketch_dev;
```

## connect to db for dev

```bash
# enter your psql container
docker exec -it <container_id psql> bash
# and then execute the below command in the docker container
psql -U sketch -d sketch_dev
```
