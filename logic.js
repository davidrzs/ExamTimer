var jquery = require("jquery");
window.$ = window.jQuery = jquery; // notice the definition of global variables here





let nr_of_q = 0;
let nr_of_mins = 0;
let mins_per_q = 0;

let current_question = 0;

let timer_start = null;
let timer_function = null;

let pause_start = null;
let is_paused = false;


let is_dark = false;

$(document).ready(function() {

    // copied from https://stackoverflow.com/questions/29816872/how-can-i-convert-milliseconds-to-hhmmss-format-using-javascript/29816921
    function millisecondsToHuman(duration) {
        // code duplciations sucks - sorry
        if (duration > 0){


            let seconds = parseInt((duration / 1000) % 60);
            let minutes = parseInt((duration / (1000 * 60)) % 60);
            let hours = parseInt((duration / (1000 * 60 * 60)) % 24);
    
            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;
        
            return hours + ":" + minutes + ":" + seconds ;

        } else {
            duration = -duration;

            let seconds = parseInt((duration / 1000) % 60);
            let minutes = parseInt((duration / (1000 * 60)) % 60);
            let hours = parseInt((duration / (1000 * 60 * 60)) % 24);
    
            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;
        
            return hours + ":" + minutes + ":" + seconds ;

            
        }



      }

    function setDataAbove(){ 
        $('#nr_q').text(nr_of_q);
        $('#nr_mins').text(nr_of_mins);
        $('#mins_per_q').text(mins_per_q);
        // console.log("setData() executed");
    }

    function timeSetter(id,time){
        
        let time_in_millis = time.getTime();
        if(time_in_millis < 0){
            $(id).text('-'+millisecondsToHuman(time_in_millis));
            $(id).removeClass('blue');
            $(id).addClass('red');
        } else {
            $(id).text(millisecondsToHuman(time_in_millis));
            $(id).removeClass('red');
            $(id).addClass('blue');
        }
    }

 
    function setTimeData(){
        // + 1 to compensate for 0 based indexing
        $('#current_question').text(current_question + 1);

        let now = Date.now()
        let time_left_for_q = new Date(timer_start + (1000 * (current_question+1)*mins_per_q*60) - now);

        // console.log(time_left_for_q.toUTCString());
        
        timeSetter('#time_left_this_question',time_left_for_q);
        
        
        let total_time_left = new Date(timer_start + (nr_of_mins*60*1000) - now);
        // console.log(total_time_left.toUTCString());

        timeSetter('#total_time_left',total_time_left);


    }

    $("#entry").submit(function(event) {
        //https://stackoverflow.com/questions/2276463/how-can-i-get-form-data-with-javascript-jquery
        let vals = $('#entry').serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        console.log(vals);
        
        nr_of_mins = parseInt(vals["mins"]);
        nr_of_q = parseInt(vals["questions"]);
        mins_per_q = nr_of_mins / nr_of_q;

        current_question = 0;
        
        timer_start = null;
        clearInterval(timer_function);
        
        $('#entry').each(function(){
                this.reset();
        });
        console.log(nr_of_mins,nr_of_q,mins_per_q);
        setDataAbove();
        event.preventDefault();
    });

    $("#start").click(function(event) {
        current_question = 0;
        is_paused = false;
        timer_start = Date.now();

        clearInterval(timer_function);

        timer_function = setInterval(function(){
            if(!is_paused){
                setTimeData();
            }
        },100);

        console.log("start");
    });



    $("#advance").click(function(event) {
        current_question += 1;
        console.log("advance");
    });

    $("#pause").click(function(event) {
        if(is_paused){
            is_paused = false;
            time_was_paused = Date.now() - pause_start;
            pause_start = null;
            timer_start += time_was_paused;
        } else {
            is_paused = true;
            pause_start = Date.now()

        }


        setTimeData();
        console.log("pause toggled");
    });

    $("#dark-mode").click(function(event) {
        if(is_dark){
            $('.to_darken').removeClass('darken')
            $('body').removeClass('lightsoff');
            is_dark = false;
        } else {
            $('.to_darken').addClass('darken')
            $('body').addClass('lightsoff');
            is_dark = true;
        }
    });






});


