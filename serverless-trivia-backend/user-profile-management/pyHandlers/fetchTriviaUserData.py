import boto3
import json

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('TriviaUser')

def lambda_handler(event, context):
    try:
        print('Event :',event)
        # Extract the userId from the request body
        request_body = json.loads(event['body'])
        print('Event :',event)
        user_id = request_body.get('userId')
        print('Event :',event)

        print('Fetching user data for id :',user_id)
        # Fetch user data from the DynamoDB table based on the userId
        response = table.get_item(Key={'user_id': user_id})
        print('User data fetch :',response)
        # Check if the user exists in the table
        if 'Item' in response:
            user_data = response['Item']
        else:
            user_data = {}

        # Add CORS headers to allow cross-origin requests
        headers = {
            'Access-Control-Allow-Origin': '*',  # Replace '*' with your allowed origin or list of origins
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type'
        }

        # Return the user data in the Lambda response
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(user_data),
        }

    except Exception as e:
        # Handle any exceptions that might occur during the execution
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({'error': 'An error occurred while fetching user data'}),
        }
