# Infrastructure Description
The application is hosted on AWS using:
1. S3
   The frontend is deployed on S3 with the static website hosting.
   ![S3 status](./images/s3_status.png)
2. Elastic Beanstalk (EB)
   The backend is deployed on EB.
   ![EB status](./images/eb_status.png)
   The environment variables for EB are

| Key               | Description                                                             |
|-------------------|-------------------------------------------------------------------------|
| AWS_DB_HOST       | The address where for the RDS database runs on                          |
| AWS_DB_NAME       | The name of the database in development environment                     |
| AWS_DB_TEST_NAME  | The name of the database in test environment                            |
| AWS_DB_USER       | The username of the user which has all privileges for the two databases |
| AWS_DB_PASSWORD   | The password of the user                                                |
| ENV               | Working environment, set to "dev"                                       |
| BCRYPT_PASSWORD   | The password used for encrypting passwords for the users                |
| SALT_ROUNDS       | The hash rounds when encrypting passwords for the users                 |
| JWT_PASSWORD      | The secret for creating JSON Web Token                                  |

3. RDS
   The postgres database is hosted on RDS, including two databases for development and testing environment.
   ![RDS status](./images/rds_status.png)