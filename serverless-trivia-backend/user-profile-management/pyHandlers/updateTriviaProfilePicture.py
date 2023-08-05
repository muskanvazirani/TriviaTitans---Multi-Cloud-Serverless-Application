import boto3
import json

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('TriviaUser')

def lambda_handler(event, context):
    try:
        # Extract the userId and profilePicture from the request body
        request_body = json.loads(event['body'])
        user_id = request_body.get('userId')
        profile_picture = request_body.get('profilepicture')

        # Update the user's profile picture in the DynamoDB table
        response = table.update_item(
            Key={'user_id': user_id},
            UpdateExpression='SET profilepicture = :pp',
            ExpressionAttributeValues={':pp': profile_picture}
        )

        # Add CORS headers to allow cross-origin requests
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type'
        }

        # Return a success response
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'Profile picture updated successfully'}),
        }

    except Exception as e:
        # Handle any exceptions that might occur during the execution
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({'error': 'An error occurred while updating the profile picture'}),
        }
