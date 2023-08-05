import json
import boto3

def lambda_handler(event, context):
    bot_id = '4DBLGXINLU'       # Replace with your bot's ID
    #bot_alias_id = 'I85EPVDEZS'    # newAlias for V1
    bot_alias_id = 'TSTALIASID' # TestBotAlias for Draft


    lex_runtime = boto3.client('lexv2-runtime')

    try:
        response = lex_runtime.recognize_text(
            botId=bot_id,
            botAliasId=bot_alias_id,
            localeId='en_US',
            sessionId='user123',
            text=event['message']
        )

        reply_message = response['messages'][0]['content']

        # Add CORS headers to allow cross-origin requests
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type'
        }

        # Return the user data in the Lambda response
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(reply_message),
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': str(e)
        }