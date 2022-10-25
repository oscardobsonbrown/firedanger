import xml.etree.ElementTree as ET
import json

tree = ET.parse('./IDW15100.xml')
root = tree.getroot()

districtList = []

# print("{")
i = 1
for x in range(1, 48):
    campground = {}
    # print(campground)

    # get the attributes from the tag and turn into key:value pairs
    # fixed thanks to: https://www.freecodecamp.org/news/keyerror-in-python-how-to-fix-dictionary-error/
    s = root[1][i].attrib
    strDistrict = str(s['description'])
    lowerDistrict = strDistrict.lower()
    campground[i] = {'district': lowerDistrict}
    # print(campground)

    # get the fire danger index from the xml file
    fdi = int((root[1][i][0][0].text))

    if fdi < 12:
        campground[i].update({'danger': 'no rating'})
        campground[i].update({'fdi': fdi})

    elif fdi < 23:
        campground[i].update({'danger': 'moderate'})
        campground[i].update({'fdi': fdi})

    elif fdi < 49:
        campground[i].update({'danger': 'high'})
        campground[i].update({'fdi': fdi})

    elif fdi < 99:
        campground[i].update({'danger': 'extreme'})
        campground[i].update({'fdi': fdi})

    else:
        campground[i].update({'danger': '⚠️ catastrophic'})
        campground[i].update({'fdi': fdi})

    print(campground[i])
    districtList.append(campground[i])
    i += 1

print(districtList)

json.dumps(districtList)

with open("./src/ftp_data.json", "w") as write_file:
    json.dump(districtList, write_file, indent=4)
