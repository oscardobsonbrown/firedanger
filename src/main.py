#!/usr/bin/env python3
from __future__ import print_function
import ftplib
import datetime
import sys
import xml.etree.ElementTree as ET
import json

# ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/ALL.chr14.phase3_shapeit2_mvncall_integrated_v5a.20130502.genotypes.vcf.gz


def log(msg):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %T")
    print('[-- {} --] {}'.format(timestamp, msg), file=sys.stderr)


# ftp://ftp.bom.gov.au/anon/gen/fwo/IDW15100.xml
server = 'ftp.bom.gov.au'
directory = 'anon/gen/fwo'

vcf = 'IDW15100.xml'

log("connecting to server")
ftp = ftplib.FTP(server)
ftp.login()

log("changing to directory: {}".format(directory))
ftp.cwd(directory)
ftp.retrlines('LIST')

log("starting to download: {}".format(vcf))
ftp.retrbinary("RETR {}".format(vcf), open(vcf, 'wb').write)
log("finished download")

ftp.quit()

# Pass the path of the xml document
tree = ET.parse('IDW15100.xml')

# get the parent tag
root = tree.getroot()

# print the root (parent) tag along with its memory location
print(root)

#
# PARSING XML FROM HERE
#

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
