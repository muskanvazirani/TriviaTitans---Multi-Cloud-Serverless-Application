import json
import boto3

def lambda_handler(event, context):
    # Extract the user details from the API request
    try:
        print('Update user details received..event : ',event)
        request_body = json.loads(event['body'])

        user_id = request_body['userId']
        username = request_body['username']
        location = request_body['location']
        date_of_birth = request_body['dateOfBirth']
        email = request_body['email']
    except KeyError:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',  # Allow all origins (you can restrict it to specific origins)
            },
            'body': json.dumps({'error': 'Missing required fields in the request body'}),
        }

    # Initialize DynamoDB client
    dynamodb = boto3.resource('dynamodb')

    # Replace with your DynamoDB table name for "TriviaUser"
    trivia_user_table = dynamodb.Table('TriviaUser')

    try:
        # Update the user details in the "TriviaUser" table
        trivia_user_table.update_item(
            Key={'user_id': user_id},
            UpdateExpression='SET #name = :username, #loc = :location, #dob = :dob, #email = :email',
            ExpressionAttributeNames={
                '#name': 'username',
                '#loc': 'location',
                '#dob': 'dateOfBirth',
                '#email': 'email',
            },
            ExpressionAttributeValues={
                ':username': username,
                ':location': location,
                ':dob': date_of_birth,
                ':email': email,
            },
        )

        # Return a success response
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({'message': 'User details updated successfully'}),
        }

    except Exception as e:
        print('Error:', str(e))
        # Return an error response if something goes wrong
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({'error': 'An error occurred while updating user details'}),
        }
