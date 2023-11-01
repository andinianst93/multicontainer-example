# Worker
1. Redis
2. Fibonacci recursive function

# Server
1. Pg
2. Redis
3. API Routing

# Client
1. Frontend (app router - client component)

# NGINX
1. Create default.conf
2. Tell nginx there is an 'upstream' server at client:3000
3. Tell nginx there is an 'upstrean' server at server:5000
4. Listen on port 80
5. If anyone comes to '/' send them to client upstream
6. If anyone comes to '/api' send them to server upstream

# Travis
1. Specify docker as dependency
2. Build test version of React project
3. Run tests
4. Build prod versions of all projects
5. Push all to docker hub
6. Tell elastic beanstalk to update