from urllib.request import urlopen
from urllib.request import Request

import imghdr

pID = [358106,290864,216880,216004,290904,290821,358120,290902,358112,273996,290903,298738,380663,358114,375523,290824,379911,216874,290825,379910,216006,358108,290822,44755]
Name = ["Thibaut COURTOIS","Toby ALDERWEIRELD","Thomas VERMAELEN","Vincent KOMPANY","Jan VERTONGHEN","Axel WITSEL","Kevin DE BRUYNE","Marouane FELLAINI","Romelu LUKAKU","Eden HAZARD","Kevin MIRALLAS","Simon MIGNOLET","Sammy BOSSUT","Dries MERTENS","Daniel VAN BUYTEN","Steven DEFOUR","Divock ORIGI","Nicolas LOMBAERTS","Moussa DEMBELE","Adnan JANUZAJ","Anthony VANDEN BORRE","Nacer Chadli","Laurent CIMAN","WILMOTS Marc"]
headers = {'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:23.0) Gecko/20100101 Firefox/23.0'}
for i in range (0, len(pID)):
	imgurl = 'http://img.fifa.com/images/fwc/2014/players/prt-1/' + str(pID[i]) + '.png'
	print(imgurl)
	req = Request(url=imgurl, headers=headers)
	content = urlopen(req).read()
	imgtype = imghdr.what('', h=content)
	if not imgtype:
		imgtype = 'txt'
	with open('{}.{}'.format(Name[i], imgtype), 'wb') as f:
		f.write(content)
