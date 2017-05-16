(function($)
{
    $.fn.meteoPlugin=function(options){

        var defauts={
            top: 20,
            left: 100
        };
        var options = $.extend(defauts, options);


        var urls = {
            bordeaux : "http://www.prevision-meteo.ch/services/json/Bordeaux",
            marseille :  "http://www.prevision-meteo.ch/services/json/Marseille",
            paris :  "http://www.prevision-meteo.ch/services/json/Paris",
            lyon :  "http://www.prevision-meteo.ch/services/json/Lyon",
            barbezieux :  "http://www.prevision-meteo.ch/services/json/Barbezieux-Saint-Hilaire",
            lamothemontravel : "http://www.prevision-meteo.ch/services/json/Lamothe-Montravel",
            metz : "http://www.prevision-meteo.ch/services/json/Metz"
        };
        function makePluginCss (self) {
            var optionsCss = {
                width : 350,
                height : 350,
                position : 'absolute',
                background : '#757575',
                boxShadow: '6px 5px 5px black',
                borderRadius: '5px 10px 0 5px',
                zIndex : 99,
                top: options.top,
                left : options.left
            };
            self.css(optionsCss);
        }

        function getHtmlPlugin () {
            var html =  '<div style="text-align: center; font-size: 30px; color: white; Font-Weight: Bold; text-decoration: underline;">plugin meteo</div> <br>';
            html += '<div style="text-align: center; color: white; font-size: 20px;">Nous somme le : <span class="day-meteo">day</span></div>';
            html += '<div style="text-align: center; color: white;">Il est : <span class="hour-meteo">hour</span></div>';
            html += '<div style="text-align: center; color: white;"><span>';

            html += '<select class="selecteur">';

            for (var key in urls) {
                html += '<option value="'+urls[key]+'">'+ key +'</option>';
            }

            html += '</select>';

            html += '<div style="text-align: center; color: white;">Il fait : <span class="tmp-meteo">tmp</span><span>°C</span> , <span class="tmpp-meteo2">tmpp</span><span>°F</span> </div>';
            html += '<div style="text-align: center; color: white;"><span class="condition-meteo">condition</span></div> <br>';
            html += '<div class="icone-meteo" style="text-align: center; color: white;"><img src=" "/></div>';
            html += '<div style="text-align: center; color: white;"><button type="button" class="btn-refresh"><img style="width:15px; height:15px;" src="http://simpleicon.com/wp-content/uploads/refresh.png"></button></div>';
            return html;
        }

        function addListeners (self) {
            $('.btn-refresh', self).click(function(){
                var url = $('.selecteur', self).val();
                launchProcess(url, self);
            });

            $('.selecteur', self).change(function(){
                var url = $(this).val();
                launchProcess(url, self);
            });
        }
        function getDataMeteo (urlMeteo) {
            return $.ajax(urlMeteo);
        }

        function launchProcess(urlMeteo , self) {
            getDataMeteo(urlMeteo)
                .then(function(datas){
                    var currentCondition = datas.current_condition;
                    var tmpp = currentCondition.tmp * 1.8 + 32;
                    console.log(tmpp);
                    $(".tmpp-meteo2", self).text(tmpp);

                    var currentCondition = datas.current_condition;
                    var tmp = currentCondition.tmp;
                    console.log(tmp);
                    $(".tmp-meteo", self).text(tmp);

                    var city_info =datas.city_info;
                    var name = city_info.name;
                    console.log(name);
                    $(".name-meteo", self).text(name);
                    var fcst_day_0 =datas.fcst_day_0;
                    var day = fcst_day_0.date;
                    console.log(day);
                    $(".day-meteo", self).text(day);
                    var fcst_day_0 =datas.fcst_day_0;
                    var condition = fcst_day_0.condition;
                    console.log(condition);
                    $(".condition-meteo", self).text(condition);
                    var fcst_day_0 =datas.fcst_day_0;
                    var icon = fcst_day_0.icon_big;
                    console.log(icon);
                    $(".icone-meteo img", self).attr("src",icon);
                    setInterval(function(){
                        var hour = new Date().toLocaleTimeString();
                        $(".hour-meteo",  self).text(hour);
                    }, 1000);
                });
        }

        return this.each(function(){
            var self = $(this);
            makePluginCss(self);
            var html = getHtmlPlugin();
            self.html(html);
            addListeners(self);
            launchProcess(urls.bordeaux, self);
        });
    };
})(jQuery);