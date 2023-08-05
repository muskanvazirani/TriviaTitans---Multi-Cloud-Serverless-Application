import json
import requests
import urllib3
import json
import boto3
client = boto3.client('dynamodb')
dynamodb =  boto3.resource('dynamodb')
result = {}
intent=""


def lambda_handler(event, context):
  intent_name = event['sessionState']['intent']['name']
  response = None
  if intent_name == 'Score':
     return checkScore(event)
  raise Exception('Intent with name ' + intent_name + ' not supported')
  return response

def checkScore(intent_request):
    session_attributes = get_session_attributes(intent_request)
    team = get_slot(intent_request, 'Team')

    if not team:
        return elicit_slot(intent_request, session_attributes, 'Team', "Which team?")

    score =  get_score(team,)
    if score:
        message = "Following are the scores for Team {} in different categories:\n".format(team.upper())
        for i in score:
            message = message + i +"\n"
    else:
        message = "Sorry, we have no team with name {}".format(team.upper())
    return close(intent_request, session_attributes, "Fulfilled", message)

def get_category(team):
    result = []
    count = 0
    table =  dynamodb.Table('GameScores').scan()
    for i in table['Items']:
        if  (i['TeamName'].lower() == team):
                result.append(i['Category'])
    return result

def get_score(team):
    result = []
    count = 0
    table =  dynamodb.Table('GameScores').scan()
    for i in table['Items']:
        if  (i['TeamName'].lower() == team):
                result.append(i['Category'] + " - " + str(i['Score']))
    return result

def close(intent_request, session_attributes, fulfillment_state, message):
   intent_request['sessionState']['intent']['state'] = fulfillment_state
   return {
       'sessionState': {
           'sessionAttributes': session_attributes,
           'dialogAction': {
               'type': 'Close'
           },
           'intent': intent_request['sessionState']['intent']
       },
       'messages': [{
           'contentType': 'PlainText',
           'content': message
       }],
       'sessionId': intent_request['sessionId'],
       'requestAttributes': intent_request['requestAttributes'] if 'requestAttributes' in
       intent_request else None
   }

def get_session_attributes(intent_request):
   session_state = intent_request['sessionState']
   if 'sessionAttributes' in session_state:
       return session_state['sessionAttributes']
   return {}

def get_slot(intent_request, slot_name):
   slots = get_slots(intent_request)
   if slots is not None and slot_name in slots and slots[slot_name] is not None:
       return slots[slot_name]['value']['interpretedValue']
   else:
       return None


def get_slots(intent_request):
   return intent_request['sessionState']['intent']['slots']


def elicit_slot(intent_request, session_attributes, slot_to_elicit, message):
   return {
       'sessionState': {
           'sessionAttributes': session_attributes,
           'dialogAction': {
               'type': 'ElicitSlot',
               'slotToElicit': slot_to_elicit,
           },
           'intent': intent_request['sessionState']['intent']
       },
       'messages': [{
           'contentType': 'PlainText',
           'content': message
       }],
       'sessionId': intent_request['sessionId'] ,
       'requestAttributes': intent_request['requestAttributes'] if 'requestAttributes' in intent_request else None
   }