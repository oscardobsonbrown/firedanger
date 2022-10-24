#!/usr/bin/env python
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

# print the attributes of the first tag
# print(root[0].attrib)

# print the text contained within the subtag
# print(root[1][1][0][0].text)

dct = {}

# print("{")
i = 1
for x in range(1, 48):
    dct[i] = {}
    # output.append("\t {")

    # get the attributes from the tag and turn into key:value pairs
    # fixed thanks to: https://www.freecodecamp.org/news/keyerror-in-python-how-to-fix-dictionary-error/
    s = root[1][i].attrib
    # print("\t \t 'district' :", "'", s['description'], "',")
    strDistrict = str(s['description'])
    lowerDistrict = strDistrict.lower()
    dct[i] = {'district': lowerDistrict}
    # get the fire danger index from the xml file
    fdi = int(root[1][i][0][0].text)

    if fdi < 12:
        # print("\t \t 'danger': 'no rating',")
        dct[i].update({'danger': 'no rating'})
        # print("\t \t 'fdi': ", int(root[1][i][0][0].text), ",")
        dct[i].update({'fdi': fdi})
    elif fdi < 23:
        # print("\t \t 'danger': 'moderate',")
        dct[i].update({'danger': 'moderate'})
        # print("\t \t 'fdi':", int(root[1][i][0][0].text), ",")
        dct[i].update({'fdi': fdi})
    elif fdi < 49:
        # print("\t \t 'danger': 'high',")
        dct[i].update({'danger': 'high'})
        # print("\t \t 'fdi':", int(root[1][i][0][0].text), ",")
        dct[i].update({'fdi': fdi})
    elif fdi < 99:
        # print("\t \t 'danger': 'extreme',")
        dct[i].update({'danger': 'extreme'})
        # print("\t \t 'fdi':", int(root[1][i][0][0].text), ",")
        dct[i].update({'fdi': fdi})
    else:
        # print("\t \t 'danger': 'catastrophic',")
        dct[i].update({'danger': 'catastrophic'})
        # print("\t \t 'fdi':", int(root[1][i][0][0].text), ",")
        dct[i].update({'fdi': fdi})
    # print("\t }")
    print(dct[i])
    i += 1
# print("}")

print(dct)

json.dumps(dct)

with open("ftp_data.json", "w") as write_file:
    json.dump(dct, write_file, indent=4)
