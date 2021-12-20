
const tracknum_ww = 0, tracknum_ru = 1, tracknum_int = 2, tracknum_unknown = 3;

function mail_info(sign)
{
	switch(sign[0]) {
		case 'R':
			return 'Регистрируемое отправление (до 2 кг)';
		case 'L':
			return 'Отслеживоемое письмо';
		case 'V':
			return 'Письмо с объявленной ценностью';
		case 'C':
			return 'Международная посылка (более 2 кг)';
		case 'E':
			return 'Экспресс отправление (EMS)';
		case 'U':
			return 'Нерегистрируемое и неотслеживаемое отправление';
		case 'Z':
			return 'Простой регистрируемый пакет (SRM)';
		default:
			return sign;
	}
}

function country_info(iso)
{
	return iso;
}

function is_num(text)
{
	for(let i = 0; i < text.length; i++) {
		let c = text.charCodeAt(i);
		if(c < 0x30 || c > 0x39)
			return false;
	}
	
	return true;
}

function check_checksum_ww(tracknum)
{
	const control = tracknum.charCodeAt(10)-0x30;
	const num1 = tracknum.charCodeAt(2)-0x30;
	const num2 = tracknum.charCodeAt(3)-0x30;
	const num3 = tracknum.charCodeAt(4)-0x30;
	const num4 = tracknum.charCodeAt(5)-0x30;
	const num5 = tracknum.charCodeAt(6)-0x30;
	const num6 = tracknum.charCodeAt(7)-0x30;
	const num7 = tracknum.charCodeAt(8)-0x30;
	const num8 = tracknum.charCodeAt(9)-0x30;
	
	let calc_control = 11-(num1*8+num2*6+num3*4+num4*2+num5*3+num6*5+num7*9+num8*7)%11;
	if(calc_control === 10)
		calc_control = 0;
	else if(calc_control === 11)
		calc_control = 5;
	
	return calc_control === control;
}

function check_checksum_ru(tracknum)
{
	const control = tracknum.charCodeAt(13)-0x30;
	let sum1 = 0;
	let sum2 = 0;
	
	for(let i = 0; i < 14; i += 2)
		sum1 += tracknum.charCodeAt(i)-0x30;
	sum1 *= 3;
	
	for(let i = 1; i < 13; i += 2)
		sum2 += tracknum.charCodeAt(i)-0x30;
	
	let calc_control = 10-(sum1+sum2)%10;
	
	return control === calc_control;
	
	return null;
}

function tracknum_info(tracknum)
{
	let info = {
		type : tracknum_unknown,
		mail_info : "",
		country_info : "",
		checksum_correct : null,
		index : ""
	};
	
	if(tracknum.length === 13 && is_num(tracknum) === false) {
		const sign = tracknum.slice(0, 2);
		const iso = tracknum.slice(11);
		
		info.type = tracknum_ww;
		info.mail_info = mail_info(sign);
		info.country_info = country_info(iso);
		info.checksum_correct = check_checksum_ww(tracknum);
	} else if(tracknum.length == 13 && is_num(tracknum) === true) {
		info.type = tracknum_int
	} else if(tracknum.length == 14) {
		info.type = tracknum_ru;
		info.index = tracknum.slice(0, 6);
		info.check_checksum_ru(tracknum);
	}
	
	return info;
}