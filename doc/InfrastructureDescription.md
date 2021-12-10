# Infrastructure Description
The application is hosted on AWS using:
1. S3
   The frontend is deployed on S3 with the static website hosting.
   ![S3 status](./images/s3_status.png)
2. Elastic Beanstalk (EB)
   The backend is deployed on EB.
   ![EB status](./images/eb_status.png)
3. RDS
   The postgres database is hosted on RDS, including two databases for development and testing environment.
   ![RDS status](./images/rds_status.png)