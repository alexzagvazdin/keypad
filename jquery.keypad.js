function findPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    return [curtop];
    }
}

var keypad_scroll_fix = 0;

document.addEventListener("deviceready", function(){

  // Adding proper scroll fix when content is opened insde the native app
    if(/iPhone|iPad|iPod|/i.test(navigator.userAgent) ) {  
      keypad_scroll_fix = 60;
  }
});

;(function($) {
  (function(pluginName) {
    var defaults = {
      keypadDiv: '#keypad_inner',
      keypadPlaceholderDiv: '#keypad_placeholder',
      height: 460,
      buttonTemplate: '<button></button>',
      deleteButtonText: 'Del',
      deleteButtonClass: 'delete',
      showDecimal: false,
      showIncDec: false,
      inputCssClass: ""
    };

      keypadVisible = false;

      function hideKeyPadIfRequired(e) {
        if (!$(event.target).parent().hasClass("keypad") && 
            !$(event.target).hasClass("keypad")) { 
          $("#keypad").hide();
          $(".typed-cursor").hide();
          $("#keypad_placeholder").hide();        
          $global_input.blur();
          keypadVisible = false;
        }
      }

      function rebuildKeypad(target) {

        if ($(target).hasClass("showIncDec")) {
          $('.number, .dec, .inc, .delete').css("height",  "18%");
          $(".dec, .inc").show();
        }
        else {
          $('.number, .dec, .inc, .delete').css("height",  "23%");
          $(".dec, .inc").hide();
        }
        if ($(target).hasClass("showDecimal")) {
          $(".zero").css("width", "31%");
          $(".decimal").show();
        }
        else {
          $(".zero").css("width", "64%");
          $(".decimal").hide();
        }

      } 

      var   $elem = $("#keypad_inner"),
            $elem_placeholder = $("#keypad_placeholder");

      $(document).ready(function() {
        $("body").append("<div id='keypad' class='keypad'><div id='keypad_top'><button id='keypad_done'>Done</button></div><div id='keypad_inner' class='keypad'></div></div><div id='keypad_placeholder'></div>");

        $elem = $("#keypad_inner"),
        $elem_placeholder = $("#keypad_placeholder");

        var numbers = Array.apply(null, Array(9)).map(function (_, i) {
          return $("<button></button>").html(i+1).addClass('number');
        });
        numbers.push($("<button></button>").html(".").addClass('number').addClass("decimal"));
        numbers.push($("<button></button>").html("0").addClass('number').addClass('zero'));
        numbers.push($("<button></button>").html("Del").addClass("delete"));
        numbers.push($("<button></button>").html("-").addClass('dec'));
        numbers.push($("<button></button>").html("+").addClass('inc'));
        $elem.html(numbers).addClass('keypad');


        $(document).on('touchend click', function(e) {
            hideKeyPadIfRequired(e);
            moveEvent = false;
        });
        $(document).on('touchmove', function(e) {
            if (keypadVisible)  { 
              hideKeyPadIfRequired(e);
            }
            moveEvent = true;
        });


        $elem.find('.number').on('touchend click', function(e) {
          event.stopPropagation();
          event.preventDefault();
          if(event.handled !== true) {
            if (!($(e.target).hasClass("decimal") && $global_input.val().indexOf(".") > -1)) {          
              $global_input.val($global_input.val() + $(e.target).text());
              $global_input.trigger('change');
              event.handled = true;
            }
          }
          else {
            return false;
          }
        });

        $elem.find('.delete').on('touchend click', function(e) {
          event.stopPropagation();
          event.preventDefault();
          if(event.handled !== true) {          
            $global_input.val($global_input.val().slice(0, -1));
            $global_input.trigger('change');
            event.handled = true;
          }
          else {
            return false;
          }
        });

        $elem.find('.inc').on('touchend click', function(e) {
          event.stopPropagation();
          event.preventDefault();
          if(event.handled !== true) {   
            $global_input.val( function(i, oldval) {
                 return ++oldval;
            });       
            $global_input.trigger('change');
            event.handled = true;
          }
          else {
            return false;
          }
        });

        $elem.find('.dec').on('touchend click', function(e) {
          event.stopPropagation();
          event.preventDefault();
          if(event.handled !== true) {   
            $global_input.val( function(i, oldval) {
                 return --oldval;
            });       
            $global_input.trigger('change');
            event.handled = true;
          }
          else {
            return false;
          }
        });

        $elem.find("button").on("touchstart mousedown", function(e) {
          $(e.target).addClass("pressed");
        });

        $elem.find("button").on("touchend mouseup", function(e) {
          $(e.target).removeClass("pressed");
        });

      })

      //using event delegation instead of binding for better performance on large forms

      $(document).on('touchstart', 'span.numinput', function(e) {
          //event.stopPropagation();
          event.preventDefault();
          if(event.handled !== true) {          
            keypadVisible = true;
            $(".typed-cursor").hide();
            $(e.target).find(".typed-cursor").show();
            rebuildKeypad(e.target);
            $("#keypad_placeholder").show();
            $("#keypad").slideDown();

            keypad_height = $("#keypad_placeholder").height();
            screen_height = $(window).height() - keypad_height;

            console.log('event');

            $("html, body").animate({ scrollTop: findPos(e.target) - 
              (screen_height - $(e.target).height() - 15) + keypad_scroll_fix}, 600);

            $global_input = $('#' + e.target.id.substring(6));

          }
          else {
            return false;
          }
      });

      $(document).on('click', 'span.numinput', function(e) {
        if(! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
          setTimeout(function() {
            if (!keypadVisible) {
              $("#" + e.target.id.substring(6)).show();
              $(e.target).hide();
              $("#" + e.target.id.substring(6)).focus();
            }
          }, 300);
        }
      });


    $.fn[pluginName] = function(options) {


      if(!'ontouchstart' in document.documentElement) return;

      var   $elem = $("#keypad_inner"),
            $elem_placeholder = $("#keypad_placeholder");



      options = $.extend(true, {}, defaults, options);
            
      return this.each(function() {

        var input = this,
          $input = $(input);


        if(!'ontouchstart' in document.documentElement) return;

        $input.after("<span class='keypad numinput " + options.inputCssClass + 
          "' id='keypad" + 
          input.id +
          "'><span class='before_cursor'></span><span class='typed-cursor blinking'>|</span></span>");
        $input.hide();
        $('#keypad' + input.id).find("span.before_cursor").html($input.val());

        $fake_input = $("#keypad" + input.id);

        if (options.showIncDec) {
          $fake_input.addClass("showIncDec");
        }
        if (options.showDecimal) {
          $fake_input.addClass("showDecimal");
        }

        $input.on('blur', function(e) {
          if ($('#keypad' + input.id).length) {
            $input.hide();
            $('#keypad' + input.id).show();
          }
        })

        $input.on('change', function(e) {
          if ($('#keypad' + input.id).length) {
            $('#keypad' + input.id).find("span.before_cursor").html($input.val());
          }
        });

      });
    };
    $.fn[pluginName].defaults = defaults;
  })('keypad');
})(jQuery);