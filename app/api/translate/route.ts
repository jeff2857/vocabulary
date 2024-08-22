import md5 from 'md5';
import dotenv from 'dotenv';

dotenv.config();

const baseUrl = 'https://fanyi-api.baidu.com/api/trans/vip/translate';

const appid = process.env.APPID;
const secKey = process.env.SEC_KEY;

export async function POST(request: Request) {
	const { word } = await request.json();
	const salt = Math.floor(Math.random() * Math.pow(10, 10));
	const msg = `${appid}${word}${salt}${secKey}`;
	const sign = md5(msg);
	const url = `${baseUrl}?q=${word}&from=en&to=zh&appid=${appid}&salt=${salt}&sign=${sign}`;

	try {
		const res = await fetch(url, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			mode: 'no-cors',
			method: 'POST',
		});
		const resJson = await res.json();
		const dst = resJson.trans_result[0].dst;
		return Response.json({ dst });
	} catch (err: any) {
		console.error(err);
		return Response.json({});
	}
}
