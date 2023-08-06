import json
import boto3
from decimal import Decimal

def lambda_handler(event, context):
    # Initialize DynamoDB client
    dynamodb = boto3.resource('dynamodb')

    # Replace with your DynamoDB table names
    achievements_table = dynamodb.Table('Achievements')
    game_data_table = dynamodb.Table('GameStat')
    teams_table = dynamodb.Table('Teams')

    def decimal_serializer(obj):
        if isinstance(obj, Decimal):
            return int(obj)
        raise TypeError("Object of type '{}' is not JSON serializable".format(type(obj).__name__))

    try:
        # Fetch the userId from the request
        print('Event :',event)
        request_body = json.loads(event['body'])
        user_id = request_body.get('userId')
        #user_id='User1'

        # Fetch data from the "Achievements" table for the specified userId
        response_achievements = achievements_table.scan()
        achievements = response_achievements.get('Items', [])

        # Fetch data from the "GameStat" table for the specified userId
        response_game_data = game_data_table.get_item(Key={'userId': user_id})
        game_data = response_game_data.get('Item', {})

        # Fetch data from the "teams" table where the input "userId" is present as a member
        response_teams = teams_table.scan()
        teams_data = response_teams.get('Items', [])
        current_team = [team for team in teams_data if any(member['user_id'] == user_id for member in team['members'])]

        # Prepare the response data with required fields from each table
        response_data = {
            'achievements': achievements,
            'gameStat': game_data,
            'currentTeam': current_team,
        }

        # Return the response data as the API response
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',  # Allow all origins (you can restrict it to specific origins)
            },
            'body': json.dumps(response_data, default=decimal_serializer)
        }

    except Exception as e:
        print('Error:', str(e))
        # Return an error response if something goes wrong
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',  # Allow all origins (you can restrict it to specific origins)
            },
            'body': json.dumps({'error': 'An error occurred while fetching data'})
        }
