/****
  Business hours widget 1.0
  by Piero Toffanin 2010
  http://www.pierotofy.it
 
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.
  
  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
 
 /* BUSINESS HOURS */
// The first element is the open time (15 = 3pm), the second element is the close time (21 = 9pm)
// Hours are expressed in military time
// 0 = Sunday, 6 = Saturday
// The widget will NOT work properly if the hours extend to the next day!
// If for example you are trying to set the Friday hours from 3pm to 2am, from midnight to 2am on friday
// the widget will say that the business is closed!

var bhours = new Array();
bhours[0] = new Array(15,21); // Sunday
bhours[1] = new Array(-1,-1); // Monday
bhours[2] = new Array(11,22); // Tuesday
bhours[3] = new Array(11,22); // Wednesday
bhours[4] = new Array(11,22); // Thursday
bhours[5] = new Array(11,0); // Friday
bhours[6] = new Array(15,0); // Saturday


/* HOLIDAYS */
// During these days (if var is true) the widget will not display a "we're open"/"we're closed" message
// but it will display a "Call us to find out" message instead.
var christmasHoliday = true;
var chineseNewYearHoliday = true;
var thanksGivingHoliday = true;


/* CHINESE NEW YEAR */
// Finding out the chinese new year dates can be cumbersome; so we're going to use a table instead
var chineseNewYear = new Array();
chineseNewYear[2010] = new Array(1, 14); //2010 	February 14 	Tiger
chineseNewYear[2011] = new Array(1, 3);
chineseNewYear[2012] = new Array(0, 23);
chineseNewYear[2013] = new Array(1, 10);
chineseNewYear[2014] = new Array(0, 31);
chineseNewYear[2015] = new Array(1, 19);
chineseNewYear[2016] = new Array(1, 8);
chineseNewYear[2017] = new Array(0, 28); //2017 	January 28 	Rooster 
chineseNewYear[2018] = new Array(1, 16);
chineseNewYear[2019] = new Array(1, 5);


/* END CONFIGURATION, DON'T MODIFY ANYTHING BELOW THIS UNLESS YOU KNOW WHAT YOU'RE DOING */

var printableDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
var now = new Date();
var todayDayOfTheWeek = now.getDay(); 
var currentHour = now.getHours();
var currentMins = now.getMinutes();

function getBusinessHoursWidget(){

  var businessOpenHour = bhours[todayDayOfTheWeek][0];
  var businessCloseHour = bhours[todayDayOfTheWeek][1];
  if (businessCloseHour == 0) businessCloseHour = 24;
  var todayIsAHoliday = false;           
  var todayIsClosed = false;

  if ((christmasHoliday && now.getDate() == 25 && now.getMonth() == 11))
    todayIsAHoliday = true;
  
  if ((thanksGivingHoliday && now.getDate() == getThanksGivingDay() && now.getMonth() == 10))
    todayIsAHoliday = true;
    
  if ((chineseNewYearHoliday && isChineseNewYearDay()))
    todayIsAHoliday = true;
   
  var summaryMessage = ""; 
  if (todayIsClosed) summaryMessage = "Today We Are <u>Closed</u>";
  else if (todayIsAHoliday) summaryMessage = "Today is a holiday! Call us to find out if we are open";
  else if (currentHour >= businessOpenHour && currentHour < businessCloseHour) summaryMessage = "We Are <u>Open</u>";
  else{

    if (currentHour < businessOpenHour || currentHour >= businessCloseHour){
      if (businessOpenHour - currentHour > 1)
        summaryMessage = "We Open in " + (businessOpenHour - currentHour) + " hours!";
      else if (businessOpenHour - currentHour == 1)
        summaryMessage = "We Open in " + (60 - currentMins) + " minutes!";
    }
  }
  
  
  // Generate table
  var out = '<table summary="' + summaryMessage + '" class="businesshours">';

  for (var dayIndex = 1; dayIndex <= 6; dayIndex++){
     out += getBusinessHoursRow(dayIndex);
  }
  out += getBusinessHoursRow(0);
  
  out += '<tr>';
  out += '<td colspan="4" class="announcement">' + summaryMessage + '</td>';
  out += '</tr>';
  
  out += '</table>';  
  
  return out;
}


function isChineseNewYearDay(){
  var currentYear = now.getFullYear();
  if (currentYear > 2009 && currentYear < 2020){
     return chineseNewYear[currentYear][0] == now.getMonth() && chineseNewYear[currentYear][1] == now.getDate(); 
  }else return false;
}

function getThanksGivingDay(){
  var thursdays = 0;
  
  for (var i = 1; i<=30; i++){
    var date = new Date(now.getFullYear(),10,i);
    if (date.getDay() == 4) thursdays++;
    if (thursdays == 4) return i;
  }
  
  return 0; // Should never happen?
}

function getBusinessHoursRow(dayIndex){
  	var day = printableDays[dayIndex];
    var open = bhours[dayIndex][0];
    var close = bhours[dayIndex][1];
    
    if (todayDayOfTheWeek == dayIndex) todayClass = 'class="today"';
    else todayClass = '';
    
    out = '<tr ' + todayClass + '>';
    out += '<td class="day">' + day + '</td>';
    
    if (open === -1 || close === -1){
	out += '<td class="open" colspan=3 style="padding-right: 12px">Closed</td>'; 
    }else{
        out += '<td class="open">' + militaryToStandard(open) + '</td>';
        out += '<td class="to">to</td>';
        out += '<td class="close">' + militaryToStandard(close) + '</td>';
    }
    out += '</tr>';
    
    return out;
}

function militaryToStandard(hour){
  if (hour == 0) return "12am";
  else if (hour < 12) return hour + "am";
  else return hour-12 + "pm";
}
