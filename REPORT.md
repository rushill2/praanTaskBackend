# Design Document

## Modules

### index.ts

Entry point that hosts the Express application and uses the API router created for the device

### Models

Contains DeviceData.ts which contains a model and an interface for the data format pushed to the repository

### Database

Contains a class DBHandler with methods for generic GET requests and a POST for the bulk upload operation

### Routes

Contains the router that declares routes and assigns their controllers for the CRUD API

### Controllers

Contains the class DeviceController that has methods for handling each API route, with GET and POST methods and supplementary operations

## Design Decisions

To maintain modularity, a controller-based design was chosen, with the routes being handled by the controller while still being available to the top level. Due to unfamiliarity with JWT tokens I was unable to implement a robust mechanism for the same. However, the application is now containerized and can be deployed on cluster nodes if necessary.
