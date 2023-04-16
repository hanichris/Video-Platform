#!/usr/bin/env python3
"""Upload module."""

import http.client
import mimetypes
from codecs import encode

conn = http.client.HTTPSConnection("localhost", 5000)
dataList = []
boundary = 'wL36Yn8afVp8Ag7AmP8qZ0SA4n1v9T'
dataList.append(encode('--' + boundary))
dataList.append(encode('Content-Disposition: form-data; name=title;'))

dataList.append(encode('Content-Type: {}'.format('text/plain')))
dataList.append(encode(''))

dataList.append(encode("my video 1"))
dataList.append(encode('--' + boundary))
dataList.append(encode('Content-Disposition: form-data; name=description;'))

dataList.append(encode('Content-Type: {}'.format('text/plain')))
dataList.append(encode(''))

dataList.append(encode("It is an owesome video"))
dataList.append(encode('--' + boundary))
dataList.append(encode('Content-Disposition: form-data; name=video; filename={0}'.format('image.png')))

fileType = mimetypes.guess_type('/home/chalo/Desktop/ALX_Projects/alx-files_manager/image.png')[0] or 'application/octet-stream'
dataList.append(encode('Content-Type: {}'.format(fileType)))
dataList.append(encode(''))

with open('/home/chalo/Desktop/ALX_Projects/alx-files_manager/image.png', 'rb') as f:
  dataList.append(f.read())
dataList.append(encode('--'+boundary+'--'))
dataList.append(encode(''))
body = b'\r\n'.join(dataList)
payload = body
headers = {
  'X-Token': '509c91d8-b0e8-477d-9992-84b1ba6ff933',
  'Authorization': 'Basic Ym9iQGR5bGFuLmNvbTpwYXNzd29yZA==',
  'Content-type': 'multipart/form-data; boundary={}'.format(boundary)
}
conn.request("POST", "/api/v1/upload", payload, headers)
res = conn.getresponse()
data = res.read()
print(data.decode("utf-8"))
