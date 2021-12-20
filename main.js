
function update_info()
{
	const tracknum = document.getElementById("tracknum").value;
		
	const info = tracknum_info(tracknum);
	
	switch(info.type) {
		case tracknum_ww:
			document.getElementById("tracknum_type").innerHTML = "Международный трек-номер";
			break;
		case tracknum_ru:
			document.getElementById("tracknum_type").innerHTML = "Российский трек-номер";
			break;
		case tracknum_int:
			document.getElementById("tracknum_type").innerHTML = "Внутренний трек-номер";
			break;
		case tracknum_unknown:
			document.getElementById("tracknum_type").innerHTML = "Неизвестный тип трек-номера";
			break;
		default:
			document.getElementById("tracknum_type").innerHTML = "Трек-номер";
	}
	
	if(info.mail_info === "")
		document.getElementById("mail_info").className = "hidden_block";
	else {
		document.getElementById("mail_info").className = "";
		document.getElementById("mail_info").innerHTML = info.mail_info;
	}
	
	if(info.country_info === "")
		document.getElementById("country_info").className = "hidden_block";
	else {
		document.getElementById("country_info").className = "";
		document.getElementById("country_info").innerHTML = "Место отправления " + info.country_info;
	}
	
	if(info.index === "")
		document.getElementById("index").className = "hidden_block";
	else {
		document.getElementById("index").className = "";
		document.getElementById("index").innerHTML = "Индекс отправителя: " + info.mail_info;
	}
		
	if(info.checksum_correct === true || info.checksum_correct === false) {
		if(info.checksum_correct === true) {
			document.getElementById("correct_checksum").className = "";
			document.getElementById("wrong_checksum").className = "hidden_block";
			document.getElementById("postal_link").href = "https://www.pochta.ru/tracking#" + tracknum;
		} else {
			document.getElementById("correct_checksum").className = "hidden_block";
			document.getElementById("wrong_checksum").className = "";
			document.getElementById("postal_link").href = "";
		}
	}
}
