# Praan Full Stack Task (BackEnd)

## Run instructions

### Run locally

1. Install dependencies
```npm install```

2. Run the program:
```npm start```

3. Call API routes from localhost port 5000. Used Postman in testing
```http://localhost:5000/bulk-upload```

### Running Containerized API 

Note: Containerized app tends to time out. Work in progress...

1. Build the application with Docker
```docker build -t praan-backend .```

2. Run with Docker. :5000 must be replaces with your docker port
```docker run -p 5000:5000 praan-backend```
