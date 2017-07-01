$(document).ready(function () {
	google.maps.event.addDomListener(window, 'load', init);

	function init() {
	    var input = document.getElementById('city');
	    var autocomplete = new google.maps.places.Autocomplete(input);
	}
	function mapSettings(lat, lng) {
		var coords = {lat: lat, lng: lng};
		var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 10,
			center: coords
		});
		var marker = new google.maps.Marker({
			position: coords,
			map: map
		});
	}
	init();
	var date = new Date();
	var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	$('#datetimepicker').datetimepicker({
		locale: 'ru',
		format: 'DD.MM.YY',
		allowInputToggle: true,
		minDate: today,
		maxDate: moment().add(4, 'd').toDate()
	});
	var city = $('#city');
	var dateinput = $('#datetimepicker input');
	var datepicker = $('#datetimepicker');
	var error = 0;
	$('.btn-send').click(function() {
		if (city.val() != '' && dateinput.val() != '') {
			city.removeClass('warning');
			dateinput.removeClass('warning');
			$('#weather-table').fadeOut();
			$('#map').fadeOut();
			$.get('http://api.openweathermap.org/data/2.5/forecast/daily?q=' + city.val() + '&APPID=8877707839064c9331f975ece3ad7cc6&units=metric')
			
			.done(function(response) {
				$('.bold').removeClass('bold');
				city.val('');
				mapSettings(response.city.coord.lat, response.city.coord.lon);
				 
				var months = [ 'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря' ];
				for (var i = 0; i < 5; i ++) {
					error = error + 2;
					//console.log(response.list);
					var elem = response.list[i];
					var dayOfWeek = moment().add(i, 'day').locale("ru").format('dddd');
					var dayMonth = moment().add(i, 'day').format('DD') + ' ' + months[moment().add(i, 'day').format('M')-1];
					var dayWeatherIcon = elem.weather[0].icon;
					console.log(error);
					var mornTemp = Math.floor(elem.temp.morn);
					var dayTemp = Math.floor(elem.temp.day);
					var evenTemp = Math.floor(elem.temp.eve);
					var nightTemp = Math.floor(elem.temp.night);
					if (i != 0) 
						$($('.day-of-week')[i]).html(dayOfWeek);
					if (dateinput.val() == moment.unix(elem.dt).format("DD.MM.YY")) {
						$('#weather-table tr').each(function(ind) {
							$($(this).find('td')[i + 1]).addClass('bold');
						})
					}
					$($('.day-month')[i]).html(dayMonth);
					$($('.weather-icon')[i]).html('<img src="http://openweathermap.org/img/w/' + dayWeatherIcon  + '.png">');
					$($('.morn-temp')[i]).html(mornTemp + ' &deg;C');
					$($('.day-temp')[i]).html(dayTemp + ' &deg;C');
					$($('.even-temp')[i]).html(evenTemp + ' &deg;C');
					$($('.night-temp')[i]).html(nightTemp + ' &deg;C');
				}
								
				$('#weather-table').fadeIn();
				$('#map').fadeIn();
				datepicker.on('dp.change', function() {
					var val = dateinput.val();
					var day = parseInt(val.substr(0, 2));
					var month = parseInt(val.substr(3, 2));
					$('.bold').removeClass('bold');
					$('.day-month').each(function(ind) {
						if ($($('.day-month')[ind]).text() == day + ' ' + months[month - 1]) {
							$('#weather-table tr').each(function() {
								$($(this).find('td')[ind + 1]).addClass('bold');
							})
						}
					})
				})
			})
			.fail(function() {
   			 alert( "Город не найден!" );
  		})
		} else {
			if (city.val() == '') {
				city.addClass('warning');
				dateinput.removeClass('warning');
				alert ("Введите населенный пункт!");
			} 
			if (dateinput.val() == '') {
				dateinput.addClass('warning');
				city.removeClass('warning');
				alert ("Введите дату!");
			}				  
		}
	})
})