from urllib.request import urlopen
from urllib.request import Request

import imghdr

pID = [356166,215208,364088,356162,296827,323339,183882,321682,367261,319358,366309,239237,354859,379939,296994,305708,354883,354875,366573,376285,379942,354873,323326,50485]
Name = ["Cedric SI MOHAMMED","Madjid BOUGUERRA","Faouzi GHOULAM","Esseid BELKALEM","Rafik HALLICHE","Djamel MESBAH","Hassan YEBDA","Medhi LACEN","Nabil GHILAS","Sofiane FEGHOULI","Yacine BRAHIMI","Carl MEDJANI","Islam SLIMANI","Nabil BENTALEB","El Arabi SOUDANI","Mohamed ZEMMAMOUCHE","Liassine CADAMURO","Abdelmoumene DJABOU","Saphir TAIDER","Aïssa Mandi","Riyad MAHREZ","Mehdi MOSTEFA","Rais MBOLHI","HALILHODZIC Vahid"]
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
