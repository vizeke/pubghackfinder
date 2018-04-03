# import rhinoscriptsyntax as rs
import json
import numpy as np

#prompt the user for a file to import
#filter = "JSON file (*.json)|*.json|All Files (*.*)|*.*||"
#filename = rs.OpenFileName("Open JSON File", filter)

filename = './telemetry.json'

#Read JSON data into the datastore variable
with open(filename, 'r') as f:
    datastore = json.load(f)

#Use the new datastore datastructure
#print(datastore[1])
#print(len(datastore))

def distance(p1, p2):
    p1 = np.array([p1['x'], p1['y'], p1['z']])
    p2 = np.array([p2['x'], p2['y'], p2['z']])

    return np.linalg.norm(p1-p2)

positions = [x for x in datastore if x['_T'] == 'LogPlayerPosition']
positions.sort(key = lambda x: (x['character']['name'], x['_D']))

old = []
for x in positions[5:105]:
    if old != []:
        print(old['character']['location'], x['character']['location'], distance(old['character']['location'], x['character']['location']))
    old = x


print(len(positions))
print(positions[0])
print(positions[1])
#print(positions[2])
#print(positions[3])
#print(positions[4])

