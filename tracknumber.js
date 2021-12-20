
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
	switch(iso) {
		case "AE":
			return "ОАЭ";
		case "AM":
			return "Армения";
		case "AR":
			return "Аргентина";
		case "AT":
			return "Австрия";
		case "AU":
			return "Австралия";
		case "AZ":
			return "Азербайджан";
		case "BG":
			return "Болгария";
		case "BR":
			return "Бразилия";
		case "BY":
			return "Белоруссия";
		case "CA":
			return "Канада";
		case "CH":
			return "Швейцария";
		case "CN":
			return "Китай";
		case "CU":
			return "Куба";
		case "CZ":
			return "Чехия";
		case "DE":
			return "Германия";
		case "DK":
			return "Дания";
		case "EE":
			return "Эстония";
		case "EG":
			return "Египет";
		case "ES":
			return "Испания";
		case "FI":
			return "Финляндия";
		case "FR":
			return "Франция";
		case "GB":
			return "Великобритания";
		case "GE":
			return "Грузия";
		case "GR":
			return "Греция";
		case "GL":
			return "Гренландия";
		case "HK":
			return "Гонконг";
		case "HU":
			return "Венгрия";
		case "IE":
			return "Ирландия";
		case "IL":
			return "Израиль";
		case "IN":
			return "Индия";
		case "IR":
			return "Иран";
		case "IS":
			return "Исландия";
		case "IT":
			return "Италия";
		case "JP":
			return "Япония";
		case "KG":
			return "Киргизия";
		case "KP":
			return "Северная Корея";
		case "KR":
			return "Южная Корея";
		case "KZ":
			return "Казахстан";
		case "LT":
			return "Литва";
		case "LV":
			return "Латвия";
		case "MC":
			return "Монако";
		case "MD":
			return "Молдавия";
		case "MN":
			return "Монголия";
		case "MX":
			return "Мексика";
		case "NO":
			return "Норвегия";
		case "NZ":
			return "Новая Зеландия";
		case "PH":
			return "Филиппины";
		case "PL":
			return "Польша";
		case "PT":
			return "Португалия";
		case "RO":
			return "Румыния";
		case "RS":
			return "Сербия";
		case "RU":
			return "Россия";
		case "SA":
			return "Саудовская Аравия";
		case "SE":
			return "Швеция";
		case "SG":
			return "Сингапур";
		case "SI":
			return "Словения";
		case "SK":
			return "Словакия";
		case "TJ":
			return "Таджикистан";
		case "TM":
			return "Туркмения";
		case "TR":
			return "Турция";
		case "TW":
			return "Тайвань";
		case "UA":
			return "Украина";
		case "US":
			return "США";
		case "VE":
			return "Венесуэла";
		case "VN":
			return "Вьетнам";
		case "UZ":
			return "Узбекистан";
		default:
			return iso
	}
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