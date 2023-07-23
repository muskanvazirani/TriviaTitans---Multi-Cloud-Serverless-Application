import boto3
from flask import Flask, request, jsonify

app = Flask(__name__)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Teams')

@app.route('/team', methods=['POST'])
def handle_team_action():
    event = request.json

    if 'team_id' not in event:
        return jsonify({'status': 'Team ID not provided'})

    response = table.get_item(Key={'team_id': event['team_id']})

    if 'Item' in response:
        team = response['Item']

        if 'action' in event:
            action = event['action']
            user_id = event['user_id']

            if action == 'promote_to_admin':
                for member in team['members']:
                    if member['user_id'] == user_id:
                        member['is_admin'] = True
                        table.put_item(Item=team)
                        return jsonify({'status': 'User promoted to admin'})

                return jsonify({'status': 'User is not a member'})

            elif action == 'remove_member' or action == 'leave_team':
                team['members'] = [member for member in team['members'] if member['user_id'] != user_id]
                table.put_item(Item=team)
                if action == 'remove_member':
                    return jsonify({'status': 'User removed from team'})
                else:
                    return jsonify({'status': 'User left the team'})

            elif action == 'add_member':
                new_member = {'user_id': user_id, 'is_admin': False}
                team['members'].append(new_member)
                table.put_item(Item=team)
                return jsonify({'status': 'User added to the team'})

            else:
                return jsonify({'status': 'Unknown action'})

        else:
            return jsonify({'status': 'No action provided'})

    else:
        return jsonify({'status': 'Team not found'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
